import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./products-column";
import React from "react";

interface ItemsOrderedProps {
  items: Array<{
    name: string;
    price: string;
    quantity: string;
  }>;
}

const ItemsOrdered = ({ items }: ItemsOrderedProps) => {
  return (
    <div className="mb-5">
      <Heading title={`Items`} description="" />
      <Separator className="mt-5" />
      <DataTable columns={columns} data={items} />
    </div>
  );
};

export default ItemsOrdered;
