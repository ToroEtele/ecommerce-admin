import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./invoice-detail-columns";
import React from "react";
import { Order } from "@prisma/client";

const InvoiceDetails = ({ order }: { order: Order }) => {
  const processedInvoiceData = {
    companyName: order.companyName,
    companyIBAN: order.companyIBAN,
    companyBank: order.companyBank,
    address: order.companyAddress,
    city: order.companyCity,
    state: order.companyState,
  };
  return (
    <div className="mb-5">
      <Heading title={`Invoicing details`} description="" />
      <Separator className="mt-5" />
      <DataTable columns={columns} data={[processedInvoiceData]} />
    </div>
  );
};

export default InvoiceDetails;
