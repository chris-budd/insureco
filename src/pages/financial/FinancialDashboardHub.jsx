import { useNavigate } from 'react-router-dom';
import { Analytics, ChartLine, Lightning, ArrowRight } from '@carbon/icons-react';
import './FinancialDashboardHub.scss';

const variations = [
  {
    id: 'safe',
    number: '01',
    title: 'Safe',
    tagline: 'Classic Corporate',
    description:
      'A structured, professional dashboard using Carbon Design System components with standard financial indicators, sortable tables, and familiar layouts — built for institutional analysts.',
    icon: Analytics,
    route: '/financial-dashboard/safe',
    accentClass: 'hub-card--safe',
  },
  {
    id: 'sleek',
    number: '02',
    title: 'Sleek',
    tagline: 'Modern Minimal',
    description:
      'A refined, contemporary layout with bold hero metrics, gradient area charts, and a clean visual hierarchy — optimized for fast, at-a-glance portfolio insights.',
    icon: ChartLine,
    route: '/financial-dashboard/sleek',
    accentClass: 'hub-card--sleek',
  },
  {
    id: 'crazy',
    number: '03',
    title: 'Crazy',
    tagline: 'Bold Terminal',
    description:
      'A high-impact, terminal-inspired design with a giant loss-ratio display, color-blocked panels, monospace typography, and a dark war-room aesthetic.',
    icon: Lightning,
    route: '/financial-dashboard/crazy',
    accentClass: 'hub-card--crazy',
  },
];

export default function FinancialDashboardHub() {
  const navigate = useNavigate();

  return (
    <div className="hub-page">
      <div className="hub-page-header">
        <p className="hub-eyebrow">Insurance Financial Analytics Dashboard (IFAD)</p>
        <h1 className="hub-title">Choose a Design Variation</h1>
        <p className="hub-subtitle">
          Three distinct takes on the same financial data — from conservative to experimental. All
          variations cover KPIs, trend charts, and the asset performance ledger.
        </p>
      </div>

      <div className="hub-cards-grid">
        {variations.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              className={`hub-card ${v.accentClass}`}
              onClick={() => navigate(v.route)}
            >
              <div className="hub-card-number">{v.number}</div>
              <div className="hub-card-icon-wrap">
                <Icon size={36} />
              </div>
              <h2 className="hub-card-title">{v.title}</h2>
              <p className="hub-card-tagline">{v.tagline}</p>
              <p className="hub-card-desc">{v.description}</p>
              <div className="hub-card-cta">
                <span>Launch Dashboard</span>
                <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>

      <p className="hub-footer-note">
        All dashboards share the same underlying data and support drill-down to individual asset
        detail views.
      </p>
    </div>
  );
}
