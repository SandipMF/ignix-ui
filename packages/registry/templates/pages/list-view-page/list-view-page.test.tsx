import React, { useMemo, useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

/* ================= MOCKS ================= */
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
/**
 * Replace framer-motion with passthrough DOM elements so tests don't have to
 * deal with animation timing or layout effects. The Proxy `get` skips JS
 * engine probe keys (`then`, symbols) so the namespace is never accidentally
 * thenable — otherwise `await import(...)` would hang.
 */
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const cache: Record<string, any> = {};
  const passthrough = (tag: string) => {
    if (cache[tag]) return cache[tag];
    cache[tag] = React.forwardRef(({ children, ...props }: any, ref: any) => {
      const {
        ...rest
      } = props;
      return React.createElement(tag, { ref, ...rest }, children);
    });
    return cache[tag];
  };
  const motion = new Proxy(
    {},
    {
      get: (_t, key) => {
        if (typeof key === "symbol") return undefined;
        if (key === "then") return undefined;
        return passthrough(key as string);
      },
    }
  );
  return {
    motion,
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
    LayoutGroup: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
    useReducedMotion: () => false,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    useMotionValue: () => 0,
    useSpring: () => 0,
    useTransform: () => 0,
  };
});

import {
  ListView,
  type ListItem,
  type FiltersState,
  type SortState,
  type FilterGroup,
  type SortOption,
  type StatusStyle,
} from "./index";

/* ================= TEST HELPERS ================= */

const baseProps = {
  items: SAMPLE_ITEMS,
  filterGroups: SAMPLE_FILTER_GROUPS,
  sortOptions: SAMPLE_SORT_OPTIONS,
  statusStyles: SAMPLE_STATUS_STYLES,
  pageSize: 5,
};

const renderList = (
  overrides: Partial<React.ComponentProps<typeof ListView>> = {}
) => render(<ListView {...baseProps} {...overrides} />);

/**
 * Integration wrapper that mirrors what real consumers (Comfortable.tsx) do:
 * apply query/filters/sort/page client-side and pass the resulting page slice
 * back to ListView. Lets us assert end-to-end behaviour through the UI.
 */
