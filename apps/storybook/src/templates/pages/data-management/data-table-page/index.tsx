/**
 * @file index.tsx
 * @description Data Table Page template for Storybook. Includes a searchable, sortable,
 * paginated table with column visibility toggles, row selection, bulk actions, and
 * responsive horizontal scrolling on mobile. Built using internal design-system components.
 */

"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DownloadIcon, DotsHorizontalIcon, GearIcon } from "@radix-ui/react-icons";
import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/card";
import { Checkbox } from "../../../../components/checkbox";
import { Dropdown, DropdownItem } from "../../../../components/dropdown";
import { Table, type TableSortBy } from "../../../../components/table";

/**
 * A single row of data for the Data Table Page.
 */
export interface DataTableRowModel {
  /** Stable unique row id. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Email address. */
  email: string;
  /** Department or team. */
  department: "Engineering" | "Product" | "Design" | "Sales" | "Support";
  /** User role. */
  role: "Admin" | "Editor" | "Viewer";
  /** Current account status. */
  status: "Active" | "Invited" | "Suspended";
  /** ISO string for created timestamp. */
  createdAt: string;
}

/**
 * Column keys (including non-data utility columns).
 */
export type DataTableColumnKey =
  | "select"
  | "id"
  | "name"
  | "email"
  | "department"
  | "role"
  | "status"
  | "createdAt"
  | "actions";

/**
 * Column definition for rendering and sorting.
 */
export interface DataTableColumnDef {
  /** Unique column key. */
  key: DataTableColumnKey;
  /** Visible label in the header. */
  label: string;
  /** Whether this column is user-hideable. */
  hideable?: boolean;
  /** Whether this column participates in sorting. */
  sortable?: boolean;
}

/**
 * Props for the DataTablePage template.
 */
export interface DataTablePageProps {
  /** Initial dataset for the table (5–10 rows recommended for Storybook). */
  initialRows: DataTableRowModel[];
  /** Optional page title. */
  title?: string;
  /** Optional className for the page wrapper. */
  className?: string;
  /** Rows per page options. */
  rowsPerPageOptions?: readonly number[];
  /** Default rows per page. */
  defaultRowsPerPage?: number;
}

/**
 * Default set of columns for the page.
 */
const DEFAULT_COLUMNS: DataTableColumnDef[] = [
  { key: "select", label: "", hideable: false, sortable: false },
  { key: "id", label: "ID", hideable: true, sortable: true },
  { key: "name", label: "Name", hideable: true, sortable: true },
  { key: "email", label: "Email", hideable: true, sortable: true },
  { key: "department", label: "Department", hideable: true, sortable: true },
  { key: "role", label: "Role", hideable: true, sortable: true },
  { key: "status", label: "Status", hideable: true, sortable: true },
  { key: "createdAt", label: "Created", hideable: true, sortable: true },
  { key: "actions", label: "Actions", hideable: false, sortable: false },
];

/**
 * Converts a DataTableRowModel to a value used for sorting.
 * @param row - Row model.
 * @param key - Column key.
 * @returns Sortable primitive (string/number).
 */
function getSortableValue(row: DataTableRowModel, key: DataTableColumnKey): string | number {
  switch (key) {
    case "id":
      return Number(row.id) || row.id;
    case "name":
      return row.name;
    case "email":
      return row.email;
    case "department":
      return row.department;
    case "role":
      return row.role;
    case "status":
      return row.status;
    case "createdAt":
      return row.createdAt;
    default:
      return "";
  }
}

/**
 * Root page shell providing background, spacing, and max-width layout.
 */
function DataTablePageShell({
  title,
  toolbar,
  table,
  className,
}: {
  title: string;
  toolbar: ReactNode;
  table: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/40",
        className
      )}
    >
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search, sort, filter, and manage rows with bulk actions.
            </p>
          </div>
          <div className="shrink-0 w-full sm:w-auto">{toolbar}</div>
        </div>

        {table}
      </div>
    </div>
  );
}

/**
 * Minimal, accessible search input (no external icon deps).
 */
