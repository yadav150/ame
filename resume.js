/* ===== Professional Tables ===== */
.preview-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 5px;
    overflow: hidden;
    font-size: 0.85rem;
    margin-bottom: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.preview-table thead th {
    background: var(--preview-primary, var(--primary));
    color: #fff;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.preview-table tbody td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    background: #fff;
    transition: background 0.15s;
}
.preview-table tbody tr:last-child td {
    border-bottom: none;
}
.preview-table tbody tr:nth-child(even) td {
    background: var(--bg-alt);
}
.preview-table tbody tr:hover td {
    background: rgba(79, 70, 229, 0.04);
}
.preview-table tbody td a {
    color: var(--preview-primary, var(--primary));
    text-decoration: none;
}
.preview-table tbody td a:hover {
    text-decoration: underline;
}
.preview-table tbody td strong {
    font-weight: 600;
    color: var(--text);
}
.preview-table .table-description {
    font-size: 0.82rem;
    color: var(--text-light);
    padding-top: 0;
}

/* Dark mode tables */
.builder__preview-content.dark .preview-table tbody td {
    background: #1e293b;
    border-color: #334155;
    color: #e2e8f0;
}
.builder__preview-content.dark .preview-table tbody tr:nth-child(even) td {
    background: #0f172a;
}
.builder__preview-content.dark .preview-table tbody tr:hover td {
    background: rgba(79, 70, 229, 0.08);
}
.builder__preview-content.dark .preview-table tbody td strong {
    color: #f1f5f9;
}
.builder__preview-content.dark .preview-table tbody td a {
    color: var(--preview-primary, #818cf8);
}
.builder__preview-content.dark .preview-table thead th {
    background: var(--preview-primary, #4f46e5);
}

/* Two-column layout: tables in sidebar should be compact */
.builder__preview-content.layout-two-column .preview-sidebar .preview-table {
    font-size: 0.78rem;
}
.builder__preview-content.layout-two-column .preview-sidebar .preview-table thead th {
    padding: 5px 8px;
    font-size: 0.65rem;
}
.builder__preview-content.layout-two-column .preview-sidebar .preview-table tbody td {
    padding: 5px 8px;
}
