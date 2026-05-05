import { useEffect, useMemo, useState } from "react";
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListView } from "./index";
import type { FilterGroup, FiltersState, ListItem, SortOption, SortState, StatusStyle } from "./index";

/* ============================================
   MOCK DATA & HELPERS
   Sample data + a tiny client-side query helper used by the stories.
   Real consumers fetch their own data and would not import these.
============================================ */

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

const meta: Meta<typeof ListView> = {
  title: "Templates/Pages/DataManagement/ListView",
  component: ListView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A modern list view with search, filters, sort, pagination or infinite scroll, row actions (View/Edit/Delete) and full controlled/uncontrolled state. Designed to be wired to a real server via callbacks.",
      },
    },
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Light or dark theme. Applied via a `dark` class wrapper.",
    },
    mode: {
      control: "select",
      options: ["pagination", "infinite-scroll"],
      description: "Numbered pagination or scroll-triggered infinite loading.",
    },
    pageSize: {
      control: { type: "number", min: 1, max: 50 },
    },
    loading: { control: "boolean" },
    error: { control: "text" },
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

export default meta;
type Story = StoryObj<typeof ListView>;

/* -------------------------------------------------------------------------- */
/*                          Default — client-side                             */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  name: "Default",
  render: (args) => {
    const PAGE_SIZE = 5;

    const [items, setItems] = useState<ListItem[]>(SAMPLE_ITEMS);
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState<FiltersState>({});
    const [sort, setSort] = useState<SortState>({
      key: "date",
      direction: "desc",
    });
    const [page, setPage] = useState(1);

    // full filtered+sorted list
    const filtered = useMemo(
      () => applyClientQuery(items, { query, filters, sort }),
      [items, query, filters, sort]
    );

    // reset to page 1 whenever the filtered set changes shape
    useEffect(() => {
      setPage(1);
    }, [query, filters, sort]);

    // clamp page if items get deleted and current page goes out of range
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    // slice for the current page
    const pageItems = useMemo(() => {
      const start = (safePage - 1) * PAGE_SIZE;
      return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, safePage]);

    return (
      <ListView
        {...args}
        items={pageItems}
        totalCount={filtered.length}
        page={safePage}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        filterGroups={SAMPLE_FILTER_GROUPS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SAMPLE_SORT_OPTIONS}
        statusStyles={SAMPLE_STATUS_STYLES}
        labels={{
          title: "Components",
          subtitle: "Library",
          searchPlaceholder: "Search components, tags, descriptions…",
          updateText: "Save Changes"
        }}
        onView={(it) => console.log("view", it)}
        onEdit={(it) => console.log("edit", it)}
        onDelete={async (it) => {
          await new Promise((r) => setTimeout(r, 400));
          setItems((prev) => prev.filter((x) => x.id !== it.id));
        }}
        onSelectedIdChange={(id) => console.log("selected", id)}
      />
    );
  },
};
/* -------------------------------------------------------------------------- */
/*                          Pagination explicit                               */
/* -------------------------------------------------------------------------- */

export const Pagination: Story = {
  ...Default,
  name: "Pagination mode",
  args: { mode: "pagination" },
};

/* -------------------------------------------------------------------------- */
/*                       Infinite scroll, client-side                         */
/* -------------------------------------------------------------------------- */

export const InfiniteScroll: Story = {
  name: "Infinite scroll",
  render: () => {
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const items = SAMPLE_ITEMS.slice(0, visibleCount);
    return (
      <ListView
        items={items}
        totalCount={SAMPLE_ITEMS.length}
        mode="infinite-scroll"
        loading={loading}
        onLoadMore={() => {
          if (visibleCount >= SAMPLE_ITEMS.length || loading) return;
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((v) => Math.min(v + 5, SAMPLE_ITEMS.length));
            setLoading(false);
          }, 700);
        }}
        statusStyles={SAMPLE_STATUS_STYLES}
        sortOptions={SAMPLE_SORT_OPTIONS}
        filterGroups={SAMPLE_FILTER_GROUPS}
        labels={{ title: "Components", subtitle: "Library" }}
        onView={(it) => console.log("view", it)}
        onEdit={(it) => console.log("edit", it)}
        onDelete={(it) => console.log("delete", it)}
      />
    );
  },
};

/* -------------------------------------------------------------------------- */
/*                              Dark theme                                    */
/* -------------------------------------------------------------------------- */

export const DarkTheme: Story = {
  ...Default,
  name: "Dark theme",
  args: { theme: "dark" },
};

/* -------------------------------------------------------------------------- */
/*                          Forced loading state                              */
/* -------------------------------------------------------------------------- */

export const Loading: Story = {
  name: "Loading (initial)",
  render: () => (
    <ListView
      items={[]}
      totalCount={0}
      loading
      statusStyles={SAMPLE_STATUS_STYLES}
      sortOptions={SAMPLE_SORT_OPTIONS}
      filterGroups={SAMPLE_FILTER_GROUPS}
      labels={{ title: "Components", subtitle: "Library" }}
    />
  ),
};

/* -------------------------------------------------------------------------- */
/*                                 Empty                                      */
/* -------------------------------------------------------------------------- */

export const Empty: Story = {
  name: "Empty",
  render: () => (
    <ListView
      items={[]}
      totalCount={0}
      statusStyles={SAMPLE_STATUS_STYLES}
      sortOptions={SAMPLE_SORT_OPTIONS}
      filterGroups={SAMPLE_FILTER_GROUPS}
      labels={{
        title: "Components",
        subtitle: "Library",
        emptyTitle: "Nothing here yet",
        emptyDescription: "Create your first component to get started.",
      }}
    />
  ),
};

/* -------------------------------------------------------------------------- */
/*                                 Error                                      */
/* -------------------------------------------------------------------------- */

export const Error: Story = {
  name: "Error",
  render: () => (
    <ListView
      items={[]}
      totalCount={0}
      error="The server returned a 500. We've notified the team."
      statusStyles={SAMPLE_STATUS_STYLES}
      sortOptions={SAMPLE_SORT_OPTIONS}
      filterGroups={SAMPLE_FILTER_GROUPS}
      labels={{ title: "Components", subtitle: "Library" }}
    />
  ),
};

/* -------------------------------------------------------------------------- */
/*                       No actions (read-only list)                          */
/* -------------------------------------------------------------------------- */

export const ReadOnly: Story = {
  name: "Read-only (no actions)",
  render: () => (
    <ListView
      items={SAMPLE_ITEMS.slice(0, 5)}
      totalCount={5}
      statusStyles={SAMPLE_STATUS_STYLES}
      sortOptions={SAMPLE_SORT_OPTIONS}
      filterGroups={SAMPLE_FILTER_GROUPS}
      labels={{ title: "Components", subtitle: "Library" }}
    />
  ),
};

