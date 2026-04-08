import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Button,
  Heading,
  Dropdown,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from '@carbon/react';
import { Add, Report, Close } from '@carbon/icons-react';
import { mockBusinessClaims } from '../../data/businessMockData';
import { formatCurrency, formatDate } from '../../utils/businessHelpers';
import './ClaimsDashboardPage.scss';

const ASSET_TYPE_ITEMS = [
  { id: 'all', text: 'All Types' },
  { id: 'property', text: 'Property' },
  { id: 'vehicle', text: 'Vehicle' },
];

const STATUS_TAG_TYPE = {
  'In Review': 'blue',
  'Approved': 'green',
  'Paid': 'gray',
  'Denied': 'red',
};

const TABLE_HEADERS = [
  { key: 'id', header: 'Claim ID' },
  { key: 'assetName', header: 'Asset Name' },
  { key: 'assetType', header: 'Type' },
  { key: 'incidentDate', header: 'Incident Date' },
  { key: 'filedDate', header: 'Filed Date' },
  { key: 'claimAmount', header: 'Amount' },
  { key: 'status', header: 'Status' },
];

/**
 * ClaimsDashboardPage
 * Full business claims dashboard with summary stats, charts, a filterable
 * DataTable, and a slide-in detail panel.
 */
export default function ClaimsDashboardPage() {
  const navigate = useNavigate();
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // ─── Derived / computed values ────────────────────────────────────────────

  const filteredClaims = useMemo(() => {
    if (assetTypeFilter === 'all') return mockBusinessClaims;
    return mockBusinessClaims.filter(c => c.assetType === assetTypeFilter);
  }, [assetTypeFilter]);

  // Summary stats (always over ALL claims, not filtered)
  const totalClaims = mockBusinessClaims.length;
  const openClaims = mockBusinessClaims.filter(c => c.status === 'In Review').length;
  const totalClaimed = mockBusinessClaims.reduce((sum, c) => sum + c.claimAmount, 0);
  const totalApproved = mockBusinessClaims
    .filter(c => c.approvedAmount !== null)
    .reduce((sum, c) => sum + c.approvedAmount, 0);

  // Chart data — counts per status
  const statusCounts = useMemo(() => {
    const all = mockBusinessClaims;
    return {
      'In Review': all.filter(c => c.status === 'In Review').length,
      'Approved': all.filter(c => c.status === 'Approved').length,
      'Paid': all.filter(c => c.status === 'Paid').length,
    };
  }, []);

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  // Chart data — counts per asset type
  const assetTypeCounts = useMemo(() => ({
    Property: mockBusinessClaims.filter(c => c.assetType === 'property').length,
    Vehicle: mockBusinessClaims.filter(c => c.assetType === 'vehicle').length,
  }), []);

  const maxAssetCount = Math.max(...Object.values(assetTypeCounts), 1);

  // DataTable rows — Carbon DataTable requires `id` field
  const tableRows = useMemo(() =>
    filteredClaims.map(claim => ({
      id: claim.id,
      assetName: claim.assetName,
      assetType: claim.assetType === 'property' ? 'Property' : 'Vehicle',
      incidentDate: formatDate(claim.incidentDate, 'medium'),
      filedDate: formatDate(claim.filedDate, 'medium'),
      claimAmount: formatCurrency(claim.claimAmount),
      status: claim.status,
    })),
  [filteredClaims]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const openPanel = (claimId) => {
    const claim = mockBusinessClaims.find(c => c.id === claimId);
    if (claim) {
      setSelectedClaim(claim);
      setPanelOpen(true);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedClaim(null), 300); // wait for CSS transition
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Grid fullWidth className="claims-dashboard">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <Column lg={16} md={8} sm={4} className="claims-page-header">
          <div className="claims-header-content">
            <div className="claims-header-text">
              <Report size={32} className="claims-page-icon" />
              <div>
                <Heading className="claims-page-title">Claims Dashboard</Heading>
                <p className="claims-page-subtitle">
                  Monitor and manage all business insurance claims
                </p>
              </div>
            </div>
            <Button
              kind="primary"
              renderIcon={Add}
              onClick={() => navigate('/business/file-claim')}
            >
              File a Claim
            </Button>
          </div>
        </Column>

        {/* ── Summary Stats ────────────────────────────────────────────────── */}
        <Column lg={4} md={2} sm={2}>
          <Tile className="claims-stat-tile">
            <p className="stat-label">Total Claims</p>
            <h3 className="stat-value">{totalClaims}</h3>
            <p className="stat-detail">All time</p>
          </Tile>
        </Column>

        <Column lg={4} md={2} sm={2}>
          <Tile className="claims-stat-tile claims-stat-tile--alert">
            <p className="stat-label">Open Claims</p>
            <h3 className="stat-value">{openClaims}</h3>
            <p className="stat-detail">Currently in review</p>
          </Tile>
        </Column>

        <Column lg={4} md={2} sm={2}>
          <Tile className="claims-stat-tile">
            <p className="stat-label">Total Claimed</p>
            <h3 className="stat-value">{formatCurrency(totalClaimed, false)}</h3>
            <p className="stat-detail">Across all claims</p>
          </Tile>
        </Column>

        <Column lg={4} md={2} sm={2}>
          <Tile className="claims-stat-tile claims-stat-tile--success">
            <p className="stat-label">Total Approved</p>
            <h3 className="stat-value">{formatCurrency(totalApproved, false)}</h3>
            <p className="stat-detail">Approved & paid out</p>
          </Tile>
        </Column>

        {/* ── Charts ───────────────────────────────────────────────────────── */}
        <Column lg={8} md={4} sm={4}>
          <Tile className="claims-chart-tile">
            <Heading className="chart-title">Claims by Status</Heading>
            <div className="chart-bars">
              {Object.entries(statusCounts).map(([label, count]) => (
                <div key={label} className="chart-row">
                  <span className="chart-bar-label">{label}</span>
                  <div className="chart-bar-track">
                    <div
                      className={`chart-bar chart-bar--${label.toLowerCase().replace(' ', '-')}`}
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="chart-bar-count">{count}</span>
                </div>
              ))}
            </div>
          </Tile>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <Tile className="claims-chart-tile">
            <Heading className="chart-title">Claims by Asset Type</Heading>
            <div className="chart-bars">
              {Object.entries(assetTypeCounts).map(([label, count]) => (
                <div key={label} className="chart-row">
                  <span className="chart-bar-label">{label}</span>
                  <div className="chart-bar-track">
                    <div
                      className={`chart-bar chart-bar--${label.toLowerCase()}`}
                      style={{ width: `${(count / maxAssetCount) * 100}%` }}
                    />
                  </div>
                  <span className="chart-bar-count">{count}</span>
                </div>
              ))}
            </div>
          </Tile>
        </Column>

        {/* ── Claims Table ─────────────────────────────────────────────────── */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="claims-table-tile">
            <div className="claims-table-header">
              <Heading className="claims-table-title">
                Claims ({filteredClaims.length})
              </Heading>
              <div className="claims-table-filter">
                <Dropdown
                  id="asset-type-filter"
                  titleText="Filter by Type"
                  label="All Types"
                  items={ASSET_TYPE_ITEMS}
                  itemToString={(item) => item ? item.text : ''}
                  selectedItem={ASSET_TYPE_ITEMS.find(i => i.id === assetTypeFilter)}
                  onChange={({ selectedItem }) => setAssetTypeFilter(selectedItem?.id || 'all')}
                  size="sm"
                />
              </div>
            </div>

            <DataTable rows={tableRows} headers={TABLE_HEADERS} isSortable>
              {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                <TableContainer>
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader key={header.key} {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.id}
                          {...getRowProps({ row })}
                          onClick={() => openPanel(row.id)}
                          className="claims-table-row"
                        >
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.info.header === 'status' ? (
                                <Tag type={STATUS_TAG_TYPE[cell.value] || 'gray'} size="sm">
                                  {cell.value}
                                </Tag>
                              ) : (
                                cell.value
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>

            {filteredClaims.length === 0 && (
              <div className="claims-empty-state">
                <Report size={48} />
                <h4>No claims found</h4>
                <p>Try changing the filter or file a new claim</p>
              </div>
            )}
          </Tile>
        </Column>
      </Grid>

      {/* ── Detail Side Panel ──────────────────────────────────────────────── */}
      {panelOpen && (
        <div className="claims-panel-overlay" onClick={closePanel} aria-hidden="true" />
      )}

      <aside
        className={`claims-detail-panel${panelOpen ? ' claims-detail-panel--open' : ''}`}
        aria-label="Claim details"
        aria-hidden={!panelOpen}
      >
        {selectedClaim && (
          <>
            <div className="panel-header">
              <div className="panel-header-text">
                <h2 className="panel-claim-id">{selectedClaim.id}</h2>
                <Tag type={STATUS_TAG_TYPE[selectedClaim.status] || 'gray'}>
                  {selectedClaim.status}
                </Tag>
              </div>
              <button
                className="panel-close-btn"
                onClick={closePanel}
                aria-label="Close claim details"
              >
                <Close size={20} />
              </button>
            </div>

            <div className="panel-body">
              <section className="panel-section">
                <h3 className="panel-section-title">Asset</h3>
                <dl className="panel-details">
                  <div className="panel-detail-row">
                    <dt>Name</dt>
                    <dd>{selectedClaim.assetName}</dd>
                  </div>
                  <div className="panel-detail-row">
                    <dt>Type</dt>
                    <dd>{selectedClaim.assetType === 'property' ? 'Property' : 'Vehicle'}</dd>
                  </div>
                </dl>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">Claim Info</h3>
                <dl className="panel-details">
                  <div className="panel-detail-row">
                    <dt>Claim Type</dt>
                    <dd>{selectedClaim.claimType}</dd>
                  </div>
                  <div className="panel-detail-row">
                    <dt>Incident Date</dt>
                    <dd>{formatDate(selectedClaim.incidentDate, 'long')}</dd>
                  </div>
                  <div className="panel-detail-row">
                    <dt>Filed Date</dt>
                    <dd>{formatDate(selectedClaim.filedDate, 'long')}</dd>
                  </div>
                  <div className="panel-detail-row">
                    <dt>Est. Resolution</dt>
                    <dd>{formatDate(selectedClaim.estimatedResolutionDate, 'long')}</dd>
                  </div>
                </dl>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">Financials</h3>
                <dl className="panel-details">
                  <div className="panel-detail-row">
                    <dt>Claim Amount</dt>
                    <dd>{formatCurrency(selectedClaim.claimAmount)}</dd>
                  </div>
                  <div className="panel-detail-row">
                    <dt>Approved Amount</dt>
                    <dd>
                      {selectedClaim.approvedAmount !== null
                        ? formatCurrency(selectedClaim.approvedAmount)
                        : '—'}
                    </dd>
                  </div>
                  <div className="panel-detail-row">
                    <dt>Deductible</dt>
                    <dd>{formatCurrency(selectedClaim.deductible)}</dd>
                  </div>
                </dl>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">Adjuster</h3>
                <dl className="panel-details">
                  <div className="panel-detail-row">
                    <dt>Assigned To</dt>
                    <dd>{selectedClaim.adjuster}</dd>
                  </div>
                </dl>
              </section>

              <section className="panel-section">
                <h3 className="panel-section-title">Description</h3>
                <p className="panel-description">{selectedClaim.description}</p>
              </section>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
