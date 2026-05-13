/**
 * @fileoverview Detail view page template for data-management workflows: a single record with
 * heading, metadata (dates, status, owner), rich body content, related items, primary actions,
 * back navigation, and previous/next sibling navigation. Visual language aligns with `ListView`
 * (spacing, cards, badges, motion).
 */

import {
    memo,
    useCallback,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    Pencil1Icon,
    PersonIcon,
    Share2Icon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { cn } from "../../../../../utils/cn";
import { Avatar } from "../../../../components/avatar";
import { Button } from "../../../../components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../../components/card";
import { Typography } from "../../../../components/typography";
import type { StatusStyle } from "../list-view-page/index";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export type DetailViewTheme = "light" | "dark";

export interface DetailOwner {
    name: string;
    initials: string;
}

export interface DetailRelatedItem {
    id: string;
    title: string;
    description?: string;
}

export interface DetailViewLabels {
    back?: string;
    previous?: string;
    next?: string;
    relatedHeading?: string;
    edit?: string;
    delete?: string;
    share?: string;
    created?: string;
    updated?: string;
    owner?: string;
    status?: string;
    emptyRelated?: string;
}

export interface DetailViewPageProps {
    /** Page heading shown as primary title. */
    title: string;
    /** Optional eyebrow (e.g. collection name). */
    eyebrow?: string;
    /** Optional secondary line under the title. */
    subtitle?: string;
    /** Primary body — string or rich React content. */
    content: ReactNode;
    /** ISO or human-readable date strings. */
    createdAt?: string;
    updatedAt?: string;
    /** Status label; paired with `statusStyles` for visuals. */
    status?: string;
    owner?: DetailOwner;
    /** Related records shown as a compact list. */
    relatedItems?: DetailRelatedItem[];
    /** Map status label → badge styling (same keys as ListView). */
    statusStyles?: Record<string, StatusStyle>;
    theme?: DetailViewTheme;
    className?: string;
    labels?: DetailViewLabels;
    onBack?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    /** Disables previous control when false. */
    hasPrevious?: boolean;
    /** Disables next control when false. */
    hasNext?: boolean;
    onRelatedItemClick?: (item: DetailRelatedItem) => void;
}

const DEFAULT_LABELS: Required<DetailViewLabels> = {
    back: "Back",
    previous: "Previous",
    next: "Next",
    relatedHeading: "Related items",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    created: "Created",
    updated: "Updated",
    owner: "Owner",
    status: "Status",
    emptyRelated: "No related items yet.",
};

/* ─── Root layout ─────────────────────────────────────────────────────────── */

export interface DetailViewPageRootProps {
    theme?: DetailViewTheme;
    className?: string;
    children: ReactNode;
}

function DetailViewPageRoot({
    theme = "light",
    className,
    children,
}: DetailViewPageRootProps) {
    return (
        <div className={cn(theme === "dark" && "dark", className)}>
            <div className="min-h-full bg-background text-foreground">
                <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
            </div>
        </div>
    );
}

/* ─── Back + sibling navigation ───────────────────────────────────────────── */

export interface DetailViewPageTopNavProps {
    labels: Required<DetailViewLabels>;
    onBack?: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
}

function DetailViewPageTopNav({
    labels,
    onBack,
    onPrevious,
    onNext,
    hasPrevious = true,
    hasNext = true,
}: DetailViewPageTopNavProps) {
    const handlePrev = useCallback(() => {
        if (hasPrevious) onPrevious?.();
    }, [hasPrevious, onPrevious]);

    const handleNext = useCallback(() => {
        if (hasNext) onNext?.();
    }, [hasNext, onNext]);

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
                {onBack && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={onBack}
                    >
                        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
                        {labels.back}
                    </Button>
                )}
            </div>
            {(onPrevious || onNext) && (
                <div className="flex items-center gap-1 sm:ml-auto">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 rounded-lg"
                        disabled={!onPrevious || !hasPrevious}
                        onClick={handlePrev}
                        aria-label={labels.previous}
                    >
                        <ChevronLeftIcon className="h-4 w-4" aria-hidden />
                        <span className="hidden sm:inline">{labels.previous}</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1 rounded-lg"
                        disabled={!onNext || !hasNext}
                        onClick={handleNext}
                        aria-label={labels.next}
                    >
                        <span className="hidden sm:inline">{labels.next}</span>
                        <ChevronRightIcon className="h-4 w-4" aria-hidden />
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ─── Title + actions ─────────────────────────────────────────────────────── */

export interface DetailViewPageHeaderProps {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    labels: Required<DetailViewLabels>;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
}

function DetailViewPageHeader({
    title,
    eyebrow,
    subtitle,
    labels,
    onEdit,
    onDelete,
    onShare,
}: DetailViewPageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
                {eyebrow && (
                    <Typography
                        variant="caption"
                        color="muted"
                        className="mb-1 font-medium uppercase tracking-wider"
                    >
                        {eyebrow}
                    </Typography>
                )}
                <Typography variant="h3" as="h1" className="text-foreground">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="muted" className="mt-1.5 max-w-2xl">
                        {subtitle}
                    </Typography>
                )}
            </div>
            {(onEdit || onDelete || onShare) && (
                <DetailViewPageActions
                    labels={labels}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onShare={onShare}
                    className="shrink-0"
                />
            )}
        </div>
    );
}

