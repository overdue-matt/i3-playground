'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CoverPage from '@/app/components/report/CoverPage';
import ExecutiveSummary from '@/app/components/report/ExecutiveSummary';
import TableOfContents from '@/app/components/report/TableOfContents';
import Section from '@/app/components/report/Section';
import KeyFinding from '@/app/components/report/KeyFinding';
import DataTable from '@/app/components/report/DataTable';
import StatCard from '@/app/components/report/StatCard';
import Callout from '@/app/components/report/Callout';
import PerformanceChart from '@/app/components/report/PerformanceChart';
import { jupMobileAuditData } from '@/content/reports/jup-mobile-audit';

export default function ReportPage() {
  const params = useParams();
  const client = params.client as string;

  // For now, only supporting jup-mobile
  // This can be expanded to load different reports based on client param
  const reportData = client === 'jup-mobile' ? jupMobileAuditData : null;

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Report Not Found
          </h1>
          <p className="text-gray-600">
            No report found for client: {client}
          </p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Button - Hidden in print */}
      <button
        onClick={handlePrint}
        className="print-button no-print"
      >
        📄 Export to PDF
      </button>

      {/* Cover Page */}
      <CoverPage
        clientName={reportData.meta.clientName}
        reportTitle={reportData.meta.reportTitle}
        reportDate={reportData.meta.reportDate}
        logoUrl={reportData.meta.logoUrl}
      />

      {/* Executive Summary */}
      <ExecutiveSummary summary={reportData.executiveSummary} />

      {/* Table of Contents */}
      <TableOfContents items={reportData.tableOfContents} />

      {/* Key Findings Section */}
      <Section title="Key Findings" pageBreak={true}>
        <p className="text-lg text-gray-700 mb-6">
          Based on our comprehensive analysis of 411 posts over 7 months, we&apos;ve identified
          four critical insights that present immediate opportunities for growth.
        </p>

        {reportData.keyFindings.map((finding) => (
          <KeyFinding
            key={finding.number}
            number={finding.number}
            title={finding.title}
            description={finding.description}
            impact={finding.impact}
          />
        ))}
      </Section>

      {/* Quick Wins Checklist */}
      <Section title="Quick Wins Checklist" pageBreak={true}>
        <Callout type="success" title="30-Day Implementation Guide">
          These high-impact, low-effort changes can be implemented immediately to boost
          performance while the comprehensive strategy is being developed.
        </Callout>

        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-5 h-5" />
            <div>
              <h4 className="font-semibold text-gray-900">
                Schedule 2-3 Token Takeover posts per month
              </h4>
              <p className="text-gray-600 text-sm">
                Focus on trending tokens with strong community overlap
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-5 h-5" />
            <div>
              <h4 className="font-semibold text-gray-900">
                Increase meme content to 15-20% of monthly posts
              </h4>
              <p className="text-gray-600 text-sm">
                Create a meme bank tied to product features and community culture
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-5 h-5" />
            <div>
              <h4 className="font-semibold text-gray-900">
                Develop product launch template with pre-scheduled amplification
              </h4>
              <p className="text-gray-600 text-sm">
                Include teaser, announcement, tutorial, and community showcase posts
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-5 h-5" />
            <div>
              <h4 className="font-semibold text-gray-900">
                Reduce generic status updates by 40%
              </h4>
              <p className="text-gray-600 text-sm">
                Replace with educational threads, user testimonials, and data insights
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-5 h-5" />
            <div>
              <h4 className="font-semibold text-gray-900">
                Implement weekly &quot;Feature Friday&quot; series
              </h4>
              <p className="text-gray-600 text-sm">
                Highlight one Jupiter Mobile feature with visuals and use case
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Part 1: Account Analysis */}
      <Section
        title="Part 1: Account Analysis"
        subtitle="Performance Metrics & Content Breakdown"
        pageBreak={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <StatCard
            label="Total Posts Analyzed"
            value="411"
            subtext="7 months of content"
          />
          <StatCard
            label="Average Impressions"
            value="17,216"
            subtext="Per post"
            trend="up"
            trendValue="24%"
          />
          <StatCard
            label="Engagement Rate"
            value="1.40%"
            subtext="Above industry benchmark"
            trend="up"
            trendValue="0.2%"
          />
        </div>

        <Callout type="insight" title="Key Performance Insight">
          The top 10 posts average 230,706 impressions while standard posts average just
          7,618. That&apos;s a <strong>30x performance gap</strong> - indicating massive
          opportunity through strategic content optimization.
        </Callout>

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Content Type Performance Breakdown
        </h3>

        <DataTable
          caption="Performance by Content Category"
          headers={['Content Type', 'Avg Impressions', 'Total Posts', '% of Feed']}
          rows={[
            ['Token Takeovers', '127,456', '7', '1.7%'],
            ['Memes', '89,234', '18', '4.4%'],
            ['Product Launches', '71,892', '12', '2.9%'],
            ['Educational Threads', '34,567', '31', '7.5%'],
            ['Community Spotlights', '28,445', '24', '5.8%'],
            ['Standard Updates', '7,618', '255', '62.0%'],
            ['Polls/Questions', '12,334', '45', '10.9%'],
            ['Partnership Announcements', '43,221', '19', '4.6%']
          ]}
          footnote="Analysis based on 411 posts from June 2025 - December 2025"
        />

        <div className="mt-8">
          <PerformanceChart
            title="Content Category Comparison"
            data={[
              { label: 'Token Takeovers', value: 127456, color: 'bg-purple-600' },
              { label: 'Memes', value: 89234, color: 'bg-pink-600' },
              { label: 'Product Launches', value: 71892, color: 'bg-blue-600' },
              { label: 'Educational', value: 34567, color: 'bg-green-600' },
              { label: 'Community', value: 28445, color: 'bg-yellow-600' },
              { label: 'Standard Updates', value: 7618, color: 'bg-gray-400' }
            ]}
          />
        </div>

        <Callout type="warning" title="Content Distribution Problem">
          <strong>62% of your content</strong> falls into the lowest-performing category
          (Standard Updates), while your highest-performing formats (Token Takeovers,
          Memes) represent less than <strong>6% combined</strong>. This inverse
          relationship is suppressing overall account performance.
        </Callout>
      </Section>

      {/* Part 2: Competitor Analysis Preview */}
      <Section
        title="Part 2: Competitor Analysis"
        subtitle="Benchmarking Against Top Solana Wallets"
        pageBreak={true}
      >
        <p className="text-lg text-gray-700 mb-6">
          We analyzed four leading competitors in the Solana wallet space to identify
          best practices and differentiation opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-lg p-6 avoid-break">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Phantom Wallet
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Followers:</strong> 284k</p>
              <p><strong>Avg Impressions:</strong> ~45k</p>
              <p><strong>Strategy:</strong> Heavy meme usage, rapid response to trends</p>
              <p><strong>Posting Freq:</strong> 3-4x daily</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 avoid-break">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Solflare
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Followers:</strong> 87k</p>
              <p><strong>Avg Impressions:</strong> ~12k</p>
              <p><strong>Strategy:</strong> Educational content, ecosystem partnerships</p>
              <p><strong>Posting Freq:</strong> 1-2x daily</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 avoid-break">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Backpack
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Followers:</strong> 156k</p>
              <p><strong>Avg Impressions:</strong> ~28k</p>
              <p><strong>Strategy:</strong> Brand-focused, community-driven campaigns</p>
              <p><strong>Posting Freq:</strong> 2-3x daily</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 avoid-break">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Trust Wallet
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Followers:</strong> 1.2M</p>
              <p><strong>Avg Impressions:</strong> ~85k</p>
              <p><strong>Strategy:</strong> Multi-chain focus, tutorial content</p>
              <p><strong>Posting Freq:</strong> 4-5x daily</p>
            </div>
          </div>
        </div>

        <Callout type="insight" title="Competitive Positioning">
          Jupiter Mobile&apos;s engagement rate (1.40%) is competitive despite lower follower
          count. The opportunity lies in <strong>increasing posting frequency</strong> and
          adopting proven content formats from category leaders (memes from Phantom,
          educational from Solflare).
        </Callout>
      </Section>
    </>
  );
}
