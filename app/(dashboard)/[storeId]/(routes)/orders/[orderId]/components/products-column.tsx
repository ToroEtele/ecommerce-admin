"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ItemsColumn = {
  name: string;
  price: string;
  quantity: string;
};

export const columns: ColumnDef<ItemsColumn>[] = [
  {
    accessorKey: "name",
    header: "Product name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];
