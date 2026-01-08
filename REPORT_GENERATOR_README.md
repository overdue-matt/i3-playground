# Social Media Audit Report Generator

A Next.js-based PDF report generator for creating professional, branded social media audit reports using Tailwind CSS and print-optimized CSS.

## Features

- **Print-to-PDF Workflow**: Generate professional PDFs directly from the browser
- **10 Reusable Components**: Complete component library for building reports
- **Print-Optimized**: Proper page breaks, margins, and layout for professional output
- **Dynamic Routing**: Support for multiple client reports
- **TypeScript**: Fully typed for better developer experience

## Project Structure

```
/app/
  ├── components/report/
  │   ├── CoverPage.tsx              # Branded cover page
  │   ├── ExecutiveSummary.tsx       # Key takeaways section
  │   ├── TableOfContents.tsx        # Auto-generated TOC
  │   ├── Section.tsx                # Standard section wrapper
  │   ├── DataTable.tsx              # Reusable table component
  │   ├── StatCard.tsx               # Metric display cards
  │   ├── Callout.tsx                # Highlighted insights/warnings
  │   ├── KeyFinding.tsx             # Numbered findings
  │   ├── PerformanceChart.tsx       # Bar/comparison displays
  │   └── Footer.tsx                 # Page footer with branding
  │
  └── reports/[client]/
      └── page.tsx                   # Dynamic report page

/content/reports/
  └── jup-mobile-audit.ts            # Report data structure

/styles/
  └── print.css                      # Print-specific CSS
```

## Getting Started

### 1. Run the Development Server

```bash
npm run dev
```

### 2. View the Report

Navigate to: `http://localhost:3000/reports/jup-mobile`

### 3. Export to PDF

1. Click the "Export to PDF" button (bottom-right)
2. Or press `Cmd+P` (Mac) / `Ctrl+P` (Windows)
3. Select "Save as PDF" as the destination
4. Adjust settings if needed:
   - Paper size: Letter
   - Margins: Default
   - Background graphics: Enabled
5. Save your PDF

## Component Usage Guide

### CoverPage

```tsx
<CoverPage
  clientName="Jupiter Mobile"
  reportTitle="Social Media Audit Report"
  reportDate="January 6, 2026"
  logoUrl="/logo.png"
/>
```

### ExecutiveSummary

```tsx
<ExecutiveSummary
  summary={[
    "First key point...",
    "Second key point...",
    "Third key point..."
  ]}
/>
```

### Section

```tsx
<Section
  title="Account Analysis"
  subtitle="Performance Metrics & Insights"
  pageBreak={true}  // Force new page
  id="account-analysis"
>
  {/* Content goes here */}
</Section>
```

### DataTable

```tsx
<DataTable
  caption="Performance by Content Category"
  headers={['Metric', 'Value', 'Benchmark']}
  rows={[
    ['Engagement Rate', '1.40%', '0.8-1.2%'],
    ['Avg Impressions', '17,216', '10,000']
  ]}
  footnote="Data from June-December 2025"
/>
```

### StatCard

```tsx
<StatCard
  label="Total Posts Analyzed"
  value="411"
  subtext="7 months of content"
  trend="up"
  trendValue="24%"
/>
```

Display in grid:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard {...} />
  <StatCard {...} />
  <StatCard {...} />
</div>
```

### Callout

```tsx
<Callout type="insight" title="Key Performance Insight">
  The top 10 posts average 230,706 impressions...
</Callout>

{/* Types: insight, warning, success, neutral */}
```

### KeyFinding

```tsx
<KeyFinding
  number={1}
  title="Token Takeovers are massively underutilized"
  description="Only 7 posts made despite averaging 127k impressions..."
  impact="high"  // high, medium, low
/>
```

### PerformanceChart

```tsx
<PerformanceChart
  title="Content Category Comparison"
  data={[
    { label: 'Token Takeovers', value: 127456, color: 'bg-purple-600' },
    { label: 'Memes', value: 89234, color: 'bg-pink-600' }
  ]}
/>
```

## Creating a New Report

### 1. Create the Data File

Create a new file in `/content/reports/[client-name].ts`:

```typescript
import { ReportData } from './jup-mobile-audit';

export const clientNameData: ReportData = {
  meta: {
    clientName: 'Client Name',
    reportTitle: 'Social Media Audit Report',
    reportDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    logoUrl: '/path/to/logo.png'
  },
  executiveSummary: [
    'Point 1...',
    'Point 2...'
  ],
  tableOfContents: [
    { title: 'Executive Summary', page: 2 },
    // ...
  ],
  keyFindings: [
    {
      number: 1,
      title: 'Finding title',
      description: 'Description...',
      impact: 'high'
    }
  ],
  sections: []
};
```

### 2. Update the Report Page

Edit `/app/reports/[client]/page.tsx` to import your new data:

```typescript
import { clientNameData } from '@/content/reports/client-name';

// In the component:
const getReportData = (client: string) => {
  switch(client) {
    case 'jup-mobile':
      return jupMobileAuditData;
    case 'client-name':
      return clientNameData;
    default:
      return null;
  }
};
```

### 3. Access Your Report

Navigate to: `http://localhost:3000/reports/client-name`

## Customizing Branding

### Update Colors

Edit component files to change the color scheme:

```tsx
// Current: Blue accent
border-blue-600

// Change to: Purple accent
border-purple-600
```

### Add Logo

1. Place logo file in `/public/` directory
2. Update `logoUrl` in report data:

```typescript
meta: {
  logoUrl: '/impact3-logo.png'
}
```

### Modify Typography

Edit `/app/layout.tsx` to add custom fonts:

```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-your-font",
});
```

## Print CSS Customization

Edit `/styles/print.css` to adjust print behavior:

```css
@media print {
  @page {
    size: letter;  /* or A4 */
    margin: 0.75in;  /* adjust margins */
  }

  /* Add custom page breaks */
  .custom-break {
    break-before: page;
  }
}
```

## Tips for Best Results

### Page Breaks

- Use `pageBreak={true}` prop on Section components
- Add `section-break` class to force new page
- Use `avoid-break` class to keep elements together

### Tables

- Keep tables concise (avoid overly wide tables)
- Use footnotes for additional context
- Tables automatically repeat headers on new pages

### Images

- Place images in `/public/` directory
- Use appropriate file sizes (optimize before upload)
- Images will automatically scale to fit page width

### Content Length

- Aim for 20-40 pages for comprehensive reports
- Break long sections into subsections
- Use callouts to highlight key points

## Common Issues

### PDF Export Issues

**Problem**: Background colors not showing
- **Solution**: Enable "Background graphics" in print dialog

**Problem**: Page breaks in wrong places
- **Solution**: Add `avoid-break` class or adjust content length

**Problem**: Text cut off at page edges
- **Solution**: Adjust margins in `/styles/print.css`

### Development Issues

**Problem**: Components not updating
- **Solution**: Clear browser cache or hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

**Problem**: TypeScript errors
- **Solution**: Run `npm run build` to check for type errors

## Next Steps

1. **Add More Sections**: Expand the Jup Mobile report with additional analysis
2. **Create Templates**: Build reusable section templates for common analyses
3. **Add Charts**: Integrate Recharts or Chart.js for data visualization
4. **Automate Data**: Connect to analytics APIs to populate data automatically

## Support

For questions or issues:
- Check component examples in `/app/reports/[client]/page.tsx`
- Review component props in respective component files
- Refer to Tailwind CSS documentation for styling

## License

Internal use only - Impact3
