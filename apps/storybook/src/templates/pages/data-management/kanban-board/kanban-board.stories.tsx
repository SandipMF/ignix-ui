import type { Meta, StoryObj } from "@storybook/react-vite";
import { KanbanBoard, BoardSkeleton } from ".";

const meta: Meta<typeof KanbanBoard> = {
    title: "Templates/Pages/DataManagement/Kanban Board",
    component: KanbanBoard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: "A premium, fully interactive Kanban board template with native drag-and-drop support, real-time filtering, and sleek UI components.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
    render: () => (
        <div className="h-screen w-full bg-background overflow-hidden">
            <KanbanBoard />
        </div>
    ),
    name: "Standard Kanban Board",
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark h-screen w-full bg-gray-950 overflow-hidden">
            <KanbanBoard />
        </div>
    ),

    parameters: {
        backgrounds: { default: 'dark' },
    },
    name: "Dark Mode Board",
};

export const SkeletonLoading: Story = {
    render: () => (
        <div className="h-screen w-full bg-background overflow-hidden">
            <BoardSkeleton />
        </div>
    ),
    name: "Skeleton Loading State",
    parameters: {
        docs: {
            description: {
                story: "Animated pulse placeholder shown during the initial hydration tick before cards render. Prevents blank flash on first load.",
            },
        },
    },
};

export const SkeletonLoadingDark: Story = {
    render: () => (
        <div className="dark h-screen w-full bg-gray-950 overflow-hidden">
            <BoardSkeleton />
        </div>
    ),
    name: "Skeleton Loading State (Dark)",
    parameters: {
        backgrounds: { default: "dark" },
        docs: {
            description: {
                story: "Dark mode variant of the skeleton loading state.",
            },
        },
    },
};