import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { monthlyData, kpiData, assets, formatCurrency } from '../../data/financialData';
import './FinancialDashboardSleek.scss';

const AREA_COLORS = {
  propPremiums: '#42be65',
  propClaims:   '#fa4d56',
  autoPremiums: '#4589ff',
  autoClaims:   '#f1c21b',
};

function SleekTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="sleek-tooltip">
      <p className="sleek-tooltip-label">{label} 2024</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="sleek-tooltip-row">
          <span className="sleek-tooltip-dot" style={{ background: p.stroke }} />
          <span>{p.name}: ${p.value}K</span>
        </div>
      ))}
    </div>
  );
}

export default function FinancialDashboardSleek() {
  const navigate      = useNavigate();
  const [metric, setMetric] = useState('gross');

  const data       = kpiData[metric];
  const lossRatio  = ((data.totalClaimed / data.totalOwed) * 100).toFixed(1);
  const ratioFloat = parseFloat(lossRatio);
  const ratioNote  = ratioFloat < 72 ? 'Healthy range' : ratioFloat < 88 ? 'Monitor closely' : 'Above threshold';

  const sorted = [...assets].sort((a, b) => b.totalClaims - a.totalClaims);

  return (
    <div className="sleek-dashboard">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="sleek-page-header">
        <button className="sleek-back-btn" onClick={() => navigate('/financial-dashboard')}>
          ← All Variations
        </button>
        <div className="sleek-header-row">
          <div className="sleek-header-text">
            <h1 className="sleek-title">Financial Overview</h1>
            <p className="sleek-subtitle">Auto &amp; Property Portfolio · YTD 2024</p>
          </div>
          <div className="sleek-pill-toggle">
            <button
              className={`sleek-pill ${metric === 'gross' ? 'sleek-pill--active' : ''}`}
              onClick={() => setMetric('gross')}
            >Gross</button>
            <button
              className={`sleek-pill ${metric === 'net' ? 'sleek-pill--active' : ''}`}
              onClick={() => setMetric('net')}
            >Net</button>
          </div>
        </div>
      </div>

      {/* ── Hero Metrics ─────────────────────────────────────────── */}
      <div className="sleek-metrics-grid">
        <div className="sleek-metric-card sleek-metric-card--owed">
          <p className="sleek-metric-eyebrow">Total Owed YTD</p>
          <p className="sleek-metric-amount">{formatCurrency(data.totalOwed, true)}</p>
          <p className="sleek-metric-breakdown">
            <span>Auto {formatCurrency(data.autoPremiums, true)}</span>
            <span className="sleek-dot-sep">·</span>
            <span>Property {formatCurrency(data.propertyPremiums, true)}</span>
          </p>
          <p className="sleek-metric-trend sleek-trend-up">↑ 12.4% year over year</p>
        </div>

        <div className="sleek-metric-card sleek-metric-card--claimed">
          <p className="sleek-metric-eyebrow">Total Claimed YTD</p>
          <p className="sleek-metric-amount">{formatCurrency(data.totalClaimed, true)}</p>
          <p className="sleek-metric-breakdown">
            <span>Auto {formatCurrency(data.autoClaims, true)}</span>
            <span className="sleek-dot-sep">·</span>
            <span>Property {formatCurrency(data.propertyClaims, true)}</span>
          </p>
          <p className="sleek-metric-trend sleek-trend-down">↑ 8.1% year over year</p>
        </div>

        <div className="sleek-metric-card sleek-metric-card--ratio">
          <p className="sleek-metric-eyebrow">Portfolio Loss Ratio</p>
          <p className="sleek-ratio-value">{lossRatio}%</p>
          <div className="sleek-ratio-track">
            <div
              className="sleek-ratio-fill"
              style={{ width: `${Math.min(ratioFloat, 100)}%` }}
            />
          </div>
          <p className="sleek-ratio-note">{ratioNote}</p>
        </div>
      </div>

      {/* ── Area Chart ──────────────────────────────────────────── */}
      <div className="sleek-chart-card">
        <div className="sleek-chart-card-header">
          <h2 className="sleek-card-title">Premium vs Claims Trend</h2>
          <div className="sleek-legend">
            <span className="sleek-legend-item sleek-legend-item--green">Property Premiums</span>
            <span className="sleek-legend-item sleek-legend-item--red">Property Claims</span>
            <span className="sleek-legend-item sleek-legend-item--blue">Auto Premiums</span>
            <span className="sleek-legend-item sleek-legend-item--yellow">Auto Claims</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {Object.entries(AREA_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${v}K`} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<SleekTooltip />} />
            <Area type="monotone" dataKey="propPremiums" name="Property Premiums" stroke="#42be65" fill="url(#grad-propPremiums)" strokeWidth={2} />
            <Area type="monotone" dataKey="propClaims"   name="Property Claims"   stroke="#fa4d56" fill="url(#grad-propClaims)"   strokeWidth={2} />
            <Area type="monotone" dataKey="autoPremiums" name="Auto Premiums"      stroke="#4589ff" fill="url(#grad-autoPremiums)" strokeWidth={2} />
            <Area type="monotone" dataKey="autoClaims"   name="Auto Claims"        stroke="#f1c21b" fill="url(#grad-autoClaims)"   strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Asset Ledger ─────────────────────────────────────────── */}
      <div className="sleek-table-card">
        <div className="sleek-table-top">
          <h2 className="sleek-card-title">Asset Performance Ledger</h2>
          <span className="sleek-table-count">{assets.length} assets · sorted by highest claims</span>
        </div>
        <div className="sleek-table-head-row">
          <span>Asset</span>
          <span>Category</span>
          <span>Premium Due</span>
          <span>Due Date</span>
          <span>Total Claims</span>
        </div>
        {sorted.map((asset) => {
          const highClaims = asset.totalClaims > 50000;
          const midClaims  = asset.totalClaims > 25000;
          return (
            <div
              key={asset.id}
              className="sleek-table-body-row"
              onClick={() => navigate(`/financial-dashboard/asset/${asset.id}`)}
            >
              <div className="sleek-asset-cell">
                <span className={`sleek-asset-dot ${asset.category === 'Auto' ? 'dot--blue' : 'dot--teal'}`} />
                <span className="sleek-asset-name">{asset.name}</span>
              </div>
              <span>
                <span className={`sleek-category-pill ${asset.category === 'Auto' ? 'pill--blue' : 'pill--teal'}`}>
                  {asset.category}
                </span>
              </span>
              <span className="sleek-amount">{formatCurrency(asset.premiumDue)}</span>
              <span className="sleek-date">{asset.dueDate}</span>
              <span className={`sleek-claims ${highClaims ? 'claims--high' : midClaims ? 'claims--mid' : 'claims--low'}`}>
                {formatCurrency(asset.totalClaims)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
