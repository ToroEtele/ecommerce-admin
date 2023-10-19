"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type SubcategoryColumn = {
  id: string;
  name_hu: string;
  name_ro: string;
  billboardLabel: string;
  categoryLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<SubcategoryColumn>[] = [
  {
    accessorKey: "name_hu",
    header: "Name (hu)",
  },
  {
    accessorKey: "name_ro",
    header: "Name (ro)",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.categoryLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
