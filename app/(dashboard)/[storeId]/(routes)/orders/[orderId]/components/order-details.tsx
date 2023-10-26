import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./order-detail-columns";
import React from "react";
import { Order } from "@prisma/client";

const OrderDetails = ({ order }: { order: Order }) => {
  const processedShippingData = {
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    createdAt: order.createdAt.toDateString(),
  };
  return (
    <div className="mb-5">
      <Heading title={`Shipping details`} description="" />
      <Separator className="mt-5" />
      <DataTable columns={columns} data={[processedShippingData]} />
    </div>
  );
};

export default OrderDetails;
