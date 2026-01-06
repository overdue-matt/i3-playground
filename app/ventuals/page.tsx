"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StockData {
  name: string;
  value: number;
  marketCap: number;
}

interface YearData {
  year: number;
  stocks: StockData[];
}

interface InterpolatedFrame {
  year: number;
  stocks: StockData[];
}

// Historical MAG7 market cap data (in trillions)
const historicalData: YearData[] = [
  {
    year: 2015,
    stocks: [
      { name: "Apple", value: 26.5, marketCap: 0.74 },
      { name: "Microsoft", value: 15.8, marketCap: 0.44 },
      { name: "Alphabet", value: 19.2, marketCap: 0.54 },
      { name: "Amazon", value: 10.2, marketCap: 0.29 },
      { name: "Nvidia", value: 4.3, marketCap: 0.12 },
      { name: "Meta", value: 12.1, marketCap: 0.34 },
      { name: "Tesla", value: 11.9, marketCap: 0.33 },
    ],
  },
  {
    year: 2017,
    stocks: [
      { name: "Apple", value: 24.8, marketCap: 0.87 },
      { name: "Microsoft", value: 18.5, marketCap: 0.65 },
      { name: "Alphabet", value: 20.3, marketCap: 0.71 },
      { name: "Amazon", value: 13.2, marketCap: 0.46 },
      { name: "Nvidia", value: 5.1, marketCap: 0.18 },
      { name: "Meta", value: 14.8, marketCap: 0.52 },
      { name: "Tesla", value: 3.3, marketCap: 0.12 },
    ],
  },
  {
    year: 2019,
    stocks: [
      { name: "Apple", value: 25.2, marketCap: 1.31 },
      { name: "Microsoft", value: 24.1, marketCap: 1.25 },
      { name: "Alphabet", value: 17.8, marketCap: 0.92 },
      { name: "Amazon", value: 16.5, marketCap: 0.86 },
      { name: "Nvidia", value: 5.8, marketCap: 0.30 },
      { name: "Meta", value: 9.2, marketCap: 0.48 },
      { name: "Tesla", value: 1.4, marketCap: 0.07 },
    ],
  },
  {
    year: 2021,
    stocks: [
      { name: "Apple", value: 24.3, marketCap: 2.91 },
      { name: "Microsoft", value: 23.8, marketCap: 2.85 },
      { name: "Alphabet", value: 17.2, marketCap: 2.06 },
      { name: "Amazon", value: 13.8, marketCap: 1.65 },
      { name: "Nvidia", value: 7.4, marketCap: 0.89 },
      { name: "Meta", value: 8.1, marketCap: 0.97 },
      { name: "Tesla", value: 5.4, marketCap: 0.65 },
    ],
  },
  {
    year: 2023,
    stocks: [
      { name: "Apple", value: 25.1, marketCap: 2.98 },
      { name: "Microsoft", value: 24.8, marketCap: 2.94 },
      { name: "Alphabet", value: 16.5, marketCap: 1.96 },
      { name: "Amazon", value: 13.2, marketCap: 1.57 },
      { name: "Nvidia", value: 9.8, marketCap: 1.16 },
      { name: "Meta", value: 6.2, marketCap: 0.74 },
      { name: "Tesla", value: 4.4, marketCap: 0.52 },
    ],
  },
  {
    year: 2025,
    stocks: [
      { name: "Apple", value: 26.8, marketCap: 3.4 },
      { name: "Microsoft", value: 25.2, marketCap: 3.2 },
      { name: "Alphabet", value: 18.1, marketCap: 2.3 },
      { name: "Amazon", value: 15.0, marketCap: 1.9 },
      { name: "Nvidia", value: 8.7, marketCap: 1.1 },
      { name: "Meta", value: 4.7, marketCap: 0.6 },
      { name: "Tesla", value: 3.9, marketCap: 0.5 },
    ],
  },
];

const COLORS = [
  "#4ade80", // Apple - bright green
  "#86efac", // Microsoft - light green
  "#bbf7d0", // Alphabet - pale green
  "#d9f99d", // Amazon - yellow-green
  "#e5e5e5", // Nvidia - light gray
  "#f5f5f5", // Meta - pale gray
  "#ffffff", // Tesla - white
];

// Fixed label positions (in degrees) for each stock - clockwise from top
const LABEL_POSITIONS = [
  0,    // Apple - top
  50,   // Microsoft - top right
  110,  // Alphabet - right
  160,  // Amazon - bottom right
  210,  // Nvidia - bottom
  260,  // Meta - bottom left
  310,  // Tesla - left
];

// Interpolate between two values
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Generate smooth interpolated frames between historical data points
function generateInterpolatedFrames(
  data: YearData[],
  framesPerSegment: number = 20
): InterpolatedFrame[] {
  const frames: InterpolatedFrame[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    const startYear = data[i];
    const endYear = data[i + 1];

    for (let f = 0; f < framesPerSegment; f++) {
      const t = f / framesPerSegment;
      const year = lerp(startYear.year, endYear.year, t);

      const stocks = startYear.stocks.map((stock, idx) => {
        const endStock = endYear.stocks[idx];
        return {
          name: stock.name,
          value: lerp(stock.value, endStock.value, t),
          marketCap: lerp(stock.marketCap, endStock.marketCap, t),
        };
      });

      frames.push({ year, stocks });
    }
  }

  // Add the final frame
  frames.push(data[data.length - 1]);

  return frames;
}

