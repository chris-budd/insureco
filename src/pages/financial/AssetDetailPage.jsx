import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Column, Tile, Button, Tag,
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
} from '@carbon/react';
import { ArrowLeft, Document, Camera, CheckmarkFilled, WarningFilled, Time } from '@carbon/icons-react';
import { assets, getAssetClaims, formatCurrency } from '../../data/financialData';
import './AssetDetailPage.scss';

const CLAIM_HEADERS = [
  { key: 'id',     header: 'Claim ID'   },
  { key: 'date',   header: 'Date Filed' },
  { key: 'type',   header: 'Type'       },
  { key: 'status', header: 'Status'     },
  { key: 'amount', header: 'Amount'     },
];

function StatusTag({ status }) {
  const map = {
    'Paid':      'green',
    'Approved':  'green',
    'In Review': 'blue',
    'Pending':   'blue',
    'Denied':    'red',
  };
  return <Tag type={map[status] || 'gray'} size="sm">{status}</Tag>;
}

function StatusIcon({ status }) {
  if (status === 'Paid' || status === 'Approved')
    return <CheckmarkFilled size={16} className="status-icon status-icon--success" />;
  if (status === 'In Review' || status === 'Pending')
    return <Time size={16} className="status-icon status-icon--warning" />;
  return <WarningFilled size={16} className="status-icon status-icon--error" />;
}

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const navigate    = useNavigate();

  const asset  = assets.find((a) => a.id === assetId);
  const claims = getAssetClaims(assetId);

  if (!asset) {
    return (
      <div className="asset-detail-not-found">
        <p>Asset not found.</p>
        <Button kind="ghost" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const claimRows = claims.map((c) => ({
    ...c,
    amount: formatCurrency(c.amount),
  }));

  const docs = [
    { name: 'Policy Underwriting Agreement',     type: 'PDF', date: '2023-01-15' },
    { name: 'Coverage Schedule & Limits',        type: 'PDF', date: '2023-01-15' },
    { name: 'Risk Assessment Report',            type: 'PDF', date: '2023-02-04' },
  ];

  const media = [
    { name: `${asset.category} Photo — Front View`,   date: '2023-01-20' },
    { name: `${asset.category} Photo — Rear View`,    date: '2023-01-20' },
    { name: `Inspection Certificate`,                  date: '2023-02-10' },
  ];

  return (
    <div className="asset-detail-page">
      <Grid fullWidth>
        {/* ── Header ──────────────────────────────────────────── */}
        <Column lg={16} md={8} sm={4}>
          <div className="asset-detail-header">
            <Button
              kind="ghost" size="sm" renderIcon={ArrowLeft}
              onClick={() => navigate(-1)}
            >
              Back to Dashboard
            </Button>
            <div className="asset-detail-title-row">
              <div>
                <div className="asset-detail-id-row">
                  <span className="asset-detail-id">{asset.id}</span>
                  <Tag type={asset.category === 'Auto' ? 'blue' : 'teal'} size="sm">
                    {asset.category}
                  </Tag>
                  <Tag type="green" size="sm">Active Policy</Tag>
                </div>
                <h1 className="asset-detail-name">{asset.name}</h1>
              </div>
              <div className="asset-detail-summary">
                <div className="asset-summary-stat">
                  <span className="asset-summary-label">Next Premium</span>
                  <span className="asset-summary-value">{formatCurrency(asset.premiumDue)}</span>
                </div>
                <div className="asset-summary-stat">
                  <span className="asset-summary-label">Due Date</span>
                  <span className="asset-summary-value">{asset.dueDate}</span>
                </div>
                <div className="asset-summary-stat">
                  <span className="asset-summary-label">Total Claims (Lifetime)</span>
                  <span className="asset-summary-value asset-summary-value--claims">
                    {formatCurrency(asset.totalClaims)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Column>

        {/* ── Claims History ───────────────────────────────────── */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="asset-detail-tile">
            <h2 className="asset-section-title">Claims History</h2>
            <p className="asset-section-sub">Full record of all claims filed against this asset</p>
            <DataTable rows={claimRows} headers={CLAIM_HEADERS} isSortable>
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
                        <TableRow key={key} {...rowProps}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.info.header === 'status' ? (
                                <div className="claim-status-cell">
                                  <StatusIcon status={cell.value} />
                                  <StatusTag status={cell.value} />
                                </div>
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

        {/* ── Policy Documents ─────────────────────────────────── */}
        <Column lg={8} md={4} sm={4}>
          <Tile className="asset-detail-tile">
            <h2 className="asset-section-title">Policy Documents</h2>
            <p className="asset-section-sub">Underwriting documents and coverage limits</p>
            <div className="asset-doc-list">
              {docs.map((doc) => (
                <div key={doc.name} className="asset-doc-row">
                  <div className="asset-doc-icon">
                    <Document size={20} />
                  </div>
                  <div className="asset-doc-info">
                    <p className="asset-doc-name">{doc.name}</p>
                    <p className="asset-doc-meta">{doc.type} · Added {doc.date}</p>
                  </div>
                  <Button kind="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Tile>
        </Column>

        {/* ── Supporting Media ─────────────────────────────────── */}
        <Column lg={8} md={4} sm={4}>
          <Tile className="asset-detail-tile">
            <h2 className="asset-section-title">Supporting Media</h2>
            <p className="asset-section-sub">Photos and documentation</p>
            <div className="asset-doc-list">
              {media.map((m) => (
                <div key={m.name} className="asset-doc-row">
                  <div className="asset-doc-icon">
                    <Camera size={20} />
                  </div>
                  <div className="asset-doc-info">
                    <p className="asset-doc-name">{m.name}</p>
                    <p className="asset-doc-meta">Added {m.date}</p>
                  </div>
                  <Button kind="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
