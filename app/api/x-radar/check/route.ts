import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function GET() {
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
    });

    await browser.disconnect();

    return NextResponse.json({ connected: true });
  } catch (error) {
    return NextResponse.json({ connected: false, error: 'Chrome not running with remote debugging' });
  }
}
