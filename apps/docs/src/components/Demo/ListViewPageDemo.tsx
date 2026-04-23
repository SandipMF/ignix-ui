import React, { useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import {
    ListView,
    type ListItem,
    type FiltersState,
    type SortState,
    type PaginationMode,
    type Theme,
    SortOption,
    StatusStyle,
    FilterGroup,
} from '../UI/list-view-page';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';

const SAMPLE_ITEMS: ListItem[] = [
    {
        id: "1",
        title: "Button Component v2.4",
        description:
            "Refined button component with new size variants, loading state, and improved focus ring. Adds support for icon-only buttons and better accessibility for screen readers.",
        status: "Published",
        category: "Components",
        tags: ["UI", "Form", "Accessibility"],
        date: "Apr 18, 2026",
        author: { name: "Aarav Mehta", initials: "AM" },
    },
    {
        id: "2",
        title: "Data Table Pagination Pattern",
        description:
            "Reusable pagination primitive for the data table family. Supports cursor-based and offset-based modes, configurable page sizes, and a compact mobile layout.",
        status: "In Review",
        category: "Patterns",
        tags: ["Data", "Navigation"],
        date: "Apr 16, 2026",
        author: { name: "Lena Park", initials: "LP" },
    },
    {
        id: "3",
        title: "Dialog & Modal Guidelines",
        description:
            "Updated guidance on when to use dialogs versus drawers and inline panels. Includes focus management rules, escape behavior, and stacking conventions.",
        status: "Published",
        category: "Guidelines",
        tags: ["Overlay", "UX"],
        date: "Apr 14, 2026",
        author: { name: "Kenji Watanabe", initials: "KW" },
    },
    {
        id: "4",
        title: "Color System Tokens",
        description:
            "Refresh of the semantic color tokens for surface, content, and border roles. Adds three new accent ramps and a curated dark theme variant.",
        status: "Draft",
        category: "Foundations",
        tags: ["Theming", "Tokens"],
        date: "Apr 12, 2026",
        author: { name: "Imani Brooks", initials: "IB" },
    },
    {
        id: "5",
        title: "Toast Notification API",
        description:
            "Imperative toast API with stacking, swipe-to-dismiss on touch devices, and pause-on-hover. Includes promise helper for async flows.",
        status: "Published",
        category: "Components",
        tags: ["Feedback", "Async"],
        date: "Apr 10, 2026",
        author: { name: "Sofia Romero", initials: "SR" },
    },
    {
        id: "6",
        title: "Form Field Validation Hook",
        description:
            "Headless hook that wires zod schemas to field-level errors with debounced validation. Plays nicely with the new Field primitive.",
        status: "Archived",
        category: "Hooks",
        tags: ["Forms", "Validation"],
        date: "Apr 08, 2026",
        author: { name: "Daniel Okafor", initials: "DO" },
    },
    {
        id: "7",
        title: "Sidebar Navigation Layout",
        description:
            "Responsive sidebar layout with collapsible groups, keyboard navigation, and a persistent collapsed state across sessions.",
        status: "In Review",
        category: "Layouts",
        tags: ["Navigation", "Responsive"],
        date: "Apr 06, 2026",
        author: { name: "Priya Sharma", initials: "PS" },
    },
    {
        id: "8",
        title: "Empty State Illustrations",
        description:
            "A small set of geometric empty-state illustrations matched to the brand. Available as React components with theme-aware fills.",
        status: "Published",
        category: "Assets",
        tags: ["Illustration", "Empty State"],
        date: "Apr 04, 2026",
        author: { name: "Noah Bennett", initials: "NB" },
    },
    {
        id: "9",
        title: "Keyboard Shortcut Manager",
        description:
            "Centralized keyboard shortcut registry with conflict detection and a built-in cheat sheet overlay triggered by ⌘ + /.",
        status: "Draft",
        category: "Hooks",
        tags: ["Keyboard", "DX"],
        date: "Apr 02, 2026",
        author: { name: "Mira Lindqvist", initials: "ML" },
    },
    {
        id: "10",
        title: "Skeleton & Loading Primitives",
        description:
            "Composable skeleton primitives with shimmer animation and reduced-motion fallbacks. Includes presets for cards, lists, and tables.",
        status: "Published",
        category: "Components",
        tags: ["Loading", "Animation"],
        date: "Mar 31, 2026",
        author: { name: "Ravi Subramanian", initials: "RS" },
    },
    {
        id: "11",
        title: "Tooltip Positioning Engine",
        description:
            "Floating UI integration with viewport-aware placement, collision avoidance, and a virtual element API for non-DOM anchors.",
        status: "In Review",
        category: "Patterns",
        tags: ["Floating", "Overlay"],
        date: "Mar 29, 2026",
        author: { name: "Hana Kobayashi", initials: "HK" },
    },
    {
        id: "12",
        title: "Form Field Primitive",
        description:
            "Low-level Field primitive that wires labels, descriptions, errors, and inputs together with the right ARIA attributes by default.",
        status: "Published",
        category: "Components",
        tags: ["Forms", "Accessibility"],
        date: "Mar 27, 2026",
        author: { name: "Theo Larsen", initials: "TL" },
    },
    {
        id: "13",
        title: "Motion Tokens",
        description:
            "A small, opinionated set of duration and easing tokens for consistent motion across the library. Maps cleanly to framer-motion variants.",
        status: "Draft",
        category: "Foundations",
        tags: ["Motion", "Tokens"],
        date: "Mar 25, 2026",
        author: { name: "Yui Nakamura", initials: "YN" },
    },
    {
        id: "14",
        title: "Command Palette",
        description:
            "Searchable command palette with grouped results, recents, and a headless mode for embedding into custom interfaces.",
        status: "Published",
        category: "Components",
        tags: ["Search", "Navigation"],
        date: "Mar 22, 2026",
        author: { name: "Elena Costa", initials: "EC" },
    },
    {
        id: "15",
        title: "Theme Switcher Hook",
        description:
            "useTheme hook with system preference detection, persisted user override, and SSR-safe hydration.",
        status: "Archived",
        category: "Hooks",
        tags: ["Theming", "SSR"],
        date: "Mar 20, 2026",
        author: { name: "Omar Haidari", initials: "OH" },
    },
];

const SAMPLE_FILTER_GROUPS: FilterGroup[] = [
    {
        id: "status",
        label: "Status",
        options: [
            { value: "Published", label: "Published" },
            { value: "In Review", label: "In Review" },
            { value: "Draft", label: "Draft" },
            { value: "Archived", label: "Archived" },
        ],
    },
    {
        id: "category",
        label: "Category",
        options: [
            { value: "Components", label: "Components" },
            { value: "Patterns", label: "Patterns" },
            { value: "Guidelines", label: "Guidelines" },
            { value: "Foundations", label: "Foundations" },
            { value: "Hooks", label: "Hooks" },
            { value: "Layouts", label: "Layouts" },
            { value: "Assets", label: "Assets" },
        ],
    },
];

const SAMPLE_SORT_OPTIONS: SortOption[] = [
    { key: "date", label: "Date" },
    { key: "title", label: "Alphabetical" },
];

const SAMPLE_STATUS_STYLES: Record<string, StatusStyle> = {
    Published: {
        className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
        dotClassName: "bg-emerald-500",
    },
    Draft: {
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
        dotClassName: "bg-amber-500",
    },
    Archived: {
        className: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
        dotClassName: "bg-muted-foreground/60",
    },
    "In Review": {
        className:
            "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-inset ring-sky-500/20",
        dotClassName: "bg-sky-500",
    },
};

/**
 * A tiny helper to filter+sort+paginate locally for stories that simulate
 * a server. Real consumers wouldn't ship this.
 */
function applyClientQuery(
    items: ListItem[],
    opts: {
        query?: string;
        filters?: Record<string, string[]>;
        sort?: { key: string; direction: "asc" | "desc" };
    }
): ListItem[] {
    const q = (opts.query ?? "").trim().toLowerCase();
    let out = items.filter((it) => {
        for (const [groupId, values] of Object.entries(opts.filters ?? {})) {
            if (values.length === 0) continue;
            const itemValue =
                groupId === "status" ? it.status : groupId === "category" ? it.category : undefined;
            if (!itemValue || !values.includes(itemValue)) return false;
        }
        if (!q) return true;
        return (
            it.title.toLowerCase().includes(q) ||
            (it.description ?? "").toLowerCase().includes(q) ||
            (it.tags ?? []).some((t) => t.toLowerCase().includes(q))
        );
    });
    if (opts.sort) {
        const { key, direction } = opts.sort;
        out = [...out].sort((a, b) => {
            const av =
                key === "title" ? a.title : new Date(a.date ?? 0).getTime();
            const bv =
                key === "title" ? b.title : new Date(b.date ?? 0).getTime();
            if (av < bv) return direction === "asc" ? -1 : 1;
            if (av > bv) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }
    return out;
}

// Types for our variant selectors
type ModeVariant = 'pagination' | 'infinite-scroll';
type ThemeVariant = 'light' | 'dark';
type StateVariant = 'normal' | 'loading' | 'empty' | 'error';

// Mode options
const modeOptions = [
    { value: 'pagination', label: 'Pagination' },
    { value: 'infinite-scroll', label: 'Infinite Scroll' },
];

// State options
const stateOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'loading', label: 'Loading' },
    { value: 'empty', label: 'Empty' },
    { value: 'error', label: 'Error' },
];

// Page-size options
const pageSizeOptions = [
    { value: '5', label: '5 / page' },
    { value: '10', label: '10 / page' },
    { value: '15', label: '15 / page' },
    { value: '25', label: '25 / page' },
];

// ==============================
// MAIN COMPREHENSIVE DEMO
// ==============================

export const ListViewDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();

    // Core state
    const [mode, setMode] = useState<ModeVariant>('pagination');
    const [themeVariant, setThemeVariant] = useState<ThemeVariant>(
        colorMode === 'dark' ? 'dark' : 'light'
    );
    const [stateVariant, setStateVariant] = useState<StateVariant>('normal');
    const [pageSize, setPageSize] = useState<number>(5);

    // Feature toggles
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [showSort, setShowSort] = useState<boolean>(true);
    const [showActions, setShowActions] = useState<boolean>(true);

    // Track user changes
    const [userChangedTheme, setUserChangedTheme] = useState<boolean>(false);

    // Update theme when color mode changes, but only if user hasn't manually changed it
    useEffect(() => {
        if (!userChangedTheme) {
            setThemeVariant(colorMode === 'dark' ? 'dark' : 'light');
        }
    }, [colorMode, userChangedTheme]);

    // Live data
    const [items, setItems] = useState<ListItem[]>(SAMPLE_ITEMS);
    const [query, setQuery] = useState<string>('');
    const [filters, setFilters] = useState<FiltersState>({});
    const [sort, setSort] = useState<SortState>({ key: 'date', direction: 'desc' });
    const [page, setPage] = useState<number>(1);
    const [visibleCount, setVisibleCount] = useState<number>(pageSize);

    // Filter / sort
    const filtered = useMemo(
        () => applyClientQuery(items, { query, filters, sort }),
        [items, query, filters, sort]
    );

    // Reset page / infinite cursor on query/filter/sort change
    useEffect(() => {
        setPage(1);
        setVisibleCount(pageSize);
    }, [query, filters, sort, pageSize, mode]);

    // Pagination math
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pagedItems = useMemo(
        () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
        [filtered, safePage, pageSize]
    );

    // Infinite-scroll slice
    const infiniteItems = useMemo(
        () => filtered.slice(0, visibleCount),
        [filtered, visibleCount]
    );

    // Pick the right slice / forced state
    const displayedItems: ListItem[] =
        stateVariant === 'empty' || stateVariant === 'loading'
            ? []
            : mode === 'pagination'
                ? pagedItems
                : infiniteItems;

    const buildCodeString = (): string => {
        const props = [
            mode === 'pagination'
                ? `items={pagedItems}`
                : `items={infiniteItems}`,

            `totalCount={filtered.length}`,
            `mode="${mode}"`,
            `theme="${themeVariant}"`,
            `pageSize={${pageSize}}`,

            mode === 'pagination'
                ? `page={page}
            onPageChange={setPage}`
                : `onLoadMore={() => setVisibleCount((n) => Math.min(n + ${pageSize}, filtered.length))}`,

            `query={query}`,
            `onQueryChange={setQuery}`,

            showFilters
                ? `filters={filters}
            onFiltersChange={setFilters}
            filterGroups={SAMPLE_FILTER_GROUPS}`
                : null,

            showSort
                ? `sort={sort}
            onSortChange={setSort}
            sortOptions={SAMPLE_SORT_OPTIONS}`
                : null,

            `statusStyles={SAMPLE_STATUS_STYLES}`,

            `labels={{
                title: 'Components',
                subtitle: 'Library',
                searchPlaceholder: 'Search components, tags, descriptions…',
            }}`,

            showActions
                ? `onView={(it) => console.log("view", it)}
            onEdit={(it) => console.log("edit", it)}
            onDelete={async (it) => {
                await new Promise((r) => setTimeout(r, 400));
                setItems((p) => p.filter((x) => x.id !== it.id));
            }}`
                : null,

            `onSelectedIdChange={(id) => console.log("selected", id)}`,

            stateVariant === 'loading' ? `loading` : null,

            stateVariant === 'error'
                ? `error="Couldn't reach the server."`
                : null,
        ].filter(Boolean);

        return `import { useEffect, useMemo, useState } from 'react';
import {
    ListView,
    type ListItem,
    type FiltersState,
    type SortState,
    type FilterGroup,
    type SortOption,
    type StatusStyle,
} from '@ignix-ui/list-view-page';

const SAMPLE_ITEMS: ListItem[] = [
    {
        id: "1",
        title: "Button Component v2.4",
        description:
            "Refined button component with new size variants, loading state, and improved focus ring. Adds support for icon-only buttons and better accessibility for screen readers.",
        status: "Published",
        category: "Components",
        tags: ["UI", "Form", "Accessibility"],
        date: "Apr 18, 2026",
        author: { name: "Aarav Mehta", initials: "AM" },
    },
    {
        id: "2",
        title: "Data Table Pagination Pattern",
        description:
            "Reusable pagination primitive for the data table family. Supports cursor-based and offset-based modes, configurable page sizes, and a compact mobile layout.",
        status: "In Review",
        category: "Patterns",
        tags: ["Data", "Navigation"],
        date: "Apr 16, 2026",
        author: { name: "Lena Park", initials: "LP" },
    },
    {
        id: "3",
        title: "Dialog & Modal Guidelines",
        description:
            "Updated guidance on when to use dialogs versus drawers and inline panels. Includes focus management rules, escape behavior, and stacking conventions.",
        status: "Published",
        category: "Guidelines",
        tags: ["Overlay", "UX"],
        date: "Apr 14, 2026",
        author: { name: "Kenji Watanabe", initials: "KW" },
    },
    {
        id: "4",
        title: "Color System Tokens",
        description:
            "Refresh of the semantic color tokens for surface, content, and border roles. Adds three new accent ramps and a curated dark theme variant.",
        status: "Draft",
        category: "Foundations",
        tags: ["Theming", "Tokens"],
        date: "Apr 12, 2026",
        author: { name: "Imani Brooks", initials: "IB" },
    },
    {
        id: "5",
        title: "Toast Notification API",
        description:
            "Imperative toast API with stacking, swipe-to-dismiss on touch devices, and pause-on-hover. Includes promise helper for async flows.",
        status: "Published",
        category: "Components",
        tags: ["Feedback", "Async"],
        date: "Apr 10, 2026",
        author: { name: "Sofia Romero", initials: "SR" },
    },
    {
        id: "6",
        title: "Form Field Validation Hook",
        description:
            "Headless hook that wires zod schemas to field-level errors with debounced validation. Plays nicely with the new Field primitive.",
        status: "Archived",
        category: "Hooks",
        tags: ["Forms", "Validation"],
        date: "Apr 08, 2026",
        author: { name: "Daniel Okafor", initials: "DO" },
    },
    {
        id: "7",
        title: "Sidebar Navigation Layout",
        description:
            "Responsive sidebar layout with collapsible groups, keyboard navigation, and a persistent collapsed state across sessions.",
        status: "In Review",
        category: "Layouts",
        tags: ["Navigation", "Responsive"],
        date: "Apr 06, 2026",
        author: { name: "Priya Sharma", initials: "PS" },
    },
    {
        id: "8",
        title: "Empty State Illustrations",
        description:
            "A small set of geometric empty-state illustrations matched to the brand. Available as React components with theme-aware fills.",
        status: "Published",
        category: "Assets",
        tags: ["Illustration", "Empty State"],
        date: "Apr 04, 2026",
        author: { name: "Noah Bennett", initials: "NB" },
    },
    {
        id: "9",
        title: "Keyboard Shortcut Manager",
        description:
            "Centralized keyboard shortcut registry with conflict detection and a built-in cheat sheet overlay triggered by ⌘ + /.",
        status: "Draft",
        category: "Hooks",
        tags: ["Keyboard", "DX"],
        date: "Apr 02, 2026",
        author: { name: "Mira Lindqvist", initials: "ML" },
    },
    {
        id: "10",
        title: "Skeleton & Loading Primitives",
        description:
            "Composable skeleton primitives with shimmer animation and reduced-motion fallbacks. Includes presets for cards, lists, and tables.",
        status: "Published",
        category: "Components",
        tags: ["Loading", "Animation"],
        date: "Mar 31, 2026",
        author: { name: "Ravi Subramanian", initials: "RS" },
    },
    {
        id: "11",
        title: "Tooltip Positioning Engine",
        description:
            "Floating UI integration with viewport-aware placement, collision avoidance, and a virtual element API for non-DOM anchors.",
        status: "In Review",
        category: "Patterns",
        tags: ["Floating", "Overlay"],
        date: "Mar 29, 2026",
        author: { name: "Hana Kobayashi", initials: "HK" },
    },
    {
        id: "12",
        title: "Form Field Primitive",
        description:
            "Low-level Field primitive that wires labels, descriptions, errors, and inputs together with the right ARIA attributes by default.",
        status: "Published",
        category: "Components",
        tags: ["Forms", "Accessibility"],
        date: "Mar 27, 2026",
        author: { name: "Theo Larsen", initials: "TL" },
    },
    {
        id: "13",
        title: "Motion Tokens",
        description:
            "A small, opinionated set of duration and easing tokens for consistent motion across the library. Maps cleanly to framer-motion variants.",
        status: "Draft",
        category: "Foundations",
        tags: ["Motion", "Tokens"],
        date: "Mar 25, 2026",
        author: { name: "Yui Nakamura", initials: "YN" },
    },
    {
        id: "14",
        title: "Command Palette",
        description:
            "Searchable command palette with grouped results, recents, and a headless mode for embedding into custom interfaces.",
        status: "Published",
        category: "Components",
        tags: ["Search", "Navigation"],
        date: "Mar 22, 2026",
        author: { name: "Elena Costa", initials: "EC" },
    },
    {
        id: "15",
        title: "Theme Switcher Hook",
        description:
            "useTheme hook with system preference detection, persisted user override, and SSR-safe hydration.",
        status: "Archived",
        category: "Hooks",
        tags: ["Theming", "SSR"],
        date: "Mar 20, 2026",
        author: { name: "Omar Haidari", initials: "OH" },
    },
];

const SAMPLE_FILTER_GROUPS: FilterGroup[] = [
    {
        id: "status",
        label: "Status",
        options: [
            { value: "Published", label: "Published" },
            { value: "In Review", label: "In Review" },
            { value: "Draft", label: "Draft" },
            { value: "Archived", label: "Archived" },
        ],
    },
    {
        id: "category",
        label: "Category",
        options: [
            { value: "Components", label: "Components" },
            { value: "Patterns", label: "Patterns" },
            { value: "Guidelines", label: "Guidelines" },
            { value: "Foundations", label: "Foundations" },
            { value: "Hooks", label: "Hooks" },
            { value: "Layouts", label: "Layouts" },
            { value: "Assets", label: "Assets" },
        ],
    },
];

const SAMPLE_SORT_OPTIONS: SortOption[] = [
    { key: "date", label: "Date" },
    { key: "title", label: "Alphabetical" },
];

const SAMPLE_STATUS_STYLES: Record<string, StatusStyle> = {
    Published: {
        className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
        dotClassName: "bg-emerald-500",
    },
    Draft: {
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
        dotClassName: "bg-amber-500",
    },
    Archived: {
        className: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
        dotClassName: "bg-muted-foreground/60",
    },
    "In Review": {
        className:
            "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-inset ring-sky-500/20",
        dotClassName: "bg-sky-500",
    },
};

/**
 * A tiny helper to filter+sort+paginate locally for stories that simulate
 * a server. Real consumers wouldn't ship this.
 */
function applyClientQuery(
    items: ListItem[],
    opts: {
        query?: string;
        filters?: Record<string, string[]>;
        sort?: { key: string; direction: "asc" | "desc" };
    }
): ListItem[] {
    const q = (opts.query ?? "").trim().toLowerCase();
    let out = items.filter((it) => {
        for (const [groupId, values] of Object.entries(opts.filters ?? {})) {
            if (values.length === 0) continue;
            const itemValue =
                groupId === "status" ? it.status : groupId === "category" ? it.category : undefined;
            if (!itemValue || !values.includes(itemValue)) return false;
        }
        if (!q) return true;
        return (
            it.title.toLowerCase().includes(q) ||
            (it.description ?? "").toLowerCase().includes(q) ||
            (it.tags ?? []).some((t) => t.toLowerCase().includes(q))
        );
    });
    if (opts.sort) {
        const { key, direction } = opts.sort;
        out = [...out].sort((a, b) => {
            const av =
                key === "title" ? a.title : new Date(a.date ?? 0).getTime();
            const bv =
                key === "title" ? b.title : new Date(b.date ?? 0).getTime();
            if (av < bv) return direction === "asc" ? -1 : 1;
            if (av > bv) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }
    return out;
}


export function MyListView() {
    const PAGE_SIZE = 5;

    // Live data
    const [items, setItems] = useState<ListItem[]>(SAMPLE_ITEMS);
    const [query, setQuery] = useState<string>('');
    const [filters, setFilters] = useState<FiltersState>({});
    const [sort, setSort] = useState<SortState>({ key: 'date', direction: 'desc' });
    const [page, setPage] = useState<number>(1);
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

    // Filter / sort
    const filtered = useMemo(
        () => applyClientQuery(items, { query, filters, sort }),
        [items, query, filters, sort]
    );

    // Reset page / infinite cursor on query/filter/sort change
    useEffect(() => {
        setPage(1);
        setVisibleCount(PAGE_SIZE);
    }, [query, filters, sort, PAGE_SIZE]);

    // Pagination math
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pagedItems = useMemo(
        () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
        [filtered, safePage, PAGE_SIZE]
    );

    // Infinite-scroll slice
    const infiniteItems = useMemo(
        () => filtered.slice(0, visibleCount),
        [filtered, visibleCount]
    );

    return (
    <ListView
    ${props.join("\n  ")}
    />
    );
}`;
    };

    return (
        <div className="space-y-6">
            {/* Variant selectors */}
            <div className="flex items-center justify-end flex-wrap gap-2">
                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={modeOptions.map((o) => o.value)}
                        selectedVariant={mode}
                        onSelectVariant={(value): void => setMode(value as ModeVariant)}
                        type="Mode"
                        variantLabels={Object.fromEntries(modeOptions.map((o) => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={pageSizeOptions.map((o) => o.value)}
                        selectedVariant={String(pageSize)}
                        onSelectVariant={(value): void => setPageSize(Number(value))}
                        type="Page Size"
                        variantLabels={Object.fromEntries(pageSizeOptions.map((o) => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={stateOptions.map((o) => o.value)}
                        selectedVariant={stateVariant}
                        onSelectVariant={(value): void => setStateVariant(value as StateVariant)}
                        type="State"
                        variantLabels={Object.fromEntries(stateOptions.map((o) => [o.value, o.label]))}
                    />
                </div>
            </div>

            {/* Feature toggles */}
            <div className="flex flex-row items-center justify-end flex-wrap gap-3 px-2">
                {[
                    { label: 'Filters', value: showFilters, set: setShowFilters },
                    { label: 'Sort', value: showSort, set: setShowSort },
                    { label: 'Row Actions', value: showActions, set: setShowActions },
                ].map((t) => (
                    <label key={t.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={t.value}
                            onChange={(e): void => t.set(e.target.checked)}
                            className="rounded text-primary"
                        />
                        <span
                            className={cn(
                                'text-sm',
                                themeVariant === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            )}
                        >
                            {t.label}
                        </span>
                    </label>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => {
                        setMode('pagination');
                        setThemeVariant(colorMode === 'dark' ? 'dark' : 'light');
                        setStateVariant('normal');
                        setPageSize(5);
                        setShowFilters(true);
                        setShowSort(true);
                        setShowActions(true);
                        setItems(SAMPLE_ITEMS);
                        setQuery('');
                        setFilters({});
                        setSort({ key: 'date', direction: 'desc' });
                        setPage(1);
                        setVisibleCount(5);
                        setUserChangedTheme(false);
                    }}
                    className="cursor-pointer mx-2"
                >
                    Reset All
                </Button>
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div
                        className={cn(
                            'border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden',
                            themeVariant === 'dark' ? 'bg-gray-950' : 'bg-white',
                        )}
                    >
                        <ListView
                            items={displayedItems}
                            totalCount={filtered.length}
                            mode={mode as PaginationMode}
                            theme={themeVariant as Theme}
                            pageSize={pageSize}
                            page={safePage}
                            onPageChange={setPage}
                            onLoadMore={(): void =>
                                setVisibleCount((n) =>
                                    Math.min(n + pageSize, filtered.length)
                                )
                            }
                            query={query}
                            onQueryChange={setQuery}
                            filters={showFilters ? filters : undefined}
                            onFiltersChange={showFilters ? setFilters : undefined}
                            filterGroups={showFilters ? SAMPLE_FILTER_GROUPS : undefined}
                            sort={showSort ? sort : undefined}
                            onSortChange={showSort ? setSort : undefined}
                            sortOptions={showSort ? SAMPLE_SORT_OPTIONS : undefined}
                            statusStyles={SAMPLE_STATUS_STYLES}
                            loading={stateVariant === 'loading'}
                            error={
                                stateVariant === 'error'
                                    ? "Couldn't reach the server."
                                    : null
                            }
                            labels={{
                                title: 'Components',
                                subtitle: 'Library',
                                searchPlaceholder:
                                    'Search components, tags, descriptions…',
                            }}
                            onView={
                                showActions
                                    ? (it): void => console.log('view', it)
                                    : undefined
                            }
                            onEdit={
                                showActions
                                    ? (it): void => console.log('edit', it)
                                    : undefined
                            }
                            onDelete={
                                showActions
                                    ? async (it): Promise<void> => {
                                        await new Promise((r) => setTimeout(r, 400));
                                        setItems((prev) =>
                                            prev.filter((x) => x.id !== it.id)
                                        );
                                    }
                                    : undefined
                            }
                            onSelectedIdChange={(id): void =>
                                console.log('selected', id)
                            }
                        />
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {buildCodeString()}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default ListViewDemo;
