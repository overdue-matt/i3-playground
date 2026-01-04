"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";

// Dynamic k coefficient based on deviation from EMA
function getK(deviationPercent: number): number {
  const absDeviation = Math.abs(deviationPercent);
  if (absDeviation < 0.25) return 0.5;
  if (absDeviation < 0.5) return 0.4;
  if (absDeviation < 1.0) return 0.2;
  if (absDeviation < 2.0) return 0.1;
  return 0;
}

// EMA calculation helper
function calculateEMA(
  currentValue: number,
  previousEMA: number,
  alpha: number
): number {
  return alpha * currentValue + (1 - alpha) * previousEMA;
}

interface DataPoint {
  time: number;
  impactPrice: number;
  markPrice: number;
  oraclePrice: number;
  noticePrice: number;
  upperBand: number;
  lowerBand: number;
  k: number;
}

function generateSimulation(
  steps: number,
  basePrice: number,
  volatility: number,
  shockTime: number,
  shockMagnitude: number
): DataPoint[] {
  const data: DataPoint[] = [];

  // Initial values
  let noticePrice = basePrice;
  let impactPrice = basePrice;
  let markPrice = basePrice;
  let impactEMA1min = basePrice; // 1-minute EMA of impact price
  let markEMA2h = basePrice; // 2-hour EMA of mark price

  // EMA alphas (approximated for 3-second updates)
  // 1 minute = 20 updates at 3s each, alpha ≈ 2/(20+1) ≈ 0.095
  const alpha1min = 0.095;
  // 2 hours = 2400 updates at 3s each, alpha ≈ 2/(2400+1) ≈ 0.00083
  const alpha2h = 0.00083;

  for (let t = 0; t < steps; t++) {
    // Simulate Notice price (slow-moving external valuation)
    // Random walk with low volatility
    const noticeNoise = (Math.random() - 0.5) * volatility * 0.1;
    noticePrice = noticePrice * (1 + noticeNoise);

    // Simulate impact price (more volatile, market-driven)
    let impactNoise = (Math.random() - 0.5) * volatility;

    // Add shock if we're at shock time
    if (t >= shockTime && t < shockTime + 10) {
      impactNoise += shockMagnitude / 100;
    }

    impactPrice = impactPrice * (1 + impactNoise);

    // Update 1-minute EMA of impact price
    impactEMA1min = calculateEMA(impactPrice, impactEMA1min, alpha1min);

    // Calculate deviation from EMA
    const deviationPercent =
      ((impactPrice - impactEMA1min) / impactEMA1min) * 100;

    // Get dynamic k coefficient
    const k = getK(deviationPercent);

    // Calculate new mark price with velocity limit (max 1% per update)
    let newMarkPrice = (1 - k) * markPrice + k * impactPrice;

    // Apply velocity limit
    const maxChange = markPrice * 0.01;
    if (newMarkPrice > markPrice + maxChange) {
      newMarkPrice = markPrice + maxChange;
    } else if (newMarkPrice < markPrice - maxChange) {
      newMarkPrice = markPrice - maxChange;
    }

    // Update 2-hour EMA of mark price
    markEMA2h = calculateEMA(newMarkPrice, markEMA2h, alpha2h);

    // Calculate oracle price: 25% Notice + 75% Mark EMA
    const oraclePrice = 0.25 * noticePrice + 0.75 * markEMA2h;

    // Apply oracle band constraint (±20%)
    const upperBand = oraclePrice * 1.2;
    const lowerBand = oraclePrice * 0.8;

    // Clamp mark price to oracle bands
    newMarkPrice = Math.max(lowerBand, Math.min(upperBand, newMarkPrice));

    markPrice = newMarkPrice;

    data.push({
      time: t * 3, // seconds
      impactPrice: parseFloat(impactPrice.toFixed(2)),
      markPrice: parseFloat(markPrice.toFixed(2)),
      oraclePrice: parseFloat(oraclePrice.toFixed(2)),
      noticePrice: parseFloat(noticePrice.toFixed(2)),
      upperBand: parseFloat(upperBand.toFixed(2)),
      lowerBand: parseFloat(lowerBand.toFixed(2)),
      k,
    });
  }

  return data;
}

