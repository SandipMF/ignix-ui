"use client";

import React, { useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
    KanbanBoard,
    BoardSkeleton,
    newId,
} from "@site/src/components/UI/kanban-board-page";
import type { BoardState } from "@site/src/components/UI/kanban-board-page";
import { ToastProvider } from "@site/src/components/UI/toast";
import VariantSelector from "./VariantSelector";

// Variant seed data 

function createEmptySeed(): BoardState {
    return {
        cards: {},
        columns: [
            { id: newId(), title: "To Do", accent: "rose", cardIds: [] },
            { id: newId(), title: "In Progress", accent: "amber", cardIds: [] },
            { id: newId(), title: "Done", accent: "emerald", cardIds: [] },
        ],
        search: "",
        priorityFilter: "all",
    };
}

function createMinimalSeed(): BoardState {
    const cards: BoardState["cards"] = {};
    const todoIds: string[] = [];
    const progressIds: string[] = [];

    const c1 = newId();
    cards[c1] = {
        id: c1,
        title: "Review pull request",
        description: "Check the latest PR for the auth module.",
        priority: "medium",
        labels: [{ id: newId(), name: "Code Review", color: "sky" }],
        assignees: [{ id: newId(), name: "Maya Chen" }],
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        comments: 1,
    };
    todoIds.push(c1);

    const c2 = newId();
    cards[c2] = {
        id: c2,
        title: "Fix navigation bug",
        priority: "high",
        labels: [{ id: newId(), name: "Bug", color: "red" }],
        assignees: [{ id: newId(), name: "Sam Patel" }],
    };
    todoIds.push(c2);

    const c3 = newId();
    cards[c3] = {
        id: c3,
        title: "Update dependencies",
        priority: "low",
        labels: [{ id: newId(), name: "Maintenance", color: "slate" }],
        assignees: [],
    };
    progressIds.push(c3);

    return {
        cards,
        columns: [
            { id: newId(), title: "To Do", accent: "rose", cardIds: todoIds },
            { id: newId(), title: "In Progress", accent: "amber", cardIds: progressIds },
            { id: newId(), title: "Done", accent: "emerald", cardIds: [] },
        ],
        search: "",
        priorityFilter: "all",
    };
}

function createDenseSeed(): BoardState {
    const cards: BoardState["cards"] = {};
    const colCardIds: string[][] = [[], [], [], [], []];
    const titles = [
        "Implement auth flow", "Design system tokens", "API rate limiting", "E2E tests",
        "Responsive navbar", "DB migration script", "Perf audit", "i18n setup",
        "Error boundaries", "Lighthouse CI", "Docker compose", "Redis caching",
        "SSR hydration", "Feature flags", "Webhook handler", "GraphQL schema",
        "CI pipeline", "Load testing", "Search indexing", "Email templates",
    ];
    const priorities = ["urgent", "high", "medium", "low"] as const;
    const labelNames = ["Frontend", "Backend", "Infra", "Design", "Bug", "Feature"];
    const labelColors = ["emerald", "sky", "violet", "rose", "red", "amber"] as const;

    titles.forEach((title, i) => {
        const id = newId();
        cards[id] = {
            id,
            title,
            priority: priorities[i % priorities.length],
            labels: [{ id: newId(), name: labelNames[i % labelNames.length], color: labelColors[i % labelColors.length] }],
            assignees: [{ id: newId(), name: ["Maya", "Sam", "Ava", "Noah", "Priya"][i % 5] }],
            comments: i % 3 === 0 ? i + 1 : undefined,
        };
        colCardIds[i % 5].push(id);
    });

    return {
        cards,
        columns: [
            { id: newId(), title: "Backlog", accent: "slate", cardIds: colCardIds[0] },
            { id: newId(), title: "To Do", accent: "rose", cardIds: colCardIds[1] },
            { id: newId(), title: "In Progress", accent: "amber", cardIds: colCardIds[2] },
            { id: newId(), title: "Review", accent: "violet", cardIds: colCardIds[3] },
            { id: newId(), title: "Done", accent: "emerald", cardIds: colCardIds[4] },
        ],
        search: "",
        priorityFilter: "all",
    };
}

// Variant definitions 

const BOARD_VARIANTS = [
    { value: "default", label: "Default" },
    { value: "skeleton", label: "Skeleton / Loading" },
    { value: "empty", label: "Empty Board" },
    { value: "minimal", label: "Minimal (Few Tasks)" },
    { value: "dense", label: "Dense (Many Tasks)" },
] as const;

type BoardVariant = (typeof BOARD_VARIANTS)[number]["value"];

// Code samples 

const CUSTOM_SEED_CODE = `import { KanbanBoard } from "@ignix-ui/kanban-board-page";
import { ToastProvider } from "@ignix-ui/toast";

export default function MyKanban() {
  return (
    <ToastProvider>
      <KanbanBoard />
    </ToastProvider>
  );
}`;

