import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Column, Tile, Button, Tag,
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  ContentSwitcher, Switch, Dropdown,
} from '@carbon/react';
import { ArrowLeft, ArrowUp } from '@carbon/icons-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { monthlyData, kpiData, assets, formatCurrency } from '../../data/financialData';
import './FinancialDashboardSafe.scss';

const SERIES = [
  { key: 'propPremiums', label: 'Property Premiums', color: '#198038' },
  { key: 'propClaims',   label: 'Property Claims',   color: '#a2191f' },
  { key: 'autoPremiums', label: 'Auto Premiums',      color: '#0f62fe' },
  { key: 'autoClaims',   label: 'Auto Claims',        color: '#d6a000' },
];

const TABLE_HEADERS = [
  { key: 'name',        header: 'Asset Name'   },
  { key: 'category',    header: 'Category'     },
  { key: 'premiumDue',  header: 'Premium Due'  },
  { key: 'dueDate',     header: 'Due Date'     },
  { key: 'totalClaims', header: 'Total Claims' },
];

const REGIONS = [
  { id: 'all',       label: 'All Regions' },
  { id: 'northeast', label: 'Northeast'   },
  { id: 'southeast', label: 'Southeast'   },
  { id: 'midwest',   label: 'Midwest'     },
  { id: 'west',      label: 'West'        },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="safe-chart-tooltip">
      <p className="safe-chart-tooltip-label">{label} 2024</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.stroke }}>
          {p.name}: ${p.value}K
        </p>
      ))}
    </div>
  );
}

