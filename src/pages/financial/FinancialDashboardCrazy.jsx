import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { monthlyData, kpiData, assets, formatCurrency } from '../../data/financialData';
import './FinancialDashboardCrazy.scss';

const NEON_GREEN = '#3ddc84';
const NEON_RED   = '#ff3b4a';

// Combine monthly data for total premiums vs claims
const chartData = monthlyData.map((d) => ({
  month:     d.month,
  Premiums: d.propPremiums + d.autoPremiums,
  Claims:   d.propClaims   + d.autoClaims,
}));

const data      = kpiData.gross;
const lossRatio = ((data.totalClaimed / data.totalOwed) * 100).toFixed(1);
const isHealthy = parseFloat(lossRatio) < 75;

const highRiskAssets = [...assets]
  .sort((a, b) => b.totalClaims - a.totalClaims)
  .slice(0, 4);

function getRisk(claims) {
  if (claims > 60000) return 'critical';
  if (claims > 30000) return 'high';
  return 'moderate';
}

function CrazyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="crazy-tooltip">
      <p>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }}>
          {p.name}: ${p.value}K
        </p>
      ))}
    </div>
  );
}

export default function FinancialDashboardCrazy() {
  const navigate = useNavigate();

  return (
    <div className="crazy-dashboard">
      {/* ── Hero Band ──────────────────────────────────────────── */}
      <div className="crazy-hero">
        <button className="crazy-back-btn" onClick={() => navigate('/financial-dashboard')}>
          ← All Variations
        </button>
        <div className="crazy-hero-body">
          <p className="crazy-hero-eyebrow">PORTFOLIO LOSS RATIO · YEAR-TO-DATE 2024</p>
          <div className="crazy-ratio-display">
            <span className={`crazy-ratio-num ${isHealthy ? 'ratio--healthy' : 'ratio--danger'}`}>
              {lossRatio}
            </span>
            <span className={`crazy-ratio-pct ${isHealthy ? 'ratio--healthy' : 'ratio--danger'}`}>%</span>
          </div>
          <div className="crazy-hero-twin-metrics">
            <div className="crazy-twin-metric">
              <span className="crazy-twin-label">TOTAL OWED</span>
              <span className="crazy-twin-value crazy-green">{formatCurrency(data.totalOwed, true)}</span>
            </div>
            <div className="crazy-twin-divider">|</div>
            <div className="crazy-twin-metric">
              <span className="crazy-twin-label">TOTAL CLAIMED</span>
              <span className="crazy-twin-value crazy-red">{formatCurrency(data.totalClaimed, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 2-column layout ───────────────────────────────── */}
      <div className="crazy-main-grid">
        {/* Left: Portfolio metric panels */}
        <div className="crazy-panels-col">
          {[
            {
              type: 'AUTO INSURANCE',
              premiums: data.autoPremiums,
              claims:   data.autoClaims,
            },
            {
              type: 'PROPERTY INSURANCE',
              premiums: data.propertyPremiums,
              claims:   data.propertyClaims,
            },
          ].map((portfolio) => {
            const ratio = ((portfolio.claims / portfolio.premiums) * 100).toFixed(1);
            return (
              <div key={portfolio.type} className="crazy-portfolio-panel">
                <p className="crazy-panel-type">{portfolio.type}</p>
                <div className="crazy-panel-metrics">
                  <div className="crazy-panel-metric">
                    <span className="crazy-panel-label">PREMIUMS</span>
                    <span className="crazy-panel-value crazy-green">
                      {formatCurrency(portfolio.premiums, true)}
                    </span>
                  </div>
                  <div className="crazy-panel-metric">
                    <span className="crazy-panel-label">CLAIMS</span>
                    <span className="crazy-panel-value crazy-red">
                      {formatCurrency(portfolio.claims, true)}
                    </span>
                  </div>
                </div>
                <div className="crazy-loss-track">
                  <div
                    className="crazy-loss-fill"
                    style={{ width: `${Math.min(parseFloat(ratio), 100)}%` }}
                  />
                </div>
                <span className="crazy-loss-ratio-label">Loss Ratio: {ratio}%</span>
              </div>
            );
          })}
        </div>

        {/* Right: Bar chart */}
        <div className="crazy-chart-col">
          <p className="crazy-chart-label">MONTHLY TOTAL PREMIUMS VS CLAIMS · 2024</p>
          <div className="crazy-chart-legend">
            <span><span className="crazy-legend-swatch crazy-legend-swatch--green" />Premiums</span>
            <span><span className="crazy-legend-swatch crazy-legend-swatch--red" />Claims</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#555', fontSize: 9, fontFamily: 'IBM Plex Mono, Courier New, monospace' }}
                axisLine={{ stroke: '#1a1a1a' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${v}K`}
                tick={{ fill: '#555', fontSize: 9, fontFamily: 'IBM Plex Mono, Courier New, monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CrazyTooltip />} />
              <Bar dataKey="Premiums" radius={[3, 3, 0, 0]} maxBarSize={16}>
                {chartData.map((_, i) => <Cell key={i} fill={NEON_GREEN} fillOpacity={0.85} />)}
              </Bar>
              <Bar dataKey="Claims" radius={[3, 3, 0, 0]} maxBarSize={16}>
                {chartData.map((_, i) => <Cell key={i} fill={NEON_RED} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── High-risk asset cards ──────────────────────────────── */}
      <div className="crazy-bottom-section">
        <div className="crazy-section-header">
          <span className="crazy-section-title">HIGH-RISK ASSETS</span>
          <span className="crazy-section-sub">sorted by lifetime claims exposure · click to drill down</span>
        </div>
        <div className="crazy-asset-grid">
          {highRiskAssets.map((asset, i) => {
            const risk = getRisk(asset.totalClaims);
            return (
              <div
                key={asset.id}
                className={`crazy-asset-card crazy-asset-card--${risk}`}
                onClick={() => navigate(`/financial-dashboard/asset/${asset.id}`)}
              >
                <div className="crazy-asset-rank">#{i + 1}</div>
                <div className="crazy-asset-id">{asset.id}</div>
                <div className="crazy-asset-name">{asset.name}</div>
                <div className="crazy-asset-category">{asset.category.toUpperCase()}</div>
                <div className="crazy-asset-claims-amount">{formatCurrency(asset.totalClaims, true)}</div>
                <div className="crazy-asset-claims-label">LIFETIME CLAIMS</div>
                <span className={`crazy-risk-badge crazy-risk-badge--${risk}`}>
                  {risk.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
