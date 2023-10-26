"use client";

import { Copy, Edit, MoreHorizontal, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { OrderColumn } from "./columns";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4" /> Copy Id
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/${params.storeId}/orders/${data.id}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> More Informations
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <Check className="mr-2 h-4 w-4" /> Mark as delivered
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