const SearchInput = memo(function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="w-full sm:w-[320px]">
      <label className="sr-only" htmlFor="data-table-search">
        Search rows
      </label>
      <input
        id="data-table-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
          "shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
        inputMode="search"
        autoComplete="off"
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

/**
 * Bulk actions bar shown when rows are selected.
 */
const BulkActions = memo(function BulkActions({
  selectedCount,
  onDeleteSelected,
  onExportSelected,
}: {
  selectedCount: number;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
}) {
  if (selectedCount <= 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">
        {selectedCount} selected
      </span>
      <Button variant="danger" size="sm" onClick={onDeleteSelected}>
        Delete
      </Button>
      <Button variant="outline" size="sm" onClick={onExportSelected}>
        <DownloadIcon />
        Export
      </Button>
    </div>
  );
});

BulkActions.displayName = "BulkActions";

/**
 * Column visibility dropdown.
 */
const ColumnVisibilityMenu = memo(function ColumnVisibilityMenu({
  columns,
  visibleKeys,
  onToggle,
}: {
  columns: readonly DataTableColumnDef[];
  visibleKeys: ReadonlySet<DataTableColumnKey>;
  onToggle: (key: DataTableColumnKey) => void;
}) {
  const hideableColumns = useMemo(
    () => columns.filter((c) => c.hideable !== false && c.key !== "select" && c.key !== "actions"),
    [columns]
  );

  return (
    <Dropdown
      align="end"
      trigger={
        <Button variant="outline" size="sm" aria-label="Column visibility">
          <GearIcon />
          Columns
        </Button>
      }
    >
      <div className="px-2 py-1 text-xs text-muted-foreground">Show / hide columns</div>
      <div className="space-y-1">
        {hideableColumns.map((col) => (
          <DropdownItem
            key={col.key}
            onSelect={(e) => {
              e.preventDefault();
              onToggle(col.key);
            }}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={visibleKeys.has(col.key)}
              onChange={() => onToggle(col.key)}
              aria-label={`Toggle ${col.label} column`}
              size="sm"
            />
            <span className="text-sm">{col.label}</span>
          </DropdownItem>
        ))}
      </div>
    </Dropdown>
  );
});

ColumnVisibilityMenu.displayName = "ColumnVisibilityMenu";

/**
 * DataTablePage: precomposed page template.
 */
export function DataTablePage({
  initialRows,
  title = "Data Table Page",
  className,
  rowsPerPageOptions = [5, 10, 20],
  defaultRowsPerPage = 5,
}: DataTablePageProps) {
  const [rows, setRows] = useState<DataTableRowModel[]>(() => initialRows);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<DataTableColumnKey>("name");
  const [sortDir, setSortDir] = useState<TableSortBy>("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [visibleKeys, setVisibleKeys] = useState<Set<DataTableColumnKey>>(
    () => new Set(DEFAULT_COLUMNS.map((c) => c.key))
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const columns = useMemo(() => DEFAULT_COLUMNS, []);

  const effectiveVisibleKeys = useMemo<ReadonlySet<DataTableColumnKey>>(() => visibleKeys, [visibleKeys]);

  const visibleColumns = useMemo(() => {
    return columns.filter((c) => effectiveVisibleKeys.has(c.key));
  }, [columns, effectiveVisibleKeys]);

  const filterQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const filteredRows = useMemo(() => {
    if (!filterQuery) return rows;
    return rows.filter((r) => {
      const haystack = `${r.id} ${r.name} ${r.email} ${r.department} ${r.role} ${r.status} ${r.createdAt}`.toLowerCase();
      return haystack.includes(filterQuery);
    });
  }, [rows, filterQuery]);

  const sortedRows = useMemo(() => {
    const key = sortKey;
    if (key === "select" || key === "actions") return filteredRows;
    const copy = [...filteredRows];
    copy.sort((a, b) => {
      const av = getSortableValue(a, key);
      const bv = getSortableValue(b, key);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filteredRows, sortKey, sortDir]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)), [sortedRows.length, rowsPerPage]);

  const paginatedRows = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage, totalPages]);

  const allVisibleSelected = useMemo(() => {
    if (paginatedRows.length === 0) return false;
    return paginatedRows.every((r) => selectedIds.has(r.id));
  }, [paginatedRows, selectedIds]);

  const selectedCount = selectedIds.size;

  const applySort = useCallback(
    (key: string, next: TableSortBy) => {
      const typedKey = key as DataTableColumnKey;
      const col = columns.find((c) => c.key === typedKey);
      if (!col || col.sortable === false) return;
      setSortKey(typedKey);
      setSortDir(next);
    },
    [columns]
  );

  const headings = useMemo(() => {
    return visibleColumns.map((c) => {
      const isActive = c.key === sortKey;
      const sort: TableSortBy = isActive ? sortDir : "asc";
      return { key: c.key, label: c.label, sort };
    });
  }, [visibleColumns, sortKey, sortDir]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => setPage(nextPage), []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next) || next <= 0) return;
    setRowsPerPage(next);
    setPage(1);
  }, []);

  const handleToggleColumn = useCallback((key: DataTableColumnKey) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      // Always keep utility columns visible for UX consistency
      next.add("select");
      next.add("actions");
      return next;
    });
  }, []);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        paginatedRows.forEach((r) => next.delete(r.id));
      } else {
        paginatedRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }, [allVisibleSelected, paginatedRows]);

  const handleDeleteSelected = useCallback(() => {
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
    setPage(1);
  }, [selectedIds]);

  const handleExportSelected = useCallback(() => {
    const selected = rows.filter((r) => selectedIds.has(r.id));
    const header = ["id", "name", "email", "department", "role", "status", "createdAt"];
    const lines = [header.join(",")].concat(
      selected.map((r) => [r.id, r.name, r.email, r.department, r.role, r.status, r.createdAt].join(","))
    );
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, selectedIds]);

  const tableData = useMemo(() => {
    return paginatedRows.map((r) => {
      const rowIsSelected = selectedIds.has(r.id);
      const record: Record<string, ReactNode> = {
        select: (
          <Checkbox
            checked={rowIsSelected}
            onChange={() => toggleRow(r.id)}
            aria-label={`Select row ${r.name}`}
            size="sm"
          />
        ),
        id: r.id,
        name: r.name,
        email: r.email,
        department: r.department,
        role: r.role,
        status: (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
              r.status === "Active" && "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
              r.status === "Invited" && "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300",
              r.status === "Suspended" && "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300"
            )}
          >
            {r.status}
          </span>
        ),
        createdAt: new Date(r.createdAt).toLocaleDateString(),
        actions: (
          <Dropdown
            align="end"
            trigger={
              <Button variant="ghost" size="sm" aria-label={`Row actions for ${r.name}`}>
                <DotsHorizontalIcon />
              </Button>
            }
          >
            <DropdownItem
              onSelect={(e) => {
                e.preventDefault();
                // In real app, navigate to details
                alert(`View: ${r.name}`);
              }}
            >
              View
            </DropdownItem>
            <DropdownItem
              className="text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setRows((prev) => prev.filter((x) => x.id !== r.id));
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  next.delete(r.id);
                  return next;
                });
              }}
            >
              Delete
            </DropdownItem>
          </Dropdown>
        ),
      };

      // Apply column visibility to the row record
      const filteredRecord: Record<string, ReactNode> = {};
      visibleColumns.forEach((col) => {
        filteredRecord[col.key] = record[col.key];
      });
      return filteredRecord;
    });
  }, [paginatedRows, selectedIds, toggleRow, visibleColumns]);

  const toolbar = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-end">
      <SearchInput value={query} onChange={handleQueryChange} placeholder="Search name, email, status..." />

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <BulkActions
          selectedCount={selectedCount}
          onDeleteSelected={handleDeleteSelected}
          onExportSelected={handleExportSelected}
        />

        <ColumnVisibilityMenu
          columns={columns}
          visibleKeys={effectiveVisibleKeys}
          onToggle={handleToggleColumn}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows</span>
          <select
            aria-label="Rows per page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="h-10 rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const table = (
    <Card variant="default">
      <CardHeader variant="compact" className="flex flex-col gap-2">
        <CardTitle size="md">Users</CardTitle>
        <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-muted-foreground">
          <span>
            Showing {(page - 1) * rowsPerPage + (paginatedRows.length > 0 ? 1 : 0)}-
            {Math.min(page * rowsPerPage, sortedRows.length)} of {sortedRows.length}
          </span>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allVisibleSelected}
              onChange={toggleAllVisible}
              label="Select page"
              labelPosition="right"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent variant="compact" className="pt-0">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table
              headings={headings}
              data={tableData}
              applySort={applySort}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showStripes
              showBorders
              showHoverEffects
              animationVariant="fade"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return <DataTablePageShell title={title} toolbar={toolbar} table={table} className={className} />;
}

export default DataTablePage;

