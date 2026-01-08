export interface ReportData {
  meta: {
    clientName: string;
    reportTitle: string;
    reportDate: string;
    logoUrl?: string;
  };
  executiveSummary: string[];
  tableOfContents: {
    title: string;
    page?: number;
    subsections?: string[];
  }[];
  keyFindings: {
    number: number;
    title: string;
    description: string;
    impact?: 'high' | 'medium' | 'low';
  }[];
  sections: any[];
}

export const jupMobileAuditData: ReportData = {
  meta: {
    clientName: 'Jupiter Mobile',
    reportTitle: 'Social Media Audit Report',
    reportDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  executiveSummary: [
    'Jupiter Mobile\'s Twitter presence shows strong engagement potential with 411 posts analyzed over 7 months, averaging 17,216 impressions per post.',
    'Top-performing content categories (Token Takeovers, Memes, Product Launches) achieve 30x higher impressions than standard posts, indicating significant opportunity for strategic content optimization.',
    'Current engagement rate of 1.40% exceeds industry benchmarks (0.8-1.2%), demonstrating effective community connection despite inconsistent posting strategy.',
    'Analysis reveals critical gaps in content distribution: high-performing formats are severely underutilized while lower-performing standard updates dominate the feed.',
    'Immediate implementation of the recommended content playbook could increase average impressions by 3-5x within 90 days through strategic reallocation of resources.'
  ],

  tableOfContents: [
    {
      title: 'Executive Summary',
      page: 2
    },
    {
      title: 'Key Findings',
      page: 4,
      subsections: [
        'Token Takeovers Underutilization',
        'Meme Content Opportunity',
        'Product Launch Strategy',
        'Community Engagement Patterns'
      ]
    },
    {
      title: 'Quick Wins Checklist',
      page: 6
    },
    {
      title: 'Part 1: Account Analysis',
      page: 8,
      subsections: [
        'Performance Metrics Overview',
        'Content Type Breakdown',
        'Engagement Analysis',
        'Timing & Frequency Insights'
      ]
    },
    {
      title: 'Part 2: Competitor Analysis',
      page: 15,
      subsections: [
        'Phantom Wallet',
        'Solflare',
        'Backpack',
        'Trust Wallet'
      ]
    },
    {
      title: 'Part 3: Voice & Messaging Framework',
      page: 22
    },
    {
      title: 'Part 4: Strategic Growth Opportunities',
      page: 26
    },
    {
      title: 'Part 5: Content Playbook',
      page: 30
    },
    {
      title: '30/60/90 Day Plan',
      page: 35
    }
  ],

  keyFindings: [
    {
      number: 1,
      title: 'Token Takeovers are massively underutilized',
      description: 'Only 7 posts made despite averaging 127k impressions each - highest performing category. This represents a 639% performance gap compared to standard posts.',
      impact: 'high'
    },
    {
      number: 2,
      title: 'Meme content drives exceptional engagement',
      description: 'Memes average 89k impressions (460% above baseline) but comprise less than 5% of total content. Community responds strongly to humor and cultural relevance.',
      impact: 'high'
    },
    {
      number: 3,
      title: 'Product launches lack consistent amplification',
      description: 'Product announcements average 71k impressions but posting frequency is irregular. Systematic launch protocol could maximize reach for strategic releases.',
      impact: 'medium'
    },
    {
      number: 4,
      title: 'Standard updates dilute feed performance',
      description: 'Generic status updates (62% of content) average only 7.6k impressions. Over-reliance on low-impact formats suppresses overall account metrics.',
      impact: 'medium'
    }
  ],

  sections: []
};