function ClientListView(
  props: Partial<React.ComponentProps<typeof ListView>> & {
    dataset?: ListItem[];
  }
) {
  const dataset = props.dataset ?? SAMPLE_ITEMS;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>({});
  const [sort, setSort] = useState<SortState>({ key: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const pageSize = props.pageSize ?? 5;

  const filtered = useMemo(
    () => applyClientQuery(dataset, { query, filters, sort }),
    [dataset, query, filters, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = useMemo(
    () => filtered.slice(start, start + pageSize),
    [filtered, start, pageSize]
  );

  return (
    <ListView
      filterGroups={SAMPLE_FILTER_GROUPS}
      sortOptions={SAMPLE_SORT_OPTIONS}
      statusStyles={SAMPLE_STATUS_STYLES}
      {...props}
      items={pageItems}
      totalCount={filtered.length}
      pageSize={pageSize}
      query={query}
      onQueryChange={(q) => {
        setQuery(q);
        setPage(1);
      }}
      filters={filters}
      onFiltersChange={(f) => {
        setFilters(f);
        setPage(1);
      }}
      sort={sort}
      onSortChange={(s) => {
        setSort(s);
        setPage(1);
      }}
      page={safePage}
      onPageChange={setPage}
    />
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

/* =================================================================
 * RENDERING
 * ================================================================= */

describe("ListView - rendering", () => {
  it("renders the default title and item count", () => {
    renderList();
    expect(
      screen.getByRole("heading", { name: "Items", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText(`${SAMPLE_ITEMS.length} items`)).toBeInTheDocument();
  });

  it("renders custom labels when provided", () => {
    renderList({
      labels: {
        title: "Components Library",
        subtitle: "Browse the design system",
        searchPlaceholder: "Find…",
      },
    });
    expect(
      screen.getByRole("heading", { name: "Components Library" })
    ).toBeInTheDocument();
    expect(screen.getByText("Browse the design system")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Find…")).toBeInTheDocument();
  });

  it("renders all items it is given (no internal slicing)", () => {
    renderList();
    SAMPLE_ITEMS.forEach((it) => {
      expect(screen.getByText(it.title)).toBeInTheDocument();
    });
  });

  it("shows pagination footer using totalCount and pageSize", () => {
    renderList({ pageSize: 5, totalCount: 15 });
    // Footer reads "Showing 1–5 of 15"
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    // Page numbers 1, 2, 3 each rendered as buttons in the pager
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
  });
});

/* =================================================================
 * SEARCH
 * ================================================================= */

describe("ListView - search", () => {
  it("fires onQueryChange when typing", () => {
    const onQueryChange = vi.fn();
    renderList({ onQueryChange });
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "abc" },
    });
    expect(onQueryChange).toHaveBeenCalledWith("abc");
  });

  it("renders the empty state when items is empty", () => {
    renderList({
      items: [],
      labels: {
        emptyTitle: "Nothing here",
        emptyDescription: "Try adjusting filters",
      },
    });
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting filters")).toBeInTheDocument();
  });

  it("[integration] filters items by query end-to-end", async () => {
    render(<ClientListView pageSize={20} />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Toast" },
    });
    await waitFor(() => {
      expect(screen.getByText(/Toast Notification API/)).toBeInTheDocument();
      expect(screen.queryByText(/Button Component/)).not.toBeInTheDocument();
    });
  });

  it("[integration] shows the empty state when query matches nothing", async () => {
    render(<ClientListView />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "zzznothing" },
    });
    expect(await screen.findByText(/no items match your filters/i)).toBeInTheDocument();
  });
});

/* =================================================================
 * SORT
 * ================================================================= */

describe("ListView - sort", () => {
  it("fires onSortChange when sort option changes", async () => {
    const onSortChange = vi.fn();
    renderList({ onSortChange });

    fireEvent.click(screen.getByRole("button", { name: /sort/i }));
    fireEvent.click(
      await screen.findByRole("menuitemradio", { name: /alphabetical/i })
    );

    expect(onSortChange).toHaveBeenCalledWith(
      expect.objectContaining({ key: "title" })
    );
  });

  it("[integration] re-orders items when sort changes", async () => {
    render(<ClientListView pageSize={50} />);

    fireEvent.click(screen.getByRole("button", { name: /sort/i }));
    fireEvent.click(
      await screen.findByRole("menuitemradio", { name: /alphabetical/i })
    );

    const expected = [...SAMPLE_ITEMS]
      .map((i) => i.title)
      .sort((a, b) => b.localeCompare(a));
    // direction defaults to "desc" for the freshly picked sort key
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent?.trim() ?? "");
    expect(headings.slice(0, 3)).toEqual(expected.slice(0, 3));
  });
});

/* =================================================================
 * FILTERS
 * ================================================================= */

describe("ListView - filters", () => {
  it("fires onFiltersChange when a filter checkbox is toggled", async () => {
    const onFiltersChange = vi.fn();
    renderList({ onFiltersChange });

    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    fireEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "Published" })
    );

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: ["Published"] })
    );
  });

  it("[integration] hides items that don't match the active filter", async () => {
    render(<ClientListView pageSize={50} />);

    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    fireEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "Draft" })
    );

    await waitFor(() => {
      const drafts = SAMPLE_ITEMS.filter((i) => i.status === "Draft");
      drafts.forEach((d) =>
        expect(screen.getByText(d.title)).toBeInTheDocument()
      );
      const published = SAMPLE_ITEMS.find((i) => i.status === "Published")!;
      expect(screen.queryByText(published.title)).not.toBeInTheDocument();
    });
  });

  it("[integration] 'Clear all filters' resets the list", async () => {
    render(<ClientListView pageSize={50} />);

    fireEvent.click(screen.getByRole("button", { name: /^filters/i }));
    fireEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "Draft" })
    );

    // Popover stays open after a checkbox tick, so click 'Clear all filters' directly
    fireEvent.click(await screen.findByText(/clear all filters/i));

    await waitFor(() => {
      // a Published item is back in the list
      expect(screen.getByText("Toast Notification API")).toBeInTheDocument();
    });
  });
});

/* =================================================================
 * PAGINATION
 * ================================================================= */

describe("ListView - pagination", () => {
  it("fires onPageChange when the next-page button is clicked", () => {
    const onPageChange = vi.fn();
    renderList({ pageSize: 5, totalCount: 15, onPageChange });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("[integration] navigating to page 2 shows the next slice", async () => {
    render(<ClientListView pageSize={5} />);

    expect(screen.getByText(SAMPLE_ITEMS[0].title)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(SAMPLE_ITEMS[5].title)).toBeInTheDocument();
      expect(screen.queryByText(SAMPLE_ITEMS[0].title)).not.toBeInTheDocument();
    });
  });

  it("[integration] resets to page 1 when the search query changes", async () => {
    render(<ClientListView pageSize={5} />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() =>
      expect(screen.getByText(SAMPLE_ITEMS[5].title)).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Component" },
    });

    await waitFor(() =>
      expect(screen.getByText(SAMPLE_ITEMS[0].title)).toBeInTheDocument()
    );
  });
});