export interface DetailViewPageActionsProps {
    labels: Required<DetailViewLabels>;
    onEdit?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    className?: string;
}

function DetailViewPageActions({
    labels,
    onEdit,
    onDelete,
    onShare,
    className,
}: DetailViewPageActionsProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2",
                className
            )}
        >
            {onEdit && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 rounded-lg"
                    onClick={onEdit}
                >
                    <Pencil1Icon className="h-4 w-4" aria-hidden />
                    {labels.edit}
                </Button>
            )}
            {onShare && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 rounded-lg"
                    onClick={onShare}
                >
                    <Share2Icon className="h-4 w-4" aria-hidden />
                    {labels.share}
                </Button>
            )}
            {onDelete && (
                <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="h-9 gap-1.5 rounded-lg"
                    onClick={onDelete}
                >
                    <TrashIcon className="h-4 w-4" aria-hidden />
                    {labels.delete}
                </Button>
            )}
        </div>
    );
}

/* ─── Metadata ────────────────────────────────────────────────────────────── */

const DEFAULT_STATUS_STYLE: StatusStyle = {
    className:
        "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    dotClassName: "bg-muted-foreground/60",
};

export interface DetailViewPageMetadataProps {
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    owner?: DetailOwner;
    statusStyles?: Record<string, StatusStyle>;
    labels: Required<DetailViewLabels>;
}

function DetailViewPageMetadata({
    createdAt,
    updatedAt,
    status,
    owner,
    statusStyles,
    labels,
}: DetailViewPageMetadataProps) {
    const statusVisual = status ? statusStyles?.[status] ?? DEFAULT_STATUS_STYLE : undefined;

    const showMeta =
        createdAt || updatedAt || status || owner;

    if (!showMeta) return null;

    return (
        <Card
            variant="outline"
            interactive="none"
            animation="none"
            className="mb-6 rounded-2xl border-border/70 bg-card shadow-sm"
        >
            <CardHeader variant="compact" className="pb-2">
                <CardTitle size="sm" className="text-sm font-medium text-muted-foreground">
                    Details
                </CardTitle>
            </CardHeader>
            <CardContent variant="compact" className="pt-0">
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {createdAt && (
                        <div className="flex gap-2">
                            <CalendarIcon
                                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {labels.created}
                                </dt>
                                <dd className="text-sm text-foreground">{createdAt}</dd>
                            </div>
                        </div>
                    )}
                    {updatedAt && (
                        <div className="flex gap-2">
                            <ClockIcon
                                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {labels.updated}
                                </dt>
                                <dd className="text-sm text-foreground">{updatedAt}</dd>
                            </div>
                        </div>
                    )}
                    {status && (
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground">
                                {labels.status}
                            </dt>
                            <dd className="mt-1">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                        statusVisual?.className
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            statusVisual?.dotClassName
                                        )}
                                    />
                                    {status}
                                </span>
                            </dd>
                        </div>
                    )}
                    {owner && (
                        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                            <PersonIcon
                                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                            <div className="min-w-0 flex-1">
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {labels.owner}
                                </dt>
                                <dd className="mt-1 flex items-center gap-2">
                                    <Avatar
                                        size="sm"
                                        letters={owner.initials}
                                        backgroundColor="bg-primary/5"
                                    />
                                    <span className="truncate text-sm text-foreground">
                                        {owner.name}
                                    </span>
                                </dd>
                            </div>
                        </div>
                    )}
                </dl>
            </CardContent>
        </Card>
    );
}

/* ─── Body content ─────────────────────────────────────────────────────────── */

export interface DetailViewPageContentProps {
    children: ReactNode;
}

function DetailViewPageContent({ children }: DetailViewPageContentProps) {
    return (
        <Card
            variant="outline"
            interactive="none"
            animation="none"
            className="mb-8 rounded-2xl border-border/70 bg-card shadow-sm"
        >
            <CardContent variant="default" className="text-sm leading-relaxed text-foreground pt-3">
                {typeof children === "string" ? (
                    <Typography variant="body" className="whitespace-pre-wrap">
                        {children}
                    </Typography>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

/* ─── Related list ───────────────────────────────────────────────────────── */

export interface DetailViewRelatedListProps {
    items: DetailRelatedItem[];
    labels: Required<DetailViewLabels>;
    onItemClick?: (item: DetailRelatedItem) => void;
}

interface RelatedRowProps {
    item: DetailRelatedItem;
    onClick?: (item: DetailRelatedItem) => void;
}

const DetailViewRelatedRow = memo(function DetailViewRelatedRow({
    item,
    onClick,
}: RelatedRowProps) {
    const handleClick = useCallback(() => {
        onClick?.(item);
    }, [item, onClick]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLLIElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(item);
            }
        },
        [item, onClick]
    );

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick ? handleClick : undefined}
            onKeyDown={onClick ? handleKeyDown : undefined}
            className={cn(
                "rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm transition-colors",
                onClick &&
                    "cursor-pointer hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
        >
            <p className="font-medium text-foreground">{item.title}</p>
            {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                </p>
            )}
        </motion.li>
    );
});

function DetailViewPageRelatedList({
    items,
    labels,
    onItemClick,
}: DetailViewRelatedListProps) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
                <Typography variant="muted">{labels.emptyRelated}</Typography>
            </div>
        );
    }

    return (
        <section aria-labelledby="detail-related-heading">
            <Typography
                id="detail-related-heading"
                variant="h5"
                as="h2"
                className="mb-3 text-foreground"
            >
                {labels.relatedHeading}
            </Typography>
            <ul className="flex flex-col gap-3 p-0">
                {items.map((item) => (
                    <DetailViewRelatedRow
                        key={item.id}
                        item={item}
                        onClick={onItemClick}
                    />
                ))}
            </ul>
        </section>
    );
}

