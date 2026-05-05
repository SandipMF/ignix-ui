import React, { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import {
    Calendar,
    Eraser,
    Filter,
    LayoutGrid,
    MessageSquare,
    MoreHorizontal,
    Paperclip,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import { AnimatedInput as Input } from "../../../../components/input";
import Textarea from "../../../../components/textarea";
import { Modal } from "../../../../components/modals";
import DatePicker from "../../../../components/date-picker";
import {
    Dropdown,
    DropdownItem,
    DropdownLabel,
    DropdownSeparator,
    DropdownCheckboxItem
} from "../../../../components/dropdown";
import { ToastProvider, useToast } from "../../../../components/toast";
import { ChevronDown, Check } from "lucide-react";

export type Priority = "urgent" | "high" | "medium" | "low";

export type LabelColor =
    | "red"
    | "rose"
    | "amber"
    | "emerald"
    | "sky"
    | "violet"
    | "slate";

export interface Label {
    id: string;
    name: string;
    color: LabelColor;
}

export interface Assignee {
    id: string;
    name: string;
}

export interface Card {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    labels: Label[];
    assignees: Assignee[];
    dueDate?: string;
    comments?: number;
    attachments?: number;
}

export interface Column {
    id: string;
    title: string;
    accent: LabelColor;
    cardIds: string[];
}

export interface BoardState {
    columns: Column[];
    cards: Record<string, Card>;
    search: string;
    priorityFilter: Priority | "all";
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const newId = uid;

function inDays(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString();
}

export function createSeed(): BoardState {
    const cardEntries = [
        {
            title: "Redesign onboarding flow",
            description:
                "Reduce steps from 5 to 3, add progress indicator, and refresh the welcome illustration.",
            priority: "high" as const,
            labels: [
                { id: uid(), name: "Design", color: "rose" as const },
                { id: uid(), name: "UX", color: "violet" as const },
            ],
            assignees: [{ id: uid(), name: "Maya Chen" }],
            dueDate: inDays(2),
            comments: 4,
            attachments: 2,
            column: 0,
        },
        {
            title: "Audit landing page copy",
            description:
                "Tighten the hero headline and rewrite the social-proof section with new testimonials.",
            priority: "medium" as const,
            labels: [{ id: uid(), name: "Marketing", color: "amber" as const }],
            assignees: [{ id: uid(), name: "Jordan Reyes" }],
            dueDate: inDays(5),
            comments: 1,
            column: 0,
        },
        {
            title: "Set up error tracking",
            description:
                "Integrate Sentry with source maps; alert the on-call channel for P1s.",
            priority: "urgent" as const,
            labels: [
                { id: uid(), name: "Infra", color: "sky" as const },
                { id: uid(), name: "Bug", color: "red" as const },
            ],
            assignees: [{ id: uid(), name: "Sam Patel" }],
            dueDate: inDays(-1),
            comments: 7,
            attachments: 1,
            column: 0,
        },
        {
            title: "Draft Q3 product roadmap",
            description:
                "Align with design + eng leads on shippable themes and external commitments.",
            priority: "medium" as const,
            labels: [{ id: uid(), name: "Planning", color: "slate" as const }],
            assignees: [
                { id: uid(), name: "Priya Shah" },
                { id: uid(), name: "Liam Brooks" },
            ],
            dueDate: inDays(9),
            column: 0,
        },
        {
            title: "Build Kanban drag-and-drop",
            description:
                "Smooth integration with keyboard support and animated drop targets.",
            priority: "high" as const,
            labels: [
                { id: uid(), name: "Frontend", color: "emerald" as const },
                { id: uid(), name: "Feature", color: "violet" as const },
            ],
            assignees: [{ id: uid(), name: "Ava Martín" }],
            dueDate: inDays(1),
            comments: 3,
            column: 1,
        },
        {
            title: "Migrate billing to Stripe v2",
            description:
                "Switch invoices to hosted pages and reconcile webhooks for the new product catalog.",
            priority: "urgent" as const,
            labels: [
                { id: uid(), name: "Billing", color: "red" as const },
                { id: uid(), name: "Backend", color: "sky" as const },
            ],
            assignees: [{ id: uid(), name: "Noah Williams" }],
            dueDate: inDays(3),
            comments: 12,
            attachments: 4,
            column: 1,
        },
        {
            title: "Ship dark mode to public beta",
            description: "Final accessibility pass and changelog post.",
            priority: "low" as const,
            labels: [{ id: uid(), name: "Design", color: "rose" as const }],
            assignees: [{ id: uid(), name: "Maya Chen" }],
            dueDate: inDays(7),
            comments: 2,
            column: 2,
        },
        {
            title: "Refresh brand color palette",
            description:
                "Crimson reds across the board, with WCAG-compliant pairings for surfaces.",
            priority: "medium" as const,
            labels: [
                { id: uid(), name: "Brand", color: "rose" as const },
                { id: uid(), name: "Design", color: "violet" as const },
            ],
            assignees: [{ id: uid(), name: "Priya Shah" }],
            dueDate: inDays(-3),
            attachments: 6,
            column: 2,
        },
        {
            title: "Customer interviews — power users",
            description:
                "Five 30-minute sessions; synthesize themes for the next planning cycle.",
            priority: "low" as const,
            labels: [{ id: uid(), name: "Research", color: "amber" as const }],
            assignees: [{ id: uid(), name: "Jordan Reyes" }],
            dueDate: inDays(-10),
            comments: 5,
            column: 2,
        },
    ];

    const cards: BoardState["cards"] = {};
    const columnCards: string[][] = [[], [], []];
    cardEntries.forEach((c) => {
        const id = uid();
        const { column, ...rest } = c;
        cards[id] = { id, ...rest };
        columnCards[column].push(id);
    });

    return {
        cards,
        columns: [
            { id: uid(), title: "To Do", accent: "rose", cardIds: columnCards[0] },
            { id: uid(), title: "In Progress", accent: "amber", cardIds: columnCards[1] },
            { id: uid(), title: "Done", accent: "emerald", cardIds: columnCards[2] },
        ],
        search: "",
        priorityFilter: "all",
    };
}

// ─────────────────────────────────────────────────────────────
// UTILS (utils.ts)
// ─────────────────────────────────────────────────────────────

export const LABEL_COLORS: LabelColor[] = [
    "red", "rose", "amber", "emerald", "sky", "violet", "slate",
];

export const labelClasses: Record<LabelColor, string> = {
    red: "bg-label-red/12 text-label-red ring-label-red/25",
    rose: "bg-label-rose/12 text-label-rose ring-label-rose/25",
    amber: "bg-label-amber/15 text-label-amber ring-label-amber/30",
    emerald: "bg-label-emerald/12 text-label-emerald ring-label-emerald/25",
    sky: "bg-label-sky/12 text-label-sky ring-label-sky/25",
    violet: "bg-label-violet/12 text-label-violet ring-label-violet/25",
    slate: "bg-label-slate/12 text-label-slate ring-label-slate/25",
};

export const labelDot: Record<LabelColor, string> = {
    red: "bg-label-red",
    rose: "bg-label-rose",
    amber: "bg-label-amber",
    emerald: "bg-label-emerald",
    sky: "bg-label-sky",
    violet: "bg-label-violet",
    slate: "bg-label-slate",
};

export const priorityMeta: Record<Priority, { label: string; bar: string; chip: string }> = {
    urgent: {
        label: "Urgent",
        bar: "bg-priority-urgent",
        chip: "bg-priority-urgent/10 text-priority-urgent ring-priority-urgent/25",
    },
    high: {
        label: "High",
        bar: "bg-priority-high",
        chip: "bg-priority-high/10 text-priority-high ring-priority-high/25",
    },
    medium: {
        label: "Medium",
        bar: "bg-priority-medium",
        chip: "bg-priority-medium/15 text-priority-medium ring-priority-medium/30",
    },
    low: {
        label: "Low",
        bar: "bg-priority-low",
        chip: "bg-priority-low/15 text-priority-low ring-priority-low/30",
    },
};

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("");
}

const AVATAR_COLORS = [
    "bg-label-rose text-white",
    "bg-label-amber text-white",
    "bg-label-emerald text-white",
    "bg-label-sky text-white",
    "bg-label-violet text-white",
    "bg-label-red text-white",
];

export function avatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function formatDueDate(iso?: string): {
    text: string;
    tone: "overdue" | "soon" | "future" | "none";
} {
    if (!iso) return { text: "", tone: "none" };
    const d = new Date(iso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
        (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let text: string;
    if (diffDays === 0) text = "Today";
    else if (diffDays === 1) text = "Tomorrow";
    else if (diffDays === -1) text = "Yesterday";
    else if (diffDays > 1 && diffDays < 7) text = `In ${diffDays} days`;
    else if (diffDays < -1 && diffDays > -7) text = `${Math.abs(diffDays)}d overdue`;
    else
        text = d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year:
                target.getFullYear() === today.getFullYear() ? undefined : "numeric",
        });

    const tone = diffDays < 0 ? "overdue" : diffDays <= 2 ? "soon" : "future";
    return { text, tone };
}

// ─────────────────────────────────────────────────────────────
// STORE (store.tsx)
// ─────────────────────────────────────────────────────────────

type Action =
    | { type: "setSearch"; value: string }
    | { type: "setPriorityFilter"; value: Priority | "all" }
    | { type: "addColumn"; title: string; accent: LabelColor }
    | { type: "renameColumn"; columnId: string; title: string }
    | { type: "deleteColumn"; columnId: string }
    | { type: "clearColumn"; columnId: string }
    | { type: "addCard"; columnId: string; card: Omit<Card, "id"> }
    | { type: "updateCard"; card: Card }
    | { type: "deleteCard"; cardId: string }
    | { type: "moveCard"; cardId: string; toColumnId: string; toIndex: number };

function reducer(state: BoardState, action: Action): BoardState {
    switch (action.type) {
        case "setSearch":
            return { ...state, search: action.value };
        case "setPriorityFilter":
            return { ...state, priorityFilter: action.value };
        case "addColumn":
            return {
                ...state,
                columns: [
                    ...state.columns,
                    { id: newId(), title: action.title, accent: action.accent, cardIds: [] },
                ],
            };
        case "renameColumn":
            return {
                ...state,
                columns: state.columns.map((c) =>
                    c.id === action.columnId ? { ...c, title: action.title } : c
                ),
            };
        case "deleteColumn": {
            const col = state.columns.find((c) => c.id === action.columnId);
            const cards = { ...state.cards };
            col?.cardIds.forEach((id) => delete cards[id]);
            return {
                ...state,
                columns: state.columns.filter((c) => c.id !== action.columnId),
                cards,
            };
        }
        case "clearColumn": {
            const col = state.columns.find((c) => c.id === action.columnId);
            if (!col) return state;
            const cards = { ...state.cards };
            col.cardIds.forEach((id) => delete cards[id]);
            return {
                ...state,
                cards,
                columns: state.columns.map((c) =>
                    c.id === action.columnId ? { ...c, cardIds: [] } : c
                ),
            };
        }
        case "addCard": {
            const id = newId();
            const card: Card = { id, ...action.card };
            return {
                ...state,
                cards: { ...state.cards, [id]: card },
                columns: state.columns.map((c) =>
                    c.id === action.columnId ? { ...c, cardIds: [...c.cardIds, id] } : c
                ),
            };
        }
        case "updateCard":
            return { ...state, cards: { ...state.cards, [action.card.id]: action.card } };
        case "deleteCard": {
            const cards = { ...state.cards };
            delete cards[action.cardId];
            return {
                ...state,
                cards,
                columns: state.columns.map((c) => ({
                    ...c,
                    cardIds: c.cardIds.filter((id) => id !== action.cardId),
                })),
            };
        }
        case "moveCard": {
            const fromCol = state.columns.find((c) => c.cardIds.includes(action.cardId));
            if (!fromCol) return state;
            const toCol = state.columns.find((c) => c.id === action.toColumnId);
            if (!toCol) return state;

            const fromIndex = fromCol.cardIds.indexOf(action.cardId);
            let adjustedIndex = action.toIndex;

            if (fromCol.id === toCol.id && fromIndex < action.toIndex) {
                adjustedIndex = action.toIndex - 1;
            }

            const sourceIds = fromCol.cardIds.filter((id) => id !== action.cardId);
            const targetIds =
                fromCol.id === toCol.id ? sourceIds : [...toCol.cardIds];

            const insertAt = Math.min(Math.max(adjustedIndex, 0), targetIds.length);
            targetIds.splice(insertAt, 0, action.cardId);

            return {
                ...state,
                columns: state.columns.map((c) => {
                    if (c.id === fromCol.id && c.id === toCol.id) return { ...c, cardIds: targetIds };
                    if (c.id === fromCol.id) return { ...c, cardIds: sourceIds };
                    if (c.id === toCol.id) return { ...c, cardIds: targetIds };
                    return c;
                }),
            };
        }
        default:
            return state;
    }
}

interface BoardCtx {
    state: BoardState;
    dispatch: React.Dispatch<Action>;
    visibleCardIds: (column: Column) => string[];
}

const BoardContext = createContext<BoardCtx | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, undefined, createSeed);

    const value = useMemo<BoardCtx>(() => {
        const q = state.search.trim().toLowerCase();
        const matches = (cardId: string) => {
            const card = state.cards[cardId];
            if (!card) return false;
            if (state.priorityFilter !== "all" && card.priority !== state.priorityFilter)
                return false;
            if (!q) return true;
            const hay = [
                card.title,
                card.description ?? "",
                ...card.labels.map((l) => l.name),
                ...card.assignees.map((a) => a.name),
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(q);
        };
        return {
            state,
            dispatch,
            visibleCardIds: (column) => column.cardIds.filter(matches),
        };
    }, [state]);

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
    const ctx = useContext(BoardContext);
    if (!ctx) throw new Error("useBoard must be used inside BoardProvider");
    return ctx;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: AvatarChip (AvatarChip.tsx)
// ─────────────────────────────────────────────────────────────

interface AvatarChipProps {
    name: string;
    size?: "sm" | "md";
    className?: string;
}

function AvatarChip({ name, size = "sm", className }: AvatarChipProps) {
    const dim = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
    return (
        <span
            title={name}
            className={cn(
                "inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-card",
                dim,
                avatarColor(name),
                className
            )}
        >
            {initials(name)}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: BoardCard (BoardCard.tsx)
// ─────────────────────────────────────────────────────────────

interface BoardCardProps {
    card: Card;
    onOpen: (card: Card) => void;
    isDragging?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
}

function BoardCard({ card, onOpen, isDragging, onDragStart, onDragEnd, onDragOver }: BoardCardProps) {
    const due = formatDueDate(card.dueDate);
    const prio = priorityMeta[card.priority];

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                onDragOver?.(e);
            }}
            onClick={(e: any) => {
                if ((e.target as HTMLElement).closest("[data-no-card-open]")) return;
                onOpen(card);
            }}
            className={cn(
                "group relative cursor-grab active:cursor-grabbing select-none",
                "rounded-xl bg-card text-card-foreground border border-border/70",
                "shadow-card hover:shadow-card-hover hover:border-border",
                "transition-[box-shadow,border-color,opacity] duration-200",
                "overflow-hidden",
                isDragging && "opacity-40"
            )}
        >
            {/* priority stripe */}
            <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", prio.bar)} />

            <div className="pl-4 pr-3.5 py-3.5 pointer-events-none">
                {/* labels */}
                {card.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2 pointer-events-auto">
                        {card.labels.map((l) => (
                            <span
                                key={l.id}
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset",
                                    labelClasses[l.color as LabelColor]
                                )}
                            >
                                {l.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* title */}
                <h3 className="font-display font-semibold text-[14.5px] leading-snug text-foreground pointer-events-auto">
                    {card.title}
                </h3>

                {/* description */}
                {card.description && (
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground line-clamp-2 pointer-events-auto">
                        {card.description}
                    </p>
                )}

                {/* footer */}
                <div className="mt-3 flex items-center justify-between gap-2 pointer-events-auto">
                    <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
                        {due.text && (
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
                                    due.tone === "overdue" && "bg-priority-urgent/10 text-priority-urgent",
                                    due.tone === "soon" && "bg-priority-medium/15 text-priority-medium",
                                    due.tone === "future" && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Calendar className="h-3 w-3" />
                                {due.text}
                            </span>
                        )}
                        {!!card.comments && (
                            <span className="inline-flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {card.comments}
                            </span>
                        )}
                        {!!card.attachments && (
                            <span className="inline-flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />
                                {card.attachments}
                            </span>
                        )}
                    </div>
                    {card.assignees.length > 0 && (
                        <div className="flex -space-x-1.5">
                            {card.assignees.slice(0, 3).map((a) => (
                                <AvatarChip key={a.id} name={a.name} />
                            ))}
                            {card.assignees.length > 3 && (
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
                                    +{card.assignees.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: CardModal (CardModal.tsx)
// ─────────────────────────────────────────────────────────────

interface CardModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mode: "create" | "edit";
    columnId?: string;
    card?: Card;
}

const PRIORITIES_LIST: Priority[] = ["urgent", "high", "medium", "low"];

function CardModal({ open, onOpenChange, mode, columnId, card }: CardModalProps) {
    const { dispatch } = useBoard();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [labels, setLabels] = useState<Label[]>([]);
    const [assignees, setAssignees] = useState<Assignee[]>([]);
    const [dueDate, setDueDate] = useState<Date | undefined>();

    const [labelDraft, setLabelDraft] = useState("");
    const [labelColor, setLabelColor] = useState<LabelColor>("rose");
    const [assigneeDraft, setAssigneeDraft] = useState("");

    useEffect(() => {
        if (!open) return;
        if (mode === "edit" && card) {
            setTitle(card.title);
            setDescription(card.description ?? "");
            setPriority(card.priority);
            setLabels(card.labels);
            setAssignees(card.assignees);
            setDueDate(card.dueDate ? new Date(card.dueDate) : undefined);
        } else {
            setTitle("");
            setDescription("");
            setPriority("medium");
            setLabels([]);
            setAssignees([]);
            setDueDate(undefined);
        }
        setLabelDraft("");
        setLabelColor("rose");
        setAssigneeDraft("");
    }, [open, mode, card]);

    const addLabel = () => {
        const name = labelDraft.trim();
        if (!name) return;
        setLabels((s) => [...s, { id: newId(), name, color: labelColor }]);
        setLabelDraft("");
    };
    const removeLabel = (id: string) => setLabels((s) => s.filter((l) => l.id !== id));

    const addAssignee = () => {
        const name = assigneeDraft.trim();
        if (!name) return;
        setAssignees((s) => [...s, { id: newId(), name }]);
        setAssigneeDraft("");
    };
    const removeAssignee = (id: string) => setAssignees((s) => s.filter((a) => a.id !== id));

    const handleSave = () => {
        const t = title.trim();
        if (!t) return;
        const payload = {
            title: t,
            description: description.trim() || undefined,
            priority,
            labels,
            assignees,
            dueDate: dueDate ? dueDate.toISOString() : undefined,
            comments: card?.comments,
            attachments: card?.attachments,
        };
        if (mode === "edit" && card) {
            dispatch({ type: "updateCard", card: { id: card.id, ...payload } });
        } else if (columnId) {
            dispatch({ type: "addCard", columnId, card: payload });
        }
        onOpenChange(false);
    };

    const onDeleteCard = (cardId: string) => {
        dispatch({ type: "deleteCard", cardId });
    };

    return (
        <Modal
            isOpen={open}
            onClose={() => onOpenChange(false)}
            size="xl"
            title={mode === "create" ? "Create New Card" : "Edit Card"}
            showFooter={false}
        >
            <div className="space-y-6 py-2">
                <p className="text-sm text-muted-foreground -mt-4 mb-4">
                    {mode === "create" ? "Add a new card to your board." : "View and edit card details."}
                </p>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="card-title" className="text-sm font-medium leading-none">Title</label>
                        <Input
                            id="card-title"
                            variant="clean"
                            placeholder=""
                            value={title}
                            onChange={setTitle}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="card-desc" className="text-sm font-medium leading-none">Description</label>
                        <Textarea
                            id="card-desc"
                            variant="clean"
                            placeholder=""
                            className="min-h-[100px] resize-none"
                            value={description}
                            onChange={(v: string) => setDescription(v)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium leading-none">Priority</label>
                            <Dropdown
                                trigger={
                                    <Button variant="outline" className="w-full justify-between h-11 px-4 rounded-xl border-input bg-background hover:bg-background/80">
                                        <span className="inline-flex items-center gap-2">
                                            <span className={cn("h-2 w-2 rounded-full", priorityMeta[priority].bar)} />
                                            {priorityMeta[priority].label}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                }
                                align="start"
                                className="w-[200px]"
                            >
                                {PRIORITIES_LIST.map((p) => (
                                    <DropdownItem
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={cn(
                                            "flex items-center gap-2",
                                            priority === p && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <span className={cn("h-2 w-2 rounded-full", priorityMeta[p].bar)} />
                                        {priorityMeta[p].label}
                                        {priority === p && <Check className="h-4 w-4 ml-auto opacity-70" />}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium leading-none">Due date</label>
                            <DatePicker
                                value={dueDate}
                                onChange={(date) => setDueDate(date as Date)}
                                variant="single"
                                size="sm"
                                placeholder="Pick a date"
                                className="w-full"
                                inputClassName={cn(
                                    "w-full justify-start font-normal !h-9 !rounded-md",
                                    !dueDate && "text-muted-foreground"
                                )}
                                calendarClassName="bg-background border shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium leading-none">Labels</label>
                        <div className="flex flex-wrap gap-1.5 min-h-6">
                            {labels.length === 0 && (
                                <span className="text-[12.5px] text-muted-foreground">No labels yet.</span>
                            )}
                            {labels.map((l) => (
                                <span
                                    key={l.id}
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                                        labelClasses[l.color as LabelColor]
                                    )}
                                >
                                    {l.name}
                                    <button
                                        type="button"
                                        onClick={() => removeLabel(l.id)}
                                        className="ml-0.5 opacity-70 hover:opacity-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={labelDraft}
                                onChange={setLabelDraft}
                                variant="clean"
                                onKeyDown={(e: any) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addLabel();
                                    }
                                }}
                                placeholder=""
                                className="flex-1"
                            />
                            <Dropdown
                                trigger={
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                }
                                align="end"
                                className="w-48 p-2"
                            >
                                <div className="grid grid-cols-4 gap-2">
                                    {LABEL_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            className={cn(
                                                "h-8 w-8 rounded-full border border-border transition-all hover:scale-110",
                                                `bg-label-${color}`
                                            )}
                                            onClick={() => {
                                                setLabelColor(color);
                                                addLabel();
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium leading-none">Assignees</label>
                        <div className="flex flex-wrap gap-1.5 min-h-6">
                            {assignees.length === 0 && (
                                <span className="text-[12.5px] text-muted-foreground">No one assigned.</span>
                            )}
                            {assignees.map((a) => (
                                <span
                                    key={a.id}
                                    className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                                >
                                    {a.name}
                                    <button
                                        type="button"
                                        onClick={() => removeAssignee(a.id)}
                                        className="ml-0.5 opacity-70 hover:opacity-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            value={assigneeDraft}
                            onChange={setAssigneeDraft}
                            variant="clean"
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addAssignee();
                                }
                            }}
                            placeholder=""
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t gap-2">
                    {mode === "edit" ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                                if (confirm("Delete this card?")) {
                                    onDeleteCard?.(card!.id);
                                    onOpenChange(false);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Card
                        </Button>
                    ) : (
                        <div />
                    )}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            {mode === "create" ? "Create Card" : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: BoardColumn (BoardColumn.tsx)
// ─────────────────────────────────────────────────────────────

interface BoardColumnProps {
    column: Column;
    onAddCard: (columnId: string) => void;
    onOpenCard: (card: Card) => void;
    activeCardId: string | null;
    dropTarget: { columnId: string; index: number } | null;
    onDragStartCard: (e: React.DragEvent, cardId: string) => void;
    onDragEndCard: (e: React.DragEvent) => void;
    onDragOverColumn: (e: React.DragEvent) => void;
    onDragOverCard: (e: React.DragEvent, index: number) => void;
    onDrop: (e: React.DragEvent) => void;
}

function BoardColumn({
    column,
    onAddCard,
    onOpenCard,
    activeCardId,
    dropTarget,
    onDragStartCard,
    onDragEndCard,
    onDragOverColumn,
    onDragOverCard,
    onDrop
}: BoardColumnProps) {
    const { state, dispatch, visibleCardIds } = useBoard();
    const [renaming, setRenaming] = useState(false);
    const [draftTitle, setDraftTitle] = useState(column.title);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const visible = visibleCardIds(column);
    const totalCount = column.cardIds.length;
    const visibleCount = visible.length;
    const filtered = visibleCount !== totalCount;

    const commitRename = () => {
        const t = draftTitle.trim();
        if (t) dispatch({ type: "renameColumn", columnId: column.id, title: t });
        setRenaming(false);
    };

    const confirmDeleteColumn = () => {
        dispatch({ type: "deleteColumn", columnId: column.id });
        setConfirmDelete(false);
    }

    const isDropTargetColumn = dropTarget?.columnId === column.id;

    return (
        <div
            onDragOver={onDragOverColumn}
            onDrop={onDrop}
            className={cn(
                "flex h-full w-[320px] shrink-0 flex-col rounded-2xl border border-border/70 bg-board-column",
                "transition-colors"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-3.5 pt-3 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", labelDot[column.accent])} />
                    {renaming ? (
                        <Input
                            autoFocus
                            value={draftTitle}
                            onChange={setDraftTitle}
                            variant="clean"
                            placeholder="Column title"
                            onBlur={commitRename}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter") commitRename();
                                if (e.key === "Escape") {
                                    setDraftTitle(column.title);
                                    setRenaming(false);
                                }
                            }}
                            className="h-7 px-2 py-1 text-sm font-display font-semibold"
                        />
                    ) : (
                        <button
                            onDoubleClick={() => setRenaming(true)}
                            className="font-display font-semibold text-[14px] tracking-tight truncate"
                            title="Double-click to rename"
                        >
                            {column.title}
                        </button>
                    )}
                    <span
                        className={cn(
                            "inline-flex items-center justify-center rounded-md px-1.5 h-5 min-w-[22px] text-[11px] font-semibold",
                            "bg-muted text-muted-foreground tabular-nums"
                        )}
                    >
                        {filtered ? `${visibleCount}/${totalCount}` : totalCount}
                    </span>
                </div>
                <Dropdown
                    trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    }
                    align="end"
                    className="w-44"
                >
                    <DropdownItem onClick={() => setRenaming(true)}>
                        <Pencil className="h-4 w-4 mr-2" /> Rename
                    </DropdownItem>
                    <DropdownItem
                        onClick={() => dispatch({ type: "clearColumn", columnId: column.id })}
                        disabled={totalCount === 0}
                    >
                        <Eraser className="h-4 w-4 mr-2" /> Clear cards
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                        onClick={() => setConfirmDelete(true)}
                        className="text-destructive focus:text-destructive"
                        disabled={state.columns.length <= 1}
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete column
                    </DropdownItem>
                </Dropdown>
            </div>

            {/* Cards */}
            <div
                className={cn(
                    "flex-1 min-h-0 overflow-y-auto scrollbar-thin px-2.5 pb-2 space-y-2",
                    "transition-colors rounded-xl",
                    isDropTargetColumn && "bg-primary/5 ring-1 ring-inset ring-primary/30"
                )}
            >
                {visible.map((id, index) => {
                    const card = state.cards[id];
                    if (!card) return null;

                    const showIndicatorBefore = isDropTargetColumn && dropTarget.index === index;

                    return (
                        <React.Fragment key={id}>
                            {showIndicatorBefore && (
                                <div className="h-1 bg-primary rounded-full w-full my-1 animate-in fade-in" />
                            )}
                            <BoardCard
                                card={card}
                                onOpen={onOpenCard}
                                isDragging={activeCardId === id}
                                onDragStart={(e: any) => onDragStartCard(e, id)}
                                onDragEnd={onDragEndCard}
                                onDragOver={(e: any) => onDragOverCard(e, index)}
                            />
                        </React.Fragment>
                    );
                })}

                {isDropTargetColumn && dropTarget.index === visible.length && (
                    <div className="h-1 bg-primary rounded-full w-full my-1 animate-in fade-in" />
                )}

                {visible.length === 0 && (
                    <div className="px-2 py-8 text-center text-[12.5px] text-muted-foreground/80">
                        {filtered ? (
                            <>No cards match your filters.</>
                        ) : (
                            <>
                                <div className="font-medium text-foreground/70">Nothing here yet</div>
                                <div className="mt-0.5">Add a card to get started.</div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer add-card */}
            <div className="p-2 pt-1">
                <Button
                    variant="ghost"
                    onClick={() => onAddCard(column.id)}
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium"
                >
                    <Plus className="h-4 w-4 mr-1.5" /> Add card
                </Button>
            </div>

            <Modal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                title={`Delete "${column.title}"?`}
                colorScheme="destructive"
                confirmText="Delete Column"
                onConfirm={confirmDeleteColumn}
                cancelText="Cancel"
                showFooter={true}
            >
                <p className="text-sm">
                    This will permanently remove the column and all its cards.
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: AddColumnComposer (AddColumnComposer.tsx)
// ─────────────────────────────────────────────────────────────

function AddColumnComposer() {
    const { dispatch } = useBoard();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [accent, setAccent] = useState<LabelColor>("rose");

    const submit = () => {
        const t = title.trim();
        if (!t) return;
        dispatch({ type: "addColumn", title: t, accent });
        setTitle("");
        setAccent("rose");
        setOpen(false);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className={cn(
                    "flex h-12 w-[320px] shrink-0 items-center justify-center gap-2 rounded-2xl",
                    "border border-dashed border-border/80 text-muted-foreground",
                    "hover:border-primary/50 hover:text-foreground hover:bg-card transition-colors"
                )}
            >
                <Plus className="h-4 w-4" />
                <span className="font-medium text-sm">Add column</span>
            </button>
        );
    }

    return (
        <div className="flex h-fit w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-border bg-board-column p-3 shadow-card">
            <div className="flex items-center justify-between">
                <div className="text-sm font-display font-semibold">New column</div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setOpen(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <Input
                autoFocus
                placeholder="Column title"
                value={title}
                onChange={setTitle}
                variant="clean"
                onKeyDown={(e: any) => {
                    if (e.key === "Enter") submit();
                    if (e.key === "Escape") setOpen(false);
                }}
            />
            <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Accent
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {LABEL_COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setAccent(c)}
                            className={cn(
                                "h-6 w-6 rounded-full transition-transform",
                                labelDot[c],
                                accent === c
                                    ? "ring-2 ring-offset-2 ring-offset-board-column ring-foreground/60 scale-110"
                                    : "hover:scale-110"
                            )}
                            aria-label={c}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-2">
                <Button onClick={submit} className="flex-1" disabled={!title.trim()}>
                    Add column
                </Button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// PAGE: KanbanBoard (Index.tsx — BoardInner + default export)
// ─────────────────────────────────────────────────────────────

const PRIORITIES_FILTER: Priority[] = ["urgent", "high", "medium", "low"];

function BoardInner() {
    const { state, dispatch, visibleCardIds } = useBoard();
    const toast = useToast();

    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<{ columnId: string; index: number } | null>(null);
    const [modal, setModal] = useState<
        | { open: false }
        | { open: true; mode: "create"; columnId: string }
        | { open: true; mode: "edit"; card: Card }
    >({ open: false });

    const totalCards = useMemo(() => Object.keys(state.cards).length, [state.cards]);

    const handleDragStart = (e: React.DragEvent, cardId: string) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ cardId }));
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => setActiveCardId(cardId), 0);
    };

    const handleDragEnd = (_e: React.DragEvent) => {
        setActiveCardId(null);
        setDropTarget(null);
    };

    const handleDragOverColumn = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        const col = state.columns.find(c => c.id === columnId);
        if (!col) return;

        const visibleCount = visibleCardIds(col).length;
        setDropTarget({ columnId, index: visibleCount });
    };

    const handleDragOverCard = (e: React.DragEvent, columnId: string, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const isTopHalf = e.clientY < rect.top + rect.height / 2;
        setDropTarget({
            columnId,
            index: isTopHalf ? index : index + 1
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const target = dropTarget;
        setActiveCardId(null);
        setDropTarget(null);

        const dataStr = e.dataTransfer.getData("application/json");
        if (!dataStr || !target) return;

        try {
            const { cardId } = JSON.parse(dataStr);
            if (cardId) {
                dispatch({
                    type: "moveCard",
                    cardId,
                    toColumnId: target.columnId,
                    toIndex: target.index
                });
            }
        } catch (err) {
            toast.error("Failed to move card: invalid data format");
        }
    };

    const closeModal = () => setModal({ open: false });

    return (
        <div className="flex h-screen flex-col bg-gradient-board">
            {/* Top bar */}
            <header className="flex flex-wrap items-center gap-3 px-5 lg:px-8 py-4 border-b border-border/60 bg-background/70 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-2.5 mr-2">
                    <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shadow-card">
                        <LayoutGrid
                            className="h-4.5 w-4.5 text-primary-foreground"
                            strokeWidth={2.5}
                        />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-display font-bold text-[17px] leading-tight tracking-tight">
                            Kanban Board
                        </h1>
                        <p className="text-[11.5px] text-muted-foreground -mt-0.5">
                            {state.columns.length} columns · {totalCards} cards
                        </p>
                    </div>
                </div>

                <div className="flex-1 min-w-[200px]" />

                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={state.search}
                        onChange={(v: string) => dispatch({ type: "setSearch", value: v })}
                        placeholder="Search cards…"
                        variant="clean"
                        className="pl-8 pr-8 h-9 w-[240px]"
                    />
                    {state.search && (
                        <button
                            onClick={() => dispatch({ type: "setSearch", value: "" })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <Dropdown
                    trigger={
                        <Button variant="outline" size="sm" className="h-9 gap-1.5">
                            <Filter className="h-4 w-4" />
                            {state.priorityFilter === "all"
                                ? "Priority"
                                : priorityMeta[state.priorityFilter].label}
                        </Button>
                    }
                    align="end"
                    className="w-44"
                >
                    <DropdownLabel>Filter by priority</DropdownLabel>
                    <DropdownSeparator />
                    <DropdownCheckboxItem
                        checked={state.priorityFilter === "all"}
                        onCheckedChange={() =>
                            dispatch({ type: "setPriorityFilter", value: "all" })
                        }
                    >
                        All priorities
                    </DropdownCheckboxItem>
                    {PRIORITIES_FILTER.map((p) => (
                        <DropdownCheckboxItem
                            key={p}
                            checked={state.priorityFilter === p}
                            onCheckedChange={() =>
                                dispatch({ type: "setPriorityFilter", value: p })
                            }
                        >
                            <span className={cn("h-2 w-2 rounded-full mr-2", priorityMeta[p].bar)} />
                            {priorityMeta[p].label}
                        </DropdownCheckboxItem>
                    ))}
                </Dropdown>
            </header>

            {/* Board */}
            <main className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden scrollbar-thin">
                <div className="flex h-full items-start gap-4 px-5 lg:px-8 py-5 min-w-max">
                    {state.columns.map((column) => (
                        <BoardColumn
                            key={column.id}
                            column={column}
                            onAddCard={(columnId) =>
                                setModal({ open: true, mode: "create", columnId })
                            }
                            onOpenCard={(card) => setModal({ open: true, mode: "edit", card })}
                            activeCardId={activeCardId}
                            dropTarget={dropTarget}
                            onDragStartCard={handleDragStart}
                            onDragEndCard={handleDragEnd}
                            onDragOverColumn={(e: any) => handleDragOverColumn(e, column.id)}
                            onDragOverCard={(e, index) => handleDragOverCard(e, column.id, index)}
                            onDrop={handleDrop}
                        />
                    ))}
                    <AddColumnComposer />
                </div>
            </main>

            <CardModal
                open={modal.open}
                onOpenChange={(v) => (v ? null : closeModal())}
                mode={modal.open ? modal.mode : "create"}
                columnId={modal.open && modal.mode === "create" ? modal.columnId : undefined}
                card={modal.open && modal.mode === "edit" ? modal.card : undefined}
            />
        </div>
    );
}

const KanbanBoard = () => (
    <ToastProvider>
        <BoardProvider>
            <BoardInner />
        </BoardProvider>
    </ToastProvider>
);

export default KanbanBoard;