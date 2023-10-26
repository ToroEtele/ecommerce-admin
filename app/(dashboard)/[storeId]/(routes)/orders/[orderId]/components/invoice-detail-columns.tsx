"use client";

import { ColumnDef } from "@tanstack/react-table";

export type InvoiceColumn = {
  companyName: string;
  companyIBAN: string;
  companyBank: string;
  address: string;
  city: string;
  state: string;
};

export const columns: ColumnDef<InvoiceColumn>[] = [
  {
    accessorKey: "companyName",
    header: "Company name",
  },
  {
    accessorKey: "companyIBAN",
    header: "IBAN",
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
];