const SKELETON_CODE = `import { BoardSkeleton } from "@ignix-ui/kanban-board-page";

export default function LoadingKanban() {
  return <BoardSkeleton />;
}`;

const EMPTY_BOARD_CODE = `import { KanbanBoard } from "@ignix-ui/kanban-board-page";
import { ToastProvider } from "@ignix-ui/toast";

export default function EmptyKanban() {
  return (
    <ToastProvider>
      <KanbanBoard />
    </ToastProvider>
  );
}`;

const MINIMAL_CODE = `import { KanbanBoard } from "@ignix-ui/kanban-board-page";
import { ToastProvider } from "@ignix-ui/toast";

export default function MinimalKanban() {
  return (
    <ToastProvider>
      <KanbanBoard />
    </ToastProvider>
  );
}`;

const DENSE_CODE = `import { KanbanBoard } from "@ignix-ui/kanban-board-page";
import { ToastProvider } from "@ignix-ui/toast";

export default function DenseKanban() {
  return (
    <ToastProvider>
      <KanbanBoard />
    </ToastProvider>
  );
}`;


const FEATURES_CODE = `// ─── Feature highlights ─────────────────────────────────
//
// Drag & Drop
//   Smooth drag-and-drop between and within columns
//   with animated drop indicators and visual feedback.
//
// Card Modal
//   Rich card editor with:
//   • Title & description
//   • Priority selector (Urgent / High / Medium / Low)
//   • Label tags with color picker
//   • Assignee chips
//   • Date picker for due dates
//   • File attachments via FileUpload
//
// Column Management
//   • Double-click a column header to rename
//   • ⋯ menu → Clear cards / Delete column
//   • "Add column" composer with accent color picker
//
// Filtering & Search
//   • Full-text search across all card fields
//   • Priority-based checkbox filter dropdown
//   • Live per-column match counts
//
// Visual Polish
//   • Priority-colored left accent bars on cards
//   • Due date badges (overdue / soon / future)
//   • Avatar chips with deterministic colors
//   • Skeleton loading state
//
// Responsive & Accessible
//   • Horizontal scroll for many columns
//   • Keyboard-navigable dropdowns and modals
//   • Semantic HTML with proper ARIA labels

import { KanbanBoard } from "@ignix-ui/kanban-board-page";
import { ToastProvider } from "@ignix-ui/toast";

export default function FullFeaturedKanban() {
  return (
    <ToastProvider>
      <KanbanBoard />
    </ToastProvider>
  );
}`;


// Code map per variant

const CODE_MAP: Record<BoardVariant, string> = {
    default: CUSTOM_SEED_CODE,
    skeleton: SKELETON_CODE,
    empty: EMPTY_BOARD_CODE,
    minimal: MINIMAL_CODE,
    dense: DENSE_CODE,
};

//Main demo component

const KanbanDemoInner = () => {
    const [variant, setVariant] = useState<BoardVariant>("default");
    const code = CODE_MAP[variant];

    const renderPreview = () => {
        if (variant === "skeleton") {
            return (
                <div className="rounded-xl overflow-auto border border-border shadow-lg relative h-[85vh]">
                    <BoardSkeleton />
                </div>
            );
        }

        const seedMap: Partial<Record<BoardVariant, BoardState>> = {
            empty: createEmptySeed(),
            minimal: createMinimalSeed(),
            dense: createDenseSeed(),
        };

        const initialState = seedMap[variant];

        return (
            <div className="rounded-xl overflow-auto border border-border shadow-lg relative h-[85vh]">
                <KanbanBoard key={variant} initialState={initialState} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Variant selector */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <VariantSelector
                    variants={BOARD_VARIANTS.map((v) => v.value)}
                    selectedVariant={variant}
                    onSelectVariant={(v) => setVariant(v as BoardVariant)}
                    type="Variant"
                    variantLabels={Object.fromEntries(
                        BOARD_VARIANTS.map((v) => [v.value, v.label])
                    )}
                />
            </div>

            {/* Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    {renderPreview()}
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
                        {code}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Full interactive board with drag & drop 
export const DragDropDemo = () => {
    return (
        <div className="space-y-6">
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="rounded-xl overflow-auto border border-border shadow-lg relative h-[85vh]">
                        <KanbanBoard />
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
                        {CUSTOM_SEED_CODE}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Skeleton / Loading State
export const SkeletonDemo = () => {
    return (
        <div className="space-y-6">
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="rounded-xl overflow-auto border border-border shadow-lg relative h-[85vh]">
                        <BoardSkeleton />
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
                        {SKELETON_CODE}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Feature overview with code listing 
export const FeaturesDemo = () => {
    return (
        <div className="space-y-6">
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="rounded-xl overflow-auto border border-border shadow-lg relative h-[85vh]">
                        <KanbanBoard />
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
                        {FEATURES_CODE}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Default export 

export const KanbanBoardDemo = () => {
    return (
        <ToastProvider maxToasts={3} defaultPosition="bottom-right">
            <KanbanDemoInner />
        </ToastProvider>
    );
};

export default KanbanBoardDemo;