/* =================================================================
 * SELECTION
 * ================================================================= */

describe("ListView - selection", () => {
  it("fires onSelectedIdChange when a row is clicked", () => {
    const onSelectedIdChange = vi.fn();
    renderList({ onSelectedIdChange });

    fireEvent.click(screen.getByText(SAMPLE_ITEMS[0].title));

    expect(onSelectedIdChange).toHaveBeenCalledWith(SAMPLE_ITEMS[0].id);
  });
});

/* =================================================================
 * ROW ACTIONS
 * ================================================================= */

describe("ListView - row actions", () => {
  it("opens the View dialog when the View action is clicked", async () => {
    renderList({ onView: vi.fn() });

    const viewButtons = screen.getAllByRole("button", { name: "View" });
    fireEvent.click(viewButtons[0]);

    // Dialog renders the item title as a heading
    await waitFor(() => {
      const dialogHeadings = screen.getAllByRole("heading", {
        name: SAMPLE_ITEMS[0].title,
      });
      expect(dialogHeadings.length).toBeGreaterThanOrEqual(2); // row + dialog
    });
  });

  it("opens the Edit dialog when the Edit action is clicked", async () => {
    renderList({ onEdit: vi.fn() });

    const editButtons = screen.getAllByRole("button", { name: "Edit" });
    fireEvent.click(editButtons[0]);

    const allEditButtons = await screen.findAllByRole("button", { name: /edit/i });

    expect(allEditButtons.length).toBeGreaterThan(0);
  });

  it("opens delete confirmation and fires onDelete on confirm", async () => {
    const onDelete = vi.fn();
    renderList({ onDelete });

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[0]);

    // Confirm dialog title appears
    await screen.findByText(/delete this item\?/i);

    // Find the dialog's confirm button (the one inside the dialog, not the row trigger)
    const allDeleteButtons = screen.getAllByRole("button", { name: /delete/i });
    // Last one should be the confirm action inside the dialog
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1]);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete.mock.calls[0][0]).toEqual(
        expect.objectContaining({ id: SAMPLE_ITEMS[0].id })
      );
    });
  });

  it("does not fire onDelete when the dialog is cancelled", async () => {
    const onDelete = vi.fn();
    renderList({ onDelete });

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[0]);

    const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(onDelete).not.toHaveBeenCalled();
  });
});

/* =================================================================
 * STATES
 * ================================================================= */

describe("ListView - states", () => {
  it("renders skeleton rows when loading and items is empty", () => {
    const { container } = renderList({ items: [], loading: true });
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders the error state with the provided error message", () => {
    renderList({
      error: "Network down",
      labels: { errorTitle: "Boom" },
    });
    expect(screen.getByText("Boom")).toBeInTheDocument();
    expect(screen.getByText("Network down")).toBeInTheDocument();
  });

  it("renders the empty state when items is an empty array", () => {
    renderList({ items: [] });
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });
});


/* =================================================================
 * applyClientQuery (pure utility)
 * ================================================================= */

describe("applyClientQuery", () => {
  it("filters by query against title, description and tags", () => {
    const out = applyClientQuery(SAMPLE_ITEMS, { query: "toast" });
    expect(out.length).toBeGreaterThan(0);
    expect(
      out.every((i) =>
        /toast/i.test(`${i.title} ${i.description} ${i.tags?.join(" ")}`)
      )
    ).toBe(true);
  });

  it("filters by status group", () => {
    const out = applyClientQuery(SAMPLE_ITEMS, { filters: { status: ["Draft"] } });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((i) => i.status === "Draft")).toBe(true);
  });

  it("returns all items when filter values are empty", () => {
    const out = applyClientQuery(SAMPLE_ITEMS, { filters: { status: [] } });
    expect(out).toHaveLength(SAMPLE_ITEMS.length);
  });

  it("sorts by title ascending", () => {
    const out = applyClientQuery(SAMPLE_ITEMS, {
      sort: { key: "title", direction: "asc" },
    });
    const titles = out.map((i) => i.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it("sorts by date descending", () => {
    const out = applyClientQuery(SAMPLE_ITEMS, {
      sort: { key: "date", direction: "desc" },
    });
    const ts = out.map((i) => new Date(i.date ?? 0).getTime());
    expect(ts).toEqual([...ts].sort((a, b) => b - a));
  });

  it("composes filter + query + sort", () => {
    const out = applyClientQuery(SAMPLE_ITEMS, {
      query: "form",
      filters: { status: ["Published"] },
      sort: { key: "title", direction: "asc" },
    });
    expect(out.every((i) => i.status === "Published")).toBe(true);
    const titles = out.map((i) => i.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });
});