const FixedCalloutLabels = ({ cx, cy, data }: any) => {
  if (!data || data.length === 0) return null;

  const RADIAN = Math.PI / 180;
  const pieRadius = 180;
  const labelDistance = 250;

  return (
    <g>
      {data.map((entry: any, index: number) => {
        const angle = LABEL_POSITIONS[index];
        const radian = (angle - 90) * RADIAN;

        const labelX = cx + labelDistance * Math.cos(radian);
        const labelY = cy + labelDistance * Math.sin(radian);

        const lineEndX = cx + pieRadius * Math.cos(radian);
        const lineEndY = cy + pieRadius * Math.sin(radian);

        // Determine text anchor based on position
        let textAnchor: "start" | "middle" | "end" = "middle";
        if (labelX > cx + 10) textAnchor = "start";
        else if (labelX < cx - 10) textAnchor = "end";

        return (
          <g key={`label-${index}`}>
            {/* Line from pie edge to label */}
            <line
              x1={lineEndX}
              y1={lineEndY}
              x2={labelX}
              y2={labelY}
              stroke="#fff"
              strokeWidth={1.5}
              opacity={0.3}
            />

            {/* Label background */}
            <rect
              x={textAnchor === "start" ? labelX : textAnchor === "end" ? labelX - 140 : labelX - 70}
              y={labelY - 20}
              width={140}
              height={40}
              fill="#1f2937"
              opacity={0.95}
              rx={6}
            />

            {/* Stock name */}
            <text
              x={labelX}
              y={labelY - 5}
              fill="#fff"
              textAnchor={textAnchor}
              className="font-bold text-sm"
            >
              {entry.name}
            </text>

            {/* Market cap and percentage */}
            <text
              x={labelX}
              y={labelY + 12}
              fill="#4ade80"
              textAnchor={textAnchor}
              className="text-xs"
            >
              ${entry.marketCap.toFixed(1)}T ({(entry.value).toFixed(1)}%)
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default function VentualsPage() {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate interpolated frames
  const interpolatedFrames = useMemo(
    () => generateInterpolatedFrames(historicalData, 20),
    []
  );

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (prev >= interpolatedFrames.length - 1) {
          setIsPlaying(false);
          return interpolatedFrames.length - 1;
        }
        return prev + 1;
      });
    }, 50); // 50ms per frame for smooth animation

    return () => clearInterval(interval);
  }, [isPlaying, interpolatedFrames.length]);

  const currentData = useMemo(() => {
    return interpolatedFrames[currentFrameIndex];
  }, [currentFrameIndex, interpolatedFrames]);

  const totalMarketCap = useMemo(() => {
    return currentData.stocks.reduce((sum, stock) => sum + stock.marketCap, 0);
  }, [currentData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">📊</div>
            <h1 className="text-4xl font-bold">VENTUALS</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Trade tomorrow's companies today.
          </p>
        </div>

        {/* Main Chart Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-emerald-900/30">
          <h2 className="text-3xl font-bold text-center mb-2">
            MAG7 Market Cap Breakdown
          </h2>
          <p className="text-center text-emerald-400 text-xl mb-8">
            {currentData.year.toFixed(1)}
          </p>

          {/* Pie Chart */}
          <div className="mb-8">
            <ResponsiveContainer width="100%" height={650}>
              <PieChart>
                <Pie
                  data={currentData.stocks}
                  cx="50%"
                  cy="50%"
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {currentData.stocks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #34d399",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    const marketCap = props.payload.marketCap;
                    const percent = (value as number).toFixed(1);
                    return [`$${marketCap.toFixed(1)}T (${percent}%)`, name];
                  }}
                />
                {/* Fixed callout labels */}
                <g>
                  <FixedCalloutLabels data={currentData.stocks} />
                </g>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Timeline Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentFrameIndex(0);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⏮ Reset
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-emerald-400">
                  Total: ${totalMarketCap.toFixed(2)}T
                </span>
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={interpolatedFrames.length - 1}
                value={currentFrameIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentFrameIndex(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-sm text-gray-400">
                {historicalData.map((data) => (
                  <span
                    key={data.year}
                    className={
                      Math.abs(currentData.year - data.year) < 0.5
                        ? "text-emerald-400 font-bold"
                        : ""
                    }
                  >
                    {data.year}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-900/30">
          <h3 className="text-xl font-bold mb-3">About MAG7</h3>
          <p className="text-gray-300 leading-relaxed">
            The Magnificent 7 (MAG7) refers to the seven largest technology
            companies that have dominated the US stock market in recent years.
            This visualization shows how their market capitalization percentages
            have evolved over the past decade, demonstrating the shift in market
            dominance among tech giants.
          </p>
        </div>
      </div>
    </div>
  );
}
