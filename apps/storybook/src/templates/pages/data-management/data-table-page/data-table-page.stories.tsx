/**
 * @file data-table-page.stories.tsx
 * @description Storybook stories for the DataTablePage template.
 * Demonstrates sorting (↑/↓), filtering, column visibility, pagination,
 * row selection with bulk actions (delete/export), row actions, striped rows,
 * and responsive horizontal scrolling on mobile.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTablePage, type DataTableRowModel } from "./index";

/**
 * Storybook metadata configuration for DataTablePage.
 */
const meta: Meta<typeof DataTablePage> = {
  title: "Templates/Pages/Data Management/Data Table Page",
  component: DataTablePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Data table page template with search/filter bar, sortable columns with visible indicators (↑/↓), column visibility toggles, pagination, row selection with bulk actions (delete/export), row actions menu, striped rows, and responsive horizontal scrolling on mobile.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Page title",
    },
    defaultRowsPerPage: {
      control: { type: "number", min: 1, max: 20 },
      description: "Default rows per page",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DataTablePage>;

const SAMPLE_ROWS: DataTableRowModel[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    department: "Engineering",
    role: "Admin",
    status: "Active",
    createdAt: "2025-12-12T09:12:00.000Z",
  },
  {
    id: "2",
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    department: "Product",
    role: "Editor",
    status: "Invited",
    createdAt: "2026-01-03T14:05:00.000Z",
  },
  {
    id: "3",
    name: "Liam Chen",
    email: "liam.chen@example.com",
    department: "Design",
    role: "Viewer",
    status: "Active",
    createdAt: "2026-01-20T11:40:00.000Z",
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    department: "Sales",
    role: "Editor",
    status: "Suspended",
    createdAt: "2025-11-18T16:22:00.000Z",
  },
  {
    id: "5",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    department: "Support",
    role: "Viewer",
    status: "Active",
    createdAt: "2026-02-01T08:10:00.000Z",
  },
  {
    id: "6",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    department: "Engineering",
    role: "Editor",
    status: "Invited",
    createdAt: "2026-02-10T10:30:00.000Z",
  },
  {
    id: "7",
    name: "Ethan Davis",
    email: "ethan.davis@example.com",
    department: "Product",
    role: "Viewer",
    status: "Active",
    createdAt: "2026-02-22T13:55:00.000Z",
  },
  {
    id: "8",
    name: "Mia Wilson",
    email: "mia.wilson@example.com",
    department: "Design",
    role: "Admin",
    status: "Active",
    createdAt: "2026-03-05T12:00:00.000Z",
  },
];

/**
 * Default story with 8 sample rows (5–10 requirement met).
 */
export const Default: Story = {
  args: {
    initialRows: SAMPLE_ROWS,
    title: "Data Table Page",
    defaultRowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
  },
  render: (args) => <DataTablePage {...args} />,
};

/**
 * Mobile story to validate responsive horizontal scroll.
 */
export const Mobile: Story = {
  args: {
    initialRows: SAMPLE_ROWS,
    title: "Data Table Page (Mobile)",
    defaultRowsPerPage: 5,
    rowsPerPageOptions: [5, 10],
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    layout: "fullscreen",
  },
  render: (args) => <DataTablePage {...args} />,
};

