"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumn = {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "email",
    header: "Email",
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
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
