import type { Meta, StoryObj } from "@storybook/react-vite";
import KanbanBoard from ".";

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