/* ─── Bottom sibling nav (duplicate for long pages / mobile) ─────────────── */

export interface DetailViewPageBottomNavProps {
    labels: Required<DetailViewLabels>;
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
}

function DetailViewPageBottomNav({
    labels,
    onPrevious,
    onNext,
    hasPrevious = true,
    hasNext = true,
}: DetailViewPageBottomNavProps) {
    if (!onPrevious && !onNext) return null;

    return (
        <div className="mt-10 flex justify-center border-t border-border pt-6">
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1 rounded-lg"
                    disabled={!onPrevious || !hasPrevious}
                    onClick={() => hasPrevious && onPrevious?.()}
                    aria-label={labels.previous}
                >
                    <ChevronLeftIcon className="h-4 w-4" aria-hidden />
                    {labels.previous}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1 rounded-lg"
                    disabled={!onNext || !hasNext}
                    onClick={() => hasNext && onNext?.()}
                    aria-label={labels.next}
                >
                    {labels.next}
                    <ChevronRightIcon className="h-4 w-4" aria-hidden />
                </Button>
            </div>
        </div>
    );
}

/* ─── Composed page ───────────────────────────────────────────────────────── */

function DetailViewPageImpl(props: DetailViewPageProps) {
    const {
        title,
        eyebrow,
        subtitle,
        content,
        createdAt,
        updatedAt,
        status,
        owner,
        relatedItems = [],
        statusStyles,
        theme = "light",
        className,
        labels: labelsProp,
        onBack,
        onEdit,
        onDelete,
        onShare,
        onPrevious,
        onNext,
        hasPrevious = true,
        hasNext = true,
        onRelatedItemClick,
    } = props;

    const labels = { ...DEFAULT_LABELS, ...labelsProp };

    const handleRelatedItem = useCallback(
        (item: DetailRelatedItem) => {
            onRelatedItemClick?.(item);
        },
        [onRelatedItemClick]
    );

    return (
        <DetailViewPageRoot theme={theme} className={className}>
            <DetailViewPageTopNav
                labels={labels}
                onBack={onBack}
                onPrevious={onPrevious}
                onNext={onNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
            />

            <DetailViewPageHeader
                title={title}
                eyebrow={eyebrow}
                subtitle={subtitle}
                labels={labels}
                onEdit={onEdit}
                onDelete={onDelete}
                onShare={onShare}
            />

            <DetailViewPageMetadata
                createdAt={createdAt}
                updatedAt={updatedAt}
                status={status}
                owner={owner}
                statusStyles={statusStyles}
                labels={labels}
            />

            <DetailViewPageContent>{content}</DetailViewPageContent>

            <DetailViewPageRelatedList
                items={relatedItems}
                labels={labels}
                onItemClick={handleRelatedItem}
            />

            <DetailViewPageBottomNav
                labels={labels}
                onPrevious={onPrevious}
                onNext={onNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
            />
        </DetailViewPageRoot>
    );
}

type DetailViewPageCompound = typeof DetailViewPageImpl & {
    Root: typeof DetailViewPageRoot;
    TopNav: typeof DetailViewPageTopNav;
    Header: typeof DetailViewPageHeader;
    Actions: typeof DetailViewPageActions;
    Metadata: typeof DetailViewPageMetadata;
    Content: typeof DetailViewPageContent;
    RelatedList: typeof DetailViewPageRelatedList;
    BottomNav: typeof DetailViewPageBottomNav;
};

/**
 * Full-page detail layout with compound subcomponents on the same namespace
 * (`DetailViewPage.Root`, `DetailViewPage.Header`, …) for custom compositions.
 */
export const DetailViewPage: DetailViewPageCompound = Object.assign(
    DetailViewPageImpl,
    {
        Root: DetailViewPageRoot,
        TopNav: DetailViewPageTopNav,
        Header: DetailViewPageHeader,
        Actions: DetailViewPageActions,
        Metadata: DetailViewPageMetadata,
        Content: DetailViewPageContent,
        RelatedList: DetailViewPageRelatedList,
        BottomNav: DetailViewPageBottomNav,
    }
);
