import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function POST(request: Request) {
  let browser;

  try {
    const { radarUrl } = await request.json();

    if (!radarUrl) {
      return NextResponse.json(
        { error: 'Radar URL is required' },
        { status: 400 }
      );
    }

    // Connect to the existing Chrome instance
    browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
    });

    const page = await browser.newPage();

    // Navigate to the radar URL
    await page.goto(radarUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a bit for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Inject and run the URL extraction script
    const posts = await page.evaluate(() => {
      return new Promise<{ url: string; index: number }[]>((resolve) => {
        // Capture URLs as posts are clicked
        const capturedUrls: string[] = [];
        let clickIndex = 0;

        // Override window.open to capture URLs
        const originalOpen = window.open;
        window.open = function(this: Window, url: string | URL | undefined, target?: string, features?: string) {
          if (url) {
            capturedUrls.push(url.toString());
          }
          return originalOpen.call(this, url, target, features);
        } as typeof window.open;

        // Get all post cards
        const postCards = Array.from(document.querySelectorAll('.cursor-pointer')).filter(card => {
          return card.querySelector('[href^="https://x.com/"]') && card.querySelector('[dir="auto"]');
        });

        console.log(`Found ${postCards.length} posts. Extracting URLs...`);

        // If no posts found, resolve immediately
        if (postCards.length === 0) {
          resolve([]);
          return;
        }

        // Click each post with a delay
        function clickNext() {
          if (clickIndex >= postCards.length) {
            // Restore original window.open
            window.open = originalOpen;

            // Return results
            const results = capturedUrls.map((url, index) => ({
              url: url,
              index: index
            }));
            resolve(results);
            return;
          }

          (postCards[clickIndex] as HTMLElement).click();
          clickIndex++;
          setTimeout(clickNext, 500);
        }

        // Start clicking
        clickNext();
      });
    });

    await page.close();

    return NextResponse.json({
      posts,
      count: posts.length
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to scrape posts',
        details: 'Make sure Chrome is running with --remote-debugging-port=9222'
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
}