export default function FinancialDashboardSafe() {
  const navigate = useNavigate();
  const [metric, setMetric]           = useState('gross');
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const data       = kpiData[metric];
  const lossRatioAuto = ((data.autoClaims / data.autoPremiums) * 100).toFixed(1);
  const lossRatioProp = ((data.propertyClaims / data.propertyPremiums) * 100).toFixed(1);

  const toggleSeries = (key) =>
    setHiddenSeries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const tableRows = assets.map((a) => ({
    id:          a.id,
    name:        a.name,
    category:    a.category,
    premiumDue:  formatCurrency(a.premiumDue),
    dueDate:     a.dueDate,
    totalClaims: formatCurrency(a.totalClaims),
  }));

  return (
    <div className="safe-dashboard">
      <Grid fullWidth>
        {/* ── Page header ─────────────────────────────────────── */}
        <Column lg={16} md={8} sm={4}>
          <div className="safe-page-header">
            <Button
              kind="ghost" size="sm" renderIcon={ArrowLeft}
              onClick={() => navigate('/financial-dashboard')}
            >
              All Variations
            </Button>
            <div className="safe-title-row">
              <div>
                <h1 className="safe-title">Insurance Financial Analytics</h1>
                <p className="safe-subtitle">Portfolio Overview · Year-to-Date 2024</p>
              </div>
              <div className="safe-filters">
                <div className="safe-filter-group">
                  <p className="safe-filter-label">View</p>
                  <ContentSwitcher
                    size="sm"
                    selectedIndex={metric === 'gross' ? 0 : 1}
                    onChange={({ name }) => setMetric(name)}
                  >
                    <Switch name="gross" text="Gross" />
                    <Switch name="net"   text="Net"   />
                  </ContentSwitcher>
                </div>
                <div className="safe-filter-group">
                  <Dropdown
                    id="region-filter"
                    titleText="Region"
                    label="All Regions"
                    items={REGIONS}
                    itemToString={(item) => item?.label || ''}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </Column>

        {/* ── KPI Cards ───────────────────────────────────────── */}
        <Column lg={4} md={4} sm={4}>
          <Tile className="safe-kpi-tile safe-kpi-tile--owed">
            <p className="kpi-label">Total Owed (YTD)</p>
            <p className="kpi-value">{formatCurrency(data.totalOwed, true)}</p>
            <p className="kpi-trend kpi-trend--positive">
              <ArrowUp size={13} /> +12.4% vs prior year
            </p>
            <div className="kpi-split">
              <span>Auto: {formatCurrency(data.autoPremiums, true)}</span>
              <span>Property: {formatCurrency(data.propertyPremiums, true)}</span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="safe-kpi-tile safe-kpi-tile--claimed">
            <p className="kpi-label">Total Claimed (YTD)</p>
            <p className="kpi-value">{formatCurrency(data.totalClaimed, true)}</p>
            <p className="kpi-trend kpi-trend--negative">
              <ArrowUp size={13} /> +8.1% vs prior year
            </p>
            <div className="kpi-split">
              <span>Auto: {formatCurrency(data.autoClaims, true)}</span>
              <span>Property: {formatCurrency(data.propertyClaims, true)}</span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="safe-kpi-tile safe-kpi-tile--auto">
            <p className="kpi-label">Auto Portfolio</p>
            <div className="kpi-pair-row">
              <div className="kpi-pair">
                <span className="kpi-pair-label">Premiums</span>
                <span className="kpi-pair-value kpi-pair-value--green">{formatCurrency(data.autoPremiums, true)}</span>
              </div>
              <div className="kpi-pair">
                <span className="kpi-pair-label">Claims</span>
                <span className="kpi-pair-value kpi-pair-value--red">{formatCurrency(data.autoClaims, true)}</span>
              </div>
            </div>
            <p className="kpi-ratio">Loss ratio: {lossRatioAuto}%</p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="safe-kpi-tile safe-kpi-tile--property">
            <p className="kpi-label">Property Portfolio</p>
            <div className="kpi-pair-row">
              <div className="kpi-pair">
                <span className="kpi-pair-label">Premiums</span>
                <span className="kpi-pair-value kpi-pair-value--green">{formatCurrency(data.propertyPremiums, true)}</span>
              </div>
              <div className="kpi-pair">
                <span className="kpi-pair-label">Claims</span>
                <span className="kpi-pair-value kpi-pair-value--red">{formatCurrency(data.propertyClaims, true)}</span>
              </div>
            </div>
            <p className="kpi-ratio">Loss ratio: {lossRatioProp}%</p>
          </Tile>
        </Column>

        {/* ── Chart ───────────────────────────────────────────── */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="safe-chart-tile">
            <div className="safe-chart-header">
              <div>
                <h2 className="safe-section-title">Premium vs Claims Trend</h2>
                <p className="safe-section-subtitle">Monthly data · 2024 · Values in thousands USD</p>
              </div>
              <div className="safe-series-toggles">
                {SERIES.map((s) => (
                  <button
                    key={s.key}
                    className={`series-toggle ${hiddenSeries.includes(s.key) ? 'series-toggle--off' : ''}`}
                    onClick={() => toggleSeries(s.key)}
                  >
                    <span className="series-swatch" style={{ background: s.color }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="safe-chart-area">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}K`} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip />} />
                  {SERIES.map((s) => (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.label}
                      stroke={s.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      hide={hiddenSeries.includes(s.key)}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Tile>
        </Column>

        {/* ── Asset Ledger Table ──────────────────────────────── */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="safe-table-tile">
            <div className="safe-table-header">
              <h2 className="safe-section-title">Asset Performance Ledger</h2>
              <p className="safe-section-subtitle">Click any row to view full asset history and documents</p>
            </div>
            <DataTable rows={tableRows} headers={TABLE_HEADERS} isSortable>
              {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                <Table {...getTableProps()} size="md">
                  <TableHead>
                    <TableRow>
                      {headers.map((h) => {
                        const { key, ...hProps } = getHeaderProps({ header: h });
                        return <TableHeader key={key} {...hProps}>{h.header}</TableHeader>;
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const { key, ...rowProps } = getRowProps({ row });
                      return (
                        <TableRow
                          key={key} {...rowProps}
                          className="safe-table-row"
                          onClick={() => navigate(`/financial-dashboard/asset/${row.id}`)}
                        >
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.info.header === 'category' ? (
                                <Tag type={cell.value === 'Auto' ? 'blue' : 'teal'} size="sm">
                                  {cell.value}
                                </Tag>
                              ) : cell.value}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
