"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: string;
  totalPrice: string;
  products: string;
  createdAt: string;
  isCanceled: string;
  isDelivered: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "isDelivered",
    header: "Delivered",
  },
  {
    accessorKey: "isCanceled",
    header: "Canceled",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
