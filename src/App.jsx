import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  ExternalLink,
  FolderOpen,
  LayoutGrid,
  Menu,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const TOOL_TYPES = {
  gsheet: {
    label: 'Google Sheets',
    icon: '📊',
    color: '#0F9D58',
    bgTint: '#e8f5e9',
    placeholder: 'https://docs.google.com/spreadsheets/d/...',
  },
  metabase: {
    label: 'Metabase',
    icon: '📈',
    color: '#509EE3',
    bgTint: '#e3f2fd',
    placeholder: 'https://metabase.company.com/question/...',
  },
  snowflake: {
    label: 'Snowflake',
    icon: '❄️',
    color: '#29B5E8',
    bgTint: '#e0f7fa',
    placeholder: 'https://app.snowflake.com/...',
  },
  streamlit: {
    label: 'Streamlit',
    icon: '🚀',
    color: '#FF4B4B',
    bgTint: '#fce4ec',
    placeholder: 'https://yourapp.streamlit.app/...',
  },
};

const PROJECT_COLORS = [
  '#7C3AED',
  '#0F9D58',
  '#509EE3',
  '#FF4B4B',
  '#F59E0B',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#6366F1',
  '#84CC16',
];

const STORAGE_KEY = 'project_hub_data';

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_DATA = {
  projects: [
    {
      id: 'p1',
      name: 'Sales Analytics',
      description: 'All dashboards, sheets, and queries powering sales reporting and forecasting.',
      details: 'Primary owners are Sales Ops and Data Engineering. Use this project to keep reporting links, key warehouse tables, and direct worksheet tabs together.',
      color: '#7C3AED',
      createdAt: Date.now(),
      tables: [
        {
          id: 't1',
          name: 'analytics.sales.pipeline_snapshot',
          description: 'Daily pipeline snapshot used by leadership and forecast rollups.',
        },
        {
          id: 't2',
          name: 'analytics.sales.rep_performance',
          description: 'Rep-level attainment and activity metrics for performance reviews.',
        },
      ],
      queryLinks: [
        {
          id: 'q1',
          name: 'Forecast Variance Query',
          link: 'https://metabase.company.com/question/218-sales-forecast-variance',
          description: 'Saved query used to compare forecast versions with closed revenue.',
        },
        {
          id: 'q2',
          name: 'Pipeline Aging SQL',
          link: 'https://app.snowflake.com/org/account/#/worksheet/pipeline-aging',
          description: 'Worksheet link for stale opportunity aging checks.',
        },
      ],
      resources: [
        {
          id: 'r1',
          type: 'gsheet',
          name: 'Sales Pipeline Tracker',
          link: 'https://docs.google.com/spreadsheets/d/1abc',
          description: 'Master sheet tracking every deal from lead to close.',
          owner: 'Sales Ops',
          tags: ['pipeline', 'deals'],
          sheets: [
            {
              id: 's1',
              name: 'Pipeline Overview',
              description: 'High-level funnel view with stage counts and conversion rates.',
              link: 'https://docs.google.com/spreadsheets/d/1abc/edit#gid=0',
            },
            {
              id: 's2',
              name: 'Monthly Revenue',
              description: 'Month-over-month revenue broken down by product line.',
              link: 'https://docs.google.com/spreadsheets/d/1abc/edit#gid=1029384756',
            },
            {
              id: 's3',
              name: 'Rep Performance',
              description: 'Individual rep quota attainment and activity metrics.',
              link: '',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'r2',
          type: 'metabase',
          name: 'Revenue Dashboard',
          link: 'https://metabase.company.com/dashboard/42',
          description: 'Real-time revenue tracking with daily/weekly/monthly views.',
          owner: 'Data Team',
          tags: ['revenue'],
          sheets: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'r3',
          type: 'snowflake',
          name: 'Sales DWH Views',
          link: 'https://app.snowflake.com/org/account/#/sales_views',
          description: 'Curated Snowflake views joining CRM data with product usage.',
          owner: 'Data Engineering',
          tags: ['dwh', 'crm'],
          sheets: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    },
    {
      id: 'p2',
      name: 'Marketing Ops',
      description: 'Campaign tracking, attribution models, and budget allocation tools.',
      details: 'This workspace collects campaign reporting assets plus the warehouse tables that feed spend and attribution models.',
      color: '#0F9D58',
      createdAt: Date.now(),
      tables: [
        {
          id: 't3',
          name: 'mart.marketing.campaign_spend_daily',
          description: 'Daily spend and impressions across every paid channel.',
        },
      ],
      queryLinks: [
        {
          id: 'q3',
          name: 'Paid Channel ROI Query',
          link: 'https://metabase.company.com/question/91-paid-channel-roi',
          description: 'Reusable query for weekly paid media ROI review.',
        },
      ],
      resources: [
        {
          id: 'r4',
          type: 'gsheet',
          name: 'Campaign Tracker',
          link: 'https://docs.google.com/spreadsheets/d/2xyz',
          description: 'Tracks all active and past marketing campaigns with spend and ROI.',
          owner: 'Marketing',
          tags: ['campaigns'],
          sheets: [
            {
              id: 's4',
              name: 'Active Campaigns',
              description: 'Currently running campaigns with daily spend and impressions.',
              link: 'https://docs.google.com/spreadsheets/d/2xyz/edit#gid=0',
            },
            {
              id: 's5',
              name: 'Budget Allocation',
              description: 'Quarterly budget breakdown across channels.',
              link: '',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'r5',
          type: 'streamlit',
          name: 'Attribution Model',
          link: 'https://attribution.streamlit.app/',
          description: 'Interactive multi-touch attribution model for campaign performance.',
          owner: 'Growth Team',
          tags: ['attribution', 'ml'],
          sheets: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10);

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore malformed local storage and fall back to defaults.
  }
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore local storage write issues.
  }
}

function normalizeSheet(sheet = {}) {
  return {
    id: sheet.id || uid(),
    name: sheet.name || '',
    description: sheet.description || '',
    link: sheet.link || '',
  };
}

function normalizeTable(table = {}) {
  return {
    id: table.id || uid(),
    name: table.name || '',
    description: table.description || '',
  };
}

function normalizeQueryLink(queryLink = {}) {
  return {
    id: queryLink.id || uid(),
    name: queryLink.name || '',
    link: queryLink.link || '',
    description: queryLink.description || '',
  };
}

function normalizeResource(resource = {}) {
  return {
    id: resource.id || uid(),
    type: resource.type || 'gsheet',
    name: resource.name || '',
    link: resource.link || '',
    description: resource.description || '',
    owner: resource.owner || '',
    tags: Array.isArray(resource.tags) ? resource.tags : [],
    sheets: Array.isArray(resource.sheets) ? resource.sheets.map(normalizeSheet) : [],
    createdAt: resource.createdAt || Date.now(),
    updatedAt: resource.updatedAt || resource.createdAt || Date.now(),
  };
}

function normalizeProject(project = {}) {
  return {
    id: project.id || uid(),
    name: project.name || '',
    description: project.description || '',
    details: project.details || '',
    color: project.color || PROJECT_COLORS[0],
    createdAt: project.createdAt || Date.now(),
    tables: Array.isArray(project.tables) ? project.tables.map(normalizeTable) : [],
    queryLinks: Array.isArray(project.queryLinks)
      ? project.queryLinks.map(normalizeQueryLink)
      : [],
    resources: Array.isArray(project.resources) ? project.resources.map(normalizeResource) : [],
  };
}

function normalizeData(data) {
  const projects = Array.isArray(data?.projects) ? data.projects : SEED_DATA.projects;
  return { projects: projects.map(normalizeProject) };
}

function matchesQuery(value, query) {
  return value.toLowerCase().includes(query);
}

function buildGlobalSearchResults(projects, rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return [];
  }

  return projects.reduce((acc, project) => {
    const projectHit = [project.name, project.description, project.details]
      .filter(Boolean)
      .some((value) => matchesQuery(value, query));

    const matchedTables = project.tables.filter(
      (table) =>
        matchesQuery(table.name, query) ||
        matchesQuery(table.description || '', query)
    );

    const matchedQueryLinks = project.queryLinks.filter(
      (queryLink) =>
        matchesQuery(queryLink.name, query) ||
        matchesQuery(queryLink.link || '', query) ||
        matchesQuery(queryLink.description || '', query)
    );

    const matchedResources = project.resources.reduce((resourceAcc, resource) => {
      const resourceHit = [
        resource.name,
        resource.description,
        resource.owner,
        resource.link,
        ...(resource.tags || []),
      ]
        .filter(Boolean)
        .some((value) => matchesQuery(value, query));

      const matchedSheets = (resource.sheets || []).filter(
        (sheet) =>
          matchesQuery(sheet.name, query) ||
          matchesQuery(sheet.description || '', query) ||
          matchesQuery(sheet.link || '', query)
      );

      if (resourceHit || matchedSheets.length > 0) {
        resourceAcc.push({ resource, resourceHit, matchedSheets });
      }

      return resourceAcc;
    }, []);

    if (
      projectHit ||
      matchedTables.length > 0 ||
      matchedQueryLinks.length > 0 ||
      matchedResources.length > 0
    ) {
      acc.push({
        project,
        projectHit,
        matchedTables,
        matchedQueryLinks,
        matchedResources,
      });
    }

    return acc;
  }, []);
}

function copyText(text, showToast, successMessage) {
  if (!navigator.clipboard) {
    showToast('Clipboard is not available in this browser.');
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast(successMessage))
    .catch(() => showToast('Unable to copy right now.'));
}

// ─── Shared Styles ───────────────────────────────────────────────────────────

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#555',
  marginBottom: 4,
  marginTop: 12,
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid #ddd',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .15s',
  marginBottom: 4,
  background: '#fff',
};

function btnStyle(bg, color, extra = {}) {
  return {
    background: bg,
    color,
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity .15s',
    ...extra,
  };
}

// ─── Toast Component ─────────────────────────────────────────────────────────

function Toast({ message, onDone }) {
  useEffect(() => {
    const timeoutId = setTimeout(onDone, 2500);
    return () => clearTimeout(timeoutId);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: '#1a1a2e',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: '0 8px 30px rgba(0,0,0,.18)',
        animation: 'slideUp .25s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Check size={16} strokeWidth={3} /> {message}
    </div>
  );
}

// ─── Backdrop ────────────────────────────────────────────────────────────────

function Backdrop({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn .2s ease',
      }}
    >
      {children}
    </div>
  );
}

// ─── Confirm Modal ───────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Backdrop onClick={onCancel}>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          maxWidth: 420,
          width: '90vw',
          fontFamily: "'DM Sans', sans-serif",
          animation: 'scaleIn .2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <AlertTriangle size={22} color="#EF4444" />
          <span style={{ fontWeight: 600, fontSize: 17 }}>Confirm Delete</span>
        </div>
        <p style={{ color: '#555', lineHeight: 1.5, margin: '0 0 24px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onCancel} style={btnStyle('#e5e7eb', '#333')}>
            Cancel
          </button>
          <button onClick={onConfirm} style={btnStyle('#EF4444', '#fff')}>
            Delete
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Project Modal ───────────────────────────────────────────────────────────

function ProjectModal({ project, onSave, onClose }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [details, setDetails] = useState(project?.details || '');
  const [color, setColor] = useState(project?.color || PROJECT_COLORS[0]);
  const [tables, setTables] = useState(project?.tables || []);
  const [queryLinks, setQueryLinks] = useState(project?.queryLinks || []);

  const accent = color || PROJECT_COLORS[0];

  const addTable = () => {
    setTables((currentTables) => [
      ...currentTables,
      { id: uid(), name: '', description: '' },
    ]);
  };

  const updateTable = (id, field, value) => {
    setTables((currentTables) =>
      currentTables.map((table) =>
        table.id === id ? { ...table, [field]: value } : table
      )
    );
  };

  const removeTable = (id) => {
    setTables((currentTables) => currentTables.filter((table) => table.id !== id));
  };

  const addQueryLink = () => {
    setQueryLinks((currentQueryLinks) => [
      ...currentQueryLinks,
      { id: uid(), name: '', link: '', description: '' },
    ]);
  };

  const updateQueryLink = (id, field, value) => {
    setQueryLinks((currentQueryLinks) =>
      currentQueryLinks.map((queryLink) =>
        queryLink.id === id ? { ...queryLink, [field]: value } : queryLink
      )
    );
  };

  const removeQueryLink = (id) => {
    setQueryLinks((currentQueryLinks) =>
      currentQueryLinks.filter((queryLink) => queryLink.id !== id)
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      details: details.trim(),
      color,
      tables: tables
        .filter((table) => table.name.trim())
        .map((table) => ({
          ...table,
          name: table.name.trim(),
          description: table.description.trim(),
        })),
      queryLinks: queryLinks
        .filter((queryLink) => queryLink.name.trim() && queryLink.link.trim())
        .map((queryLink) => ({
          ...queryLink,
          name: queryLink.name.trim(),
          link: queryLink.link.trim(),
          description: queryLink.description.trim(),
        })),
    });
  };

  return (
    <Backdrop onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          maxWidth: 620,
          width: '92vw',
          fontFamily: "'DM Sans', sans-serif",
          animation: 'scaleIn .2s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h3
          style={{
            margin: '0 0 20px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 20,
          }}
        >
          {project ? 'Edit Project' : 'New Project'}
        </h3>

        <label style={labelStyle}>Project Name *</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Sales Analytics"
          style={inputStyle}
          autoFocus
        />

        <label style={labelStyle}>Project Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="One-line summary of what this project covers."
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <label style={labelStyle}>Project Details</label>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Add owners, business context, data notes, or handoff details."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <label style={labelStyle}>Color</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {PROJECT_COLORS.map((projectColor) => (
            <div
              key={projectColor}
              onClick={() => setColor(projectColor)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: projectColor,
                cursor: 'pointer',
                border:
                  color === projectColor
                    ? '3px solid #1a1a2e'
                    : '3px solid transparent',
                transform: color === projectColor ? 'scale(1.15)' : 'scale(1)',
                transition: 'all .15s',
              }}
            />
          ))}
        </div>

        <div
          style={{
            border: `2px dashed ${accent}55`,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            background: `${accent}10`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#222' }}>
                <Database size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
                Project Tables
              </div>
              <p style={{ color: '#666', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                Add tables as <code>database.schema.table_name</code> with descriptions.
              </p>
            </div>
            <button
              onClick={addTable}
              style={btnStyle(accent, '#fff', { padding: '6px 12px', fontSize: 13 })}
            >
              + Add Table
            </button>
          </div>

          {tables.length === 0 && (
            <p
              style={{
                color: '#888',
                fontSize: 13,
                margin: 0,
                textAlign: 'center',
                padding: '8px 0',
              }}
            >
              No tables added yet. Use this for warehouse tables, marts, or curated datasets.
            </p>
          )}

          {tables.map((table, index) => (
            <div
              key={table.id}
              style={{
                background: '#fff',
                borderRadius: 10,
                border: `1px solid ${accent}22`,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto',
                  gap: 8,
                  alignItems: 'start',
                }}
              >
                <input
                  value={table.name}
                  onChange={(event) => updateTable(table.id, 'name', event.target.value)}
                  placeholder={`Table ${index + 1}: database.schema.table_name`}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <button
                  onClick={() => removeTable(table.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#EF4444',
                    marginTop: 8,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                value={table.description}
                onChange={(event) =>
                  updateTable(table.id, 'description', event.target.value)
                }
                placeholder="Table description (optional)"
                style={{ ...inputStyle, marginTop: 8, marginBottom: 0 }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            border: `2px dashed ${accent}55`,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            background: `${accent}08`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#222' }}>
                <ExternalLink size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
                Query Links
              </div>
              <p style={{ color: '#666', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                Add saved query URLs, worksheet links, or report question links for this project.
              </p>
            </div>
            <button
              onClick={addQueryLink}
              style={btnStyle(accent, '#fff', { padding: '6px 12px', fontSize: 13 })}
            >
              + Add Query Link
            </button>
          </div>

          {queryLinks.length === 0 && (
            <p
              style={{
                color: '#888',
                fontSize: 13,
                margin: 0,
                textAlign: 'center',
                padding: '8px 0',
              }}
            >
              No query links added yet. Add direct links to saved SQL, worksheets, or BI queries.
            </p>
          )}

          {queryLinks.map((queryLink, index) => (
            <div
              key={queryLink.id}
              style={{
                background: '#fff',
                borderRadius: 10,
                border: `1px solid ${accent}22`,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto',
                  gap: 8,
                  alignItems: 'start',
                }}
              >
                <input
                  value={queryLink.name}
                  onChange={(event) =>
                    updateQueryLink(queryLink.id, 'name', event.target.value)
                  }
                  placeholder={`Query ${index + 1} name`}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <input
                  value={queryLink.link}
                  onChange={(event) =>
                    updateQueryLink(queryLink.id, 'link', event.target.value)
                  }
                  placeholder="Query URL"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <button
                  onClick={() => removeQueryLink(queryLink.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#EF4444',
                    marginTop: 8,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                value={queryLink.description}
                onChange={(event) =>
                  updateQueryLink(queryLink.id, 'description', event.target.value)
                }
                placeholder="Query description (optional)"
                style={{ ...inputStyle, marginTop: 8, marginBottom: 0 }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={btnStyle('#e5e7eb', '#333')}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={btnStyle(name.trim() ? color : '#ccc', '#fff', {
              opacity: name.trim() ? 1 : 0.5,
            })}
          >
            {project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Resource Modal ──────────────────────────────────────────────────────────

function ResourceModal({ resource, onSave, onClose }) {
  const [type, setType] = useState(resource?.type || '');
  const [name, setName] = useState(resource?.name || '');
  const [link, setLink] = useState(resource?.link || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [owner, setOwner] = useState(resource?.owner || '');
  const [tagsStr, setTagsStr] = useState((resource?.tags || []).join(', '));
  const [sheets, setSheets] = useState(resource?.sheets || []);

  const canSave = Boolean(type && name.trim() && link.trim());
  const accent = type ? TOOL_TYPES[type].color : '#7C3AED';

  const addSheet = () => {
    setSheets((currentSheets) => [
      ...currentSheets,
      { id: uid(), name: '', description: '', link: '' },
    ]);
  };

  const updateSheet = (id, field, value) => {
    setSheets((currentSheets) =>
      currentSheets.map((sheet) =>
        sheet.id === id ? { ...sheet, [field]: value } : sheet
      )
    );
  };

  const removeSheet = (id) => {
    setSheets((currentSheets) => currentSheets.filter((sheet) => sheet.id !== id));
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave({
      type,
      name: name.trim(),
      link: link.trim(),
      description: description.trim(),
      owner: owner.trim(),
      tags: tagsStr
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      sheets:
        type === 'gsheet'
          ? sheets
              .filter((sheet) => sheet.name.trim())
              .map((sheet) => ({
                ...sheet,
                name: sheet.name.trim(),
                description: sheet.description.trim(),
                link: sheet.link.trim(),
              }))
          : [],
    });
  };

  return (
    <Backdrop onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          maxWidth: 620,
          width: '92vw',
          fontFamily: "'DM Sans', sans-serif",
          animation: 'scaleIn .2s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h3
          style={{
            margin: '0 0 20px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 20,
          }}
        >
          {resource ? 'Edit Resource' : 'Add Resource'}
        </h3>

        <label style={labelStyle}>Resource Type *</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 20,
          }}
        >
          {Object.entries(TOOL_TYPES).map(([key, tool]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              style={{
                background: type === key ? tool.bgTint : '#f9fafb',
                border: `2px solid ${type === key ? tool.color : '#e5e7eb'}`,
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: '#333',
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 20 }}>{tool.icon}</span> {tool.label}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Name *</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Pipeline Tracker"
          style={inputStyle}
        />

        <label style={labelStyle}>Link / URL *</label>
        <input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder={type ? TOOL_TYPES[type].placeholder : 'https://...'}
          style={inputStyle}
        />

        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this resource contain?"
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Owner</label>
            <input
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              placeholder="e.g. Data Team"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input
              value={tagsStr}
              onChange={(event) => setTagsStr(event.target.value)}
              placeholder="e.g. revenue, weekly"
              style={inputStyle}
            />
          </div>
        </div>

        {type === 'gsheet' && (
          <div
            style={{
              border: `2px dashed ${accent}66`,
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
              marginBottom: 16,
              background: `${accent}10`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                gap: 10,
              }}
            >
              <div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>
                  📋 Sheets / Tabs inside this GSheet
                </span>
                <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>
                  Each tab can have its own direct link.
                </p>
              </div>
              <button
                onClick={addSheet}
                style={btnStyle(accent, '#fff', { padding: '6px 12px', fontSize: 13 })}
              >
                + Add Sheet
              </button>
            </div>

            {sheets.length === 0 && (
              <p
                style={{
                  color: '#888',
                  fontSize: 13,
                  margin: 0,
                  textAlign: 'center',
                  padding: '8px 0',
                }}
              >
                No sheets added yet. Add tabs to make worksheet-level search and direct links work.
              </p>
            )}

            {sheets.map((sheet, index) => (
              <div
                key={sheet.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  border: `1px solid ${accent}22`,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto',
                    gap: 8,
                    alignItems: 'start',
                  }}
                >
                  <input
                    value={sheet.name}
                    onChange={(event) =>
                      updateSheet(sheet.id, 'name', event.target.value)
                    }
                    placeholder={`Tab ${index + 1} name`}
                    style={{ ...inputStyle, marginBottom: 0 }}
                  />
                  <input
                    value={sheet.link}
                    onChange={(event) =>
                      updateSheet(sheet.id, 'link', event.target.value)
                    }
                    placeholder="Optional direct tab link"
                    style={{ ...inputStyle, marginBottom: 0 }}
                  />
                  <button
                    onClick={() => removeSheet(sheet.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#EF4444',
                      marginTop: 8,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  value={sheet.description}
                  onChange={(event) =>
                    updateSheet(sheet.id, 'description', event.target.value)
                  }
                  placeholder="Description (optional)"
                  style={{ ...inputStyle, marginTop: 8, marginBottom: 0, fontSize: 13 }}
                />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={btnStyle('#e5e7eb', '#333')}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={btnStyle(canSave ? accent : '#ccc', '#fff', {
              opacity: canSave ? 1 : 0.5,
            })}
          >
            {resource ? 'Save Changes' : 'Add Resource'}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Filter Pill ─────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${color}18` : '#f3f4f6',
        color: active ? color : '#666',
        border: `1.5px solid ${active ? color : 'transparent'}`,
        borderRadius: 20,
        padding: '5px 14px',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'all .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle, action, minHeight = 300 }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60%',
        textAlign: 'center',
        gap: 12,
        minHeight,
      }}
    >
      {icon}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 18,
          color: '#555',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <p style={{ color: '#999', fontSize: 14, maxWidth: 360 }}>{subtitle}</p>
      {action}
    </div>
  );
}

// ─── Resource Card ───────────────────────────────────────────────────────────

function ResourceCard({ resource, onEdit, onDelete, showToast }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const tool = TOOL_TYPES[resource.type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: `1.5px solid ${hovered ? `${tool.color}66` : '#e5e7eb'}`,
        padding: 20,
        transition: 'all .2s',
        fontFamily: "'DM Sans', sans-serif",
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 8px 24px ${tool.color}18` : '0 1px 4px rgba(0,0,0,.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>{tool.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {resource.name}
          </div>
        </div>
        <span
          style={{
            background: tool.bgTint,
            color: tool.color,
            fontWeight: 700,
            fontSize: 11,
            padding: '3px 10px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
            letterSpacing: 0.3,
          }}
        >
          {tool.label}
        </span>
      </div>

      {resource.description && (
        <p
          style={{
            color: '#666',
            fontSize: 13,
            lineHeight: 1.5,
            margin: '0 0 10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {resource.description}
        </p>
      )}

      {(resource.owner || (resource.tags && resource.tags.length > 0)) && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 10,
            alignItems: 'center',
          }}
        >
          {resource.owner && (
            <span
              style={{
                fontSize: 12,
                color: '#888',
                background: '#f3f4f6',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              👤 {resource.owner}
            </span>
          )}
          {(resource.tags || []).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                color: tool.color,
                background: tool.bgTint,
                padding: '2px 8px',
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle(tool.color, '#fff', {
              padding: '6px 14px',
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }),
          }}
        >
          <ExternalLink size={13} /> Open
        </a>
        <button
          onClick={() => copyText(resource.link, showToast, 'Link copied!')}
          style={btnStyle('#f3f4f6', '#555', {
            padding: '6px 12px',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          })}
        >
          <Copy size={13} /> Copy
        </button>
        <button
          onClick={onEdit}
          style={btnStyle('#f3f4f6', '#555', {
            padding: '6px 12px',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          })}
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={onDelete}
          style={btnStyle('#fef2f2', '#EF4444', {
            padding: '6px 12px',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          })}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {resource.type === 'gsheet' && resource.sheets && resource.sheets.length > 0 && (
        <div style={{ marginTop: 12, borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
          <button
            onClick={() => setExpanded((current) => !current)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: '#0F9D58',
              fontFamily: "'DM Sans', sans-serif",
              padding: 0,
            }}
          >
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            {resource.sheets.length} Sheet{resource.sheets.length > 1 ? 's' : ''} inside
          </button>
          {expanded && (
            <div style={{ marginTop: 8, background: '#f0faf4', borderRadius: 8, padding: 10 }}>
              {resource.sheets.map((sheet, index) => (
                <div
                  key={sheet.id}
                  style={{
                    padding: '8px 0',
                    borderBottom:
                      index < resource.sheets.length - 1 ? '1px solid #e0f0e4' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#0F9D58', fontSize: 14 }}>↳</span>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{sheet.name}</span>
                      </div>
                      {sheet.description && (
                        <p
                          style={{
                            fontSize: 12,
                            color: '#777',
                            margin: '2px 0 0 20px',
                            lineHeight: 1.4,
                          }}
                        >
                          {sheet.description}
                        </p>
                      )}
                    </div>
                    {sheet.link ? (
                      <a
                        href={sheet.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#0F9D58',
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <ExternalLink size={12} /> Open tab
                      </a>
                    ) : (
                      <span style={{ color: '#7c8b82', fontSize: 12, whiteSpace: 'nowrap' }}>
                        Uses main sheet link
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Table Card ──────────────────────────────────────────────────────────────

function TableCard({ table, accent, showToast, compact = false }) {
  return (
    <div
      style={{
        background: compact ? '#fff' : '#f9fafb',
        borderRadius: 12,
        border: `1px solid ${accent}22`,
        padding: compact ? 14 : 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <code
          style={{
            fontSize: compact ? 12 : 13,
            fontWeight: 700,
            color: '#1f2937',
            wordBreak: 'break-all',
            fontFamily: "'Space Mono', 'SFMono-Regular', monospace",
          }}
        >
          {table.name}
        </code>
        <button
          onClick={() => copyText(table.name, showToast, 'Table name copied!')}
          style={btnStyle('#fff', accent, {
            border: `1px solid ${accent}22`,
            padding: '5px 10px',
            fontSize: 12,
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          })}
        >
          <Copy size={12} /> Copy
        </button>
      </div>
      {table.description ? (
        <p
          style={{
            fontSize: 13,
            color: '#667085',
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          {table.description}
        </p>
      ) : (
        <p style={{ fontSize: 12, color: '#98a2b3', marginTop: 10 }}>
          No description added yet.
        </p>
      )}
    </div>
  );
}

function QueryLinkCard({ queryLink, accent, showToast, compact = false }) {
  return (
    <div
      style={{
        background: compact ? '#fff' : '#f9fafb',
        borderRadius: 12,
        border: `1px solid ${accent}22`,
        padding: compact ? 14 : 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: compact ? 13 : 14,
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: 4,
            }}
          >
            {queryLink.name}
          </div>
          <a
            href={queryLink.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: accent,
              fontSize: 12,
              textDecoration: 'none',
              wordBreak: 'break-all',
              lineHeight: 1.5,
            }}
          >
            {queryLink.link}
          </a>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <a
            href={queryLink.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...btnStyle(accent, '#fff', {
                padding: '5px 10px',
                fontSize: 12,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }),
            }}
          >
            <ExternalLink size={12} /> Open
          </a>
          <button
            onClick={() => copyText(queryLink.link, showToast, 'Query link copied!')}
            style={btnStyle('#fff', accent, {
              border: `1px solid ${accent}22`,
              padding: '5px 10px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            })}
          >
            <Copy size={12} /> Copy
          </button>
        </div>
      </div>
      {queryLink.description ? (
        <p
          style={{
            fontSize: 13,
            color: '#667085',
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          {queryLink.description}
        </p>
      ) : (
        <p style={{ fontSize: 12, color: '#98a2b3', marginTop: 10 }}>
          No description added yet.
        </p>
      )}
    </div>
  );
}

// ─── Project Overview ────────────────────────────────────────────────────────

function ProjectOverview({ project, showToast }) {
  const [assetsExpanded, setAssetsExpanded] = useState(false);

  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: `1px solid ${project.color}22`,
          padding: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              background: `${project.color}15`,
              color: project.color,
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {project.resources.length} resource{project.resources.length !== 1 ? 's' : ''}
          </span>
          <span
            style={{
              background: '#f3f4f6',
              color: '#555',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {project.tables.length} table{project.tables.length !== 1 ? 's' : ''}
          </span>
          <span
            style={{
              background: '#f3f4f6',
              color: '#555',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {project.queryLinks.length} query link
            {project.queryLinks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#98a2b3',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 6,
            }}
          >
            Project Description
          </div>
          <p style={{ fontSize: 15, color: '#344054', lineHeight: 1.6 }}>
            {project.description || 'Add a short description to explain what this project covers.'}
          </p>
        </div>

        <div style={{ paddingTop: 16, borderTop: '1px solid #eef2f7' }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#98a2b3',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 6,
            }}
          >
            Project Details
          </div>
          <p style={{ fontSize: 14, color: '#667085', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {project.details || 'Add details like owners, usage notes, data caveats, or onboarding context.'}
          </p>
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: '1px solid #eef2f7',
          }}
        >
          <button
            onClick={() => setAssetsExpanded((current) => !current)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              width: '100%',
              fontFamily: "'DM Sans', sans-serif",
              textAlign: 'left',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#1f2937',
                  marginBottom: 4,
                }}
              >
                {assetsExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                {assetsExpanded ? 'Hide Tables & Query Links' : 'Show Tables & Query Links'}
              </div>
              <p style={{ color: '#667085', fontSize: 13, lineHeight: 1.5 }}>
                Expand to see warehouse tables and direct query links for this project.
              </p>
            </div>
            <span
              style={{
                background: `${project.color}15`,
                color: project.color,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {project.tables.length + project.queryLinks.length} items
            </span>
          </button>

          {assetsExpanded && (
            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Database size={18} color={project.color} />
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: '#1f2937',
                    }}
                  >
                    Warehouse Tables
                  </h3>
                </div>

                {project.tables.length === 0 ? (
                  <p style={{ color: '#98a2b3', fontSize: 14, lineHeight: 1.6 }}>
                    No tables added yet. Edit this project to attach database.schema.table_name entries.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {project.tables.map((table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        accent={project.color}
                        showToast={showToast}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <ExternalLink size={18} color={project.color} />
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: '#1f2937',
                    }}
                  >
                    Query Links
                  </h3>
                </div>

                {project.queryLinks.length === 0 ? (
                  <p style={{ color: '#98a2b3', fontSize: 14, lineHeight: 1.6 }}>
                    No query links added yet. Edit this project to attach saved query URLs.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {project.queryLinks.map((queryLink) => (
                      <QueryLinkCard
                        key={queryLink.id}
                        queryLink={queryLink}
                        accent={project.color}
                        showToast={showToast}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Search Results ──────────────────────────────────────────────────────────

function SearchResourceNode({ resource, matchedSheets, onEdit, onDelete, showToast }) {
  const tool = TOOL_TYPES[resource.type];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${tool.color}22`,
        borderLeft: `4px solid ${tool.color}`,
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>{tool.icon}</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: '#1f2937',
              }}
            >
              {resource.name}
            </span>
          </div>
          <span
            style={{
              background: tool.bgTint,
              color: tool.color,
              fontWeight: 700,
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              letterSpacing: 0.3,
              display: 'inline-block',
            }}
          >
            {tool.label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...btnStyle(tool.color, '#fff', {
                padding: '6px 12px',
                fontSize: 12,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }),
            }}
          >
            <ExternalLink size={12} /> Open
          </a>
          <button
            onClick={() => copyText(resource.link, showToast, 'Link copied!')}
            style={btnStyle('#f3f4f6', '#555', {
              padding: '6px 10px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            })}
          >
            <Copy size={12} />
          </button>
          <button
            onClick={onEdit}
            style={btnStyle('#f3f4f6', '#555', {
              padding: '6px 10px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            })}
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onDelete}
            style={btnStyle('#fef2f2', '#EF4444', {
              padding: '6px 10px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            })}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {(resource.description || resource.owner || resource.tags?.length) && (
        <div style={{ marginBottom: matchedSheets.length > 0 ? 12 : 0 }}>
          {resource.description && (
            <p style={{ fontSize: 13, color: '#667085', lineHeight: 1.6, marginBottom: 8 }}>
              {resource.description}
            </p>
          )}
          {(resource.owner || resource.tags?.length) && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {resource.owner && (
                <span
                  style={{
                    fontSize: 12,
                    color: '#888',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  👤 {resource.owner}
                </span>
              )}
              {(resource.tags || []).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    color: tool.color,
                    background: tool.bgTint,
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {matchedSheets.length > 0 && (
        <div
          style={{
            background: `${tool.color}0d`,
            borderRadius: 10,
            padding: 12,
            border: `1px solid ${tool.color}22`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: tool.color,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Matching Sheet Tabs
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {matchedSheets.map((sheet) => (
              <div
                key={sheet.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 10,
                  background: '#fff',
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>
                    ↳ {sheet.name}
                  </div>
                  {sheet.description && (
                    <p style={{ fontSize: 12, color: '#667085', marginTop: 4, lineHeight: 1.5 }}>
                      {sheet.description}
                    </p>
                  )}
                </div>
                {sheet.link ? (
                  <a
                    href={sheet.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: tool.color,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <ExternalLink size={12} /> Open tab
                  </a>
                ) : (
                  <span style={{ fontSize: 12, color: '#98a2b3', whiteSpace: 'nowrap' }}>
                    Uses main link
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchProjectGroup({
  result,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  onEditResource,
  onDeleteResource,
  showToast,
}) {
  const {
    project,
    projectHit,
    matchedTables,
    matchedQueryLinks,
    matchedResources,
  } = result;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        border: `1px solid ${project.color}22`,
        padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: project.color,
                flexShrink: 0,
              }}
            />
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 22,
                color: '#111827',
                lineHeight: 1.1,
              }}
            >
              {project.name}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {projectHit && (
              <span
                style={{
                  background: `${project.color}15`,
                  color: project.color,
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Project match
              </span>
            )}
            {matchedTables.length > 0 && (
              <span
                style={{
                  background: '#f3f4f6',
                  color: '#555',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {matchedTables.length} table match{matchedTables.length !== 1 ? 'es' : ''}
              </span>
            )}
            {matchedQueryLinks.length > 0 && (
              <span
                style={{
                  background: '#f3f4f6',
                  color: '#555',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {matchedQueryLinks.length} query link match
                {matchedQueryLinks.length !== 1 ? 'es' : ''}
              </span>
            )}
            {matchedResources.length > 0 && (
              <span
                style={{
                  background: '#f3f4f6',
                  color: '#555',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {matchedResources.length} resource match
                {matchedResources.length !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
          {(project.description || project.details) && (
            <p style={{ color: '#667085', fontSize: 14, lineHeight: 1.6, maxWidth: 760 }}>
              {project.description}
              {project.description && project.details ? ' ' : ''}
              {project.details}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={onOpenProject}
            style={btnStyle(project.color, '#fff', { padding: '8px 12px', fontSize: 13 })}
          >
            View Project
          </button>
          <button
            onClick={onEditProject}
            style={btnStyle('#f3f4f6', '#555', {
              padding: '8px 12px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            })}
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={onDeleteProject}
            style={btnStyle('#fef2f2', '#EF4444', {
              padding: '8px 12px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            })}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {matchedTables.length > 0 && (
        <div style={{ marginBottom: matchedResources.length > 0 ? 18 : 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Database size={16} color={project.color} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#344054' }}>Tables</span>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {matchedTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                accent={project.color}
                showToast={showToast}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {matchedQueryLinks.length > 0 && (
        <div style={{ marginBottom: matchedResources.length > 0 ? 18 : 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <ExternalLink size={16} color={project.color} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#344054' }}>
              Query Links
            </span>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {matchedQueryLinks.map((queryLink) => (
              <QueryLinkCard
                key={queryLink.id}
                queryLink={queryLink}
                accent={project.color}
                showToast={showToast}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {matchedResources.length > 0 && (
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: '#344054',
              marginBottom: 10,
            }}
          >
            Resources & Files
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {matchedResources.map(({ resource, matchedSheets }) => (
              <SearchResourceNode
                key={resource.id}
                resource={resource}
                matchedSheets={matchedSheets}
                onEdit={() => onEditResource(project.id, resource)}
                onDelete={() => onDeleteResource(project.id, resource)}
                showToast={showToast}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState(() => normalizeData(loadData() || SEED_DATA));
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const [projectModal, setProjectModal] = useState(null);
  const [resourceModal, setResourceModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const projects = data.projects;
  const resolvedActiveProjectId = projects.some(
    (project) => project.id === activeProjectId
  )
    ? activeProjectId
    : projects[0]?.id || null;
  const activeProject =
    projects.find((project) => project.id === resolvedActiveProjectId) || null;
  const isSearching = Boolean(search.trim());
  const searchResults = isSearching ? buildGlobalSearchResults(projects, search) : [];

  useEffect(() => {
    saveData(data);
  }, [data]);

  const showToast = useCallback((message) => setToast(message), []);

  const saveProject = (fields) => {
    if (projectModal.mode === 'create') {
      const newProject = {
        id: uid(),
        ...fields,
        createdAt: Date.now(),
        resources: [],
      };

      setData((currentData) => ({
        ...currentData,
        projects: [...currentData.projects, newProject],
      }));
      setActiveProjectId(newProject.id);
      showToast('Project created!');
    } else {
      setData((currentData) => ({
        ...currentData,
        projects: currentData.projects.map((project) =>
          project.id === projectModal.project.id ? { ...project, ...fields } : project
        ),
      }));
      showToast('Project updated!');
    }

    setProjectModal(null);
  };

  const deleteProject = () => {
    const projectId = confirmDelete.target.id;
    setData((currentData) => ({
      ...currentData,
      projects: currentData.projects.filter((project) => project.id !== projectId),
    }));

    if (resolvedActiveProjectId === projectId) {
      setActiveProjectId(null);
    }

    setConfirmDelete(null);
    showToast('Project deleted.');
  };

  const saveResource = (fields) => {
    const projectId = resourceModal.projectId;
    if (!projectId) {
      return;
    }

    if (resourceModal.mode === 'create') {
      const newResource = {
        id: uid(),
        ...fields,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setData((currentData) => ({
        ...currentData,
        projects: currentData.projects.map((project) =>
          project.id === projectId
            ? { ...project, resources: [...project.resources, newResource] }
            : project
        ),
      }));
      showToast('Resource added!');
    } else {
      setData((currentData) => ({
        ...currentData,
        projects: currentData.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                resources: project.resources.map((resource) =>
                  resource.id === resourceModal.resource.id
                    ? { ...resource, ...fields, updatedAt: Date.now() }
                    : resource
                ),
              }
            : project
        ),
      }));
      showToast('Resource updated!');
    }

    setResourceModal(null);
  };

  const deleteResource = () => {
    const resourceId = confirmDelete.target.id;
    const projectId = confirmDelete.projectId;

    setData((currentData) => ({
      ...currentData,
      projects: currentData.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              resources: project.resources.filter((resource) => resource.id !== resourceId),
            }
          : project
      ),
    }));

    setConfirmDelete(null);
    showToast('Resource deleted.');
  };

  const filteredResources = activeProject
    ? activeProject.resources.filter(
        (resource) => typeFilter === 'all' || resource.type === typeFilter
      )
    : [];

  const typeCounts = {};
  if (activeProject) {
    activeProject.resources.forEach((resource) => {
      typeCounts[resource.type] = (typeCounts[resource.type] || 0) + 1;
    });
  }

  const totalResources = projects.reduce(
    (count, project) => count + project.resources.length,
    0
  );
  const totalTables = projects.reduce((count, project) => count + project.tables.length, 0);
  const totalQueryLinks = projects.reduce(
    (count, project) => count + project.queryLinks.length,
    0
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        input:focus, textarea:focus { border-color: #7C3AED !important; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
        <div
          style={{
            width: sidebarOpen ? 260 : 0,
            minWidth: sidebarOpen ? 260 : 0,
            overflow: 'hidden',
            background: '#1a1a2e',
            color: '#e5e7eb',
            transition: 'all .25s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '20px 18px 12px', borderBottom: '1px solid #2a2a4a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <LayoutGrid size={20} color="#7C3AED" />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#fff',
                }}
              >
                Project Hub
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#888' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} · {totalResources}{' '}
              resource{totalResources !== 1 ? 's' : ''} · {totalTables} table
              {totalTables !== 1 ? 's' : ''} · {totalQueryLinks} query link
              {totalQueryLinks !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a4a' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: 12, color: '#7a819d' }}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects, tables, queries..."
                style={{
                  ...inputStyle,
                  paddingLeft: 36,
                  marginBottom: 0,
                  background: '#111827',
                  border: '1px solid #2f3853',
                  color: '#f8fafc',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#737b96', marginTop: 8, lineHeight: 1.5 }}>
              Global search across project details, tables, query links, resources, and sheet tabs.
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setActiveProjectId(project.id);
                  setTypeFilter('all');
                  setSearch('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  marginBottom: 2,
                  transition: 'background .15s',
                  background:
                    resolvedActiveProjectId === project.id ? '#2a2a4a' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: project.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: resolvedActiveProjectId === project.id ? 600 : 400,
                    color: resolvedActiveProjectId === project.id ? '#fff' : '#aaa',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {project.name}
                </span>
                <span
                  style={{
                    background:
                      resolvedActiveProjectId === project.id ? '#3a3a5a' : '#2a2a4a',
                    color: '#888',
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  {project.resources.length}
                </span>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 14px', borderTop: '1px solid #2a2a4a' }}>
            <button
              onClick={() => setProjectModal({ mode: 'create' })}
              style={{
                width: '100%',
                padding: '10px 0',
                background: 'transparent',
                color: '#888',
                border: '2px dashed #3a3a5a',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all .15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div
            style={{
              background: '#fff',
              borderBottom: '1px solid #e5e7eb',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#555',
                padding: 4,
              }}
            >
              <Menu size={22} />
            </button>

            {activeProject ? (
              <>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: activeProject.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    {activeProject.name}
                  </span>
                  {activeProject.description && (
                    <span style={{ color: '#888', fontSize: 13, marginLeft: 10 }}>
                      {activeProject.description}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setProjectModal({ mode: 'edit', project: activeProject })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888',
                    flexShrink: 0,
                  }}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() =>
                    setConfirmDelete({ type: 'project', target: activeProject })
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ccc',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <span style={{ color: '#888', fontSize: 15 }}>Select or create a project</span>
            )}
          </div>

          {(isSearching || activeProject) && (
            <div
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
                borderBottom: '1px solid #f0f0f3',
                background: '#fff',
                flexShrink: 0,
              }}
            >
              {isSearching ? (
                <span
                  style={{
                    background: '#f3f4f6',
                    color: '#555',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '8px 12px',
                    borderRadius: 999,
                  }}
                >
                  Hierarchy: Project → table / query link / resource → sheet
                </span>
              ) : activeProject ? (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <FilterPill
                    label={`All (${activeProject.resources.length})`}
                    active={typeFilter === 'all'}
                    onClick={() => setTypeFilter('all')}
                    color="#7C3AED"
                  />
                  {Object.entries(TOOL_TYPES).map(([key, tool]) =>
                    typeCounts[key] ? (
                      <FilterPill
                        key={key}
                        label={`${tool.icon} ${tool.label} (${typeCounts[key]})`}
                        active={typeFilter === key}
                        onClick={() => setTypeFilter(key)}
                        color={tool.color}
                      />
                    ) : null
                  )}
                </div>
              ) : null}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f6f6f9' }}>
            {isSearching ? (
              searchResults.length === 0 ? (
                <EmptyState
                  icon={<Search size={48} color="#ccc" />}
                  title="No matches found"
                  subtitle="Try another term. Search checks project names, descriptions, tables, query links, resources, and individual sheet tabs."
                />
              ) : (
                <div style={{ display: 'grid', gap: 18 }}>
                  {searchResults.map((result) => (
                    <SearchProjectGroup
                      key={result.project.id}
                      result={result}
                      onOpenProject={() => {
                        setActiveProjectId(result.project.id);
                        setSearch('');
                        setTypeFilter('all');
                      }}
                      onEditProject={() =>
                        setProjectModal({ mode: 'edit', project: result.project })
                      }
                      onDeleteProject={() =>
                        setConfirmDelete({ type: 'project', target: result.project })
                      }
                      onEditResource={(projectId, resource) =>
                        setResourceModal({ mode: 'edit', projectId, resource })
                      }
                      onDeleteResource={(projectId, resource) =>
                        setConfirmDelete({ type: 'resource', target: resource, projectId })
                      }
                      showToast={showToast}
                    />
                  ))}
                </div>
              )
            ) : !activeProject ? (
              <EmptyState
                icon={<FolderOpen size={48} color="#ccc" />}
                title="No project selected"
                subtitle="Create your first project to get started."
                action={
                  <button
                    onClick={() => setProjectModal({ mode: 'create' })}
                    style={btnStyle('#7C3AED', '#fff', { padding: '10px 24px' })}
                  >
                    + Create Project
                  </button>
                }
              />
            ) : (
              <div style={{ display: 'grid', gap: 18 }}>
                <ProjectOverview
                  key={activeProject.id}
                  project={activeProject}
                  showToast={showToast}
                />

                <div
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: `1px solid ${activeProject.color}22`,
                    padding: 20,
                    boxShadow: '0 1px 4px rgba(0,0,0,.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 20,
                          color: '#111827',
                          marginBottom: 4,
                        }}
                      >
                        Resources & Links
                      </h3>
                      <p style={{ color: '#667085', fontSize: 14 }}>
                        Add files, dashboards, sheets, apps, and warehouse links for this project.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setResourceModal({ mode: 'create', projectId: activeProject.id })
                      }
                      style={{
                        ...btnStyle(activeProject.color, '#fff', {
                          padding: '10px 20px',
                          fontSize: 14,
                        }),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Plus size={16} /> Add Resource
                    </button>
                  </div>

                  {filteredResources.length === 0 ? (
                    <EmptyState
                      icon={<LayoutGrid size={48} color="#ccc" />}
                      title={
                        activeProject.resources.length === 0
                          ? 'No resources yet'
                          : 'No resources match this filter'
                      }
                      subtitle={
                        activeProject.resources.length === 0
                          ? 'Add your first GSheet, Metabase, Snowflake, or Streamlit link.'
                          : 'Try another resource type or switch back to All.'
                      }
                      minHeight={220}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: 16,
                      }}
                    >
                      {filteredResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onEdit={() =>
                            setResourceModal({
                              mode: 'edit',
                              projectId: activeProject.id,
                              resource,
                            })
                          }
                          onDelete={() =>
                            setConfirmDelete({
                              type: 'resource',
                              target: resource,
                              projectId: activeProject.id,
                            })
                          }
                          showToast={showToast}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {projectModal && (
        <ProjectModal
          project={projectModal.mode === 'edit' ? projectModal.project : null}
          onSave={saveProject}
          onClose={() => setProjectModal(null)}
        />
      )}
      {resourceModal && (
        <ResourceModal
          resource={resourceModal.mode === 'edit' ? resourceModal.resource : null}
          onSave={saveResource}
          onClose={() => setResourceModal(null)}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.target.name}"? This cannot be undone.`}
          onConfirm={confirmDelete.type === 'project' ? deleteProject : deleteResource}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