export default function OraclePlotPage() {
  const [basePrice, setBasePrice] = useState(100);
  const [volatility, setVolatility] = useState(0.005);
  const [shockTime, setShockTime] = useState(50);
  const [shockMagnitude, setShockMagnitude] = useState(5);
  const [steps, setSteps] = useState(200);
  const [seed, setSeed] = useState(0); // for regenerating

  const data = useMemo(() => {
    return generateSimulation(
      steps,
      basePrice,
      volatility,
      shockTime,
      shockMagnitude
    );
  }, [steps, basePrice, volatility, shockTime, shockMagnitude, seed]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Mark Price vs Oracle Dynamics
        </h1>
        <p className="text-gray-400 mb-8">
          Simulation of how mark price tracks impact price while being
          constrained by oracle bands
        </p>

        {/* Controls */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Parameters</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-gray-800 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Volatility
              </label>
              <input
                type="range"
                min="0.001"
                max="0.02"
                step="0.001"
                value={volatility}
                onChange={(e) => setVolatility(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {(volatility * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Shock Time (step)
              </label>
              <input
                type="range"
                min="10"
                max={steps - 20}
                value={shockTime}
                onChange={(e) => setShockTime(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{shockTime}</span>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Shock Magnitude (%)
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={shockMagnitude}
                onChange={(e) => setShockMagnitude(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{shockMagnitude}%</span>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Steps ({steps * 3}s)
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{steps} updates</span>
            </div>
          </div>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
          >
            Regenerate
          </button>
        </div>

        {/* Main Chart */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Price Dynamics</h2>
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                label={{
                  value: "Time (seconds)",
                  position: "bottom",
                  fill: "#9CA3AF",
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                domain={["auto", "auto"]}
                label={{
                  value: "Price ($)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9CA3AF",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Legend />

              {/* Oracle bands (shaded area) */}
              <Area
                type="monotone"
                dataKey="upperBand"
                stroke="none"
                fill="#f59e0b"
                fillOpacity={0.1}
                name="Upper Band (+20%)"
              />
              <Area
                type="monotone"
                dataKey="lowerBand"
                stroke="none"
                fill="#f59e0b"
                fillOpacity={0.1}
                name="Lower Band (-20%)"
              />

              {/* Impact Price - dotted, volatile */}
              <Line
                type="monotone"
                dataKey="impactPrice"
                stroke="#94a3b8"
                strokeWidth={1}
                dot={false}
                strokeDasharray="2 2"
                name="Impact Price"
              />

              {/* Notice Price - external feed */}
              <Line
                type="monotone"
                dataKey="noticePrice"
                stroke="#a855f7"
                strokeWidth={1.5}
                dot={false}
                name="Notice Price (external)"
              />

              {/* Oracle Price */}
              <Line
                type="monotone"
                dataKey="oraclePrice"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Oracle Price"
              />

              {/* Mark Price */}
              <Line
                type="monotone"
                dataKey="markPrice"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                name="Mark Price"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* K Coefficient Chart */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Dynamic K Coefficient Over Time
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Shows how aggressively mark price follows impact price. Higher k =
            faster tracking.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 0.6]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="stepAfter"
                dataKey="k"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="K Coefficient"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Explanation */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Mark Price</h3>
              <p className="mb-2">
                Smooths short-term volatility using a dynamic coefficient k:
              </p>
              <code className="block bg-gray-800 p-2 rounded text-xs">
                MarkPx(t) = (1-k) × MarkPx(t-1) + k × ImpactPx(t)
              </code>
              <ul className="mt-2 space-y-1 text-gray-400">
                <li>• Velocity limited to 1% per 3s update</li>
                <li>• Constrained within ±20% of oracle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Oracle Price</h3>
              <p className="mb-2">
                Weighted combination of external data and market price:
              </p>
              <code className="block bg-gray-800 p-2 rounded text-xs">
                Oracle = 0.25 × Notice + 0.75 × EMA(2h, MarkPx)
              </code>
              <ul className="mt-2 space-y-1 text-gray-400">
                <li>• 25% from Notice (offchain valuations)</li>
                <li>• 75% from 2-hour EMA of mark price</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-white mb-2">
                Dynamic K Coefficient
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">Δ &lt; 0.25%</div>
                  <div className="text-green-400 font-bold">k = 0.5</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">0.25-0.5%</div>
                  <div className="text-green-400 font-bold">k = 0.4</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">0.5-1%</div>
                  <div className="text-yellow-400 font-bold">k = 0.2</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">1-2%</div>
                  <div className="text-orange-400 font-bold">k = 0.1</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">≥ 2%</div>
                  <div className="text-red-400 font-bold">k = 0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
