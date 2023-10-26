import React from "react";

import prismadb from "@/lib/prismadb";
import OrderDetails from "./components/order-details";
import InvoiceDetails from "./components/invoice-details";
import ItemsOrdered from "./components/items-ordered";
import { Heading } from "@/components/ui/heading";

interface OrderPageProps {
  params: {
    orderId: string;
    storeId: string;
  };
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (order == null) return <div>Order not found</div>;

  const items = order.orderItems.map((item) => ({
    name: item.product.name_hu,
    price: item.product.price.toString(),
    quantity: item.quantity.toString(),
  }));

  const description = order.isPaid
    ? "The order was paid with card"
    : order.isCanceled
    ? "The will be paid at shipping"
    : "The order was canceled";
  const totalPrice = order.orderItems.reduce((total, item) => {
    return total + Number(item.product.price);
  }, 0);

  return (
    <div className="py-[3%] px-[5%] flex flex-col items-center">
      <h1
        className={`text-2xl font-extrabold ${
          order.isCanceled && "text-red-600"
        }`}
      >
        Order number: {params.orderId}
      </h1>
      <div className="w-full mt-[5%]">
        <OrderDetails order={order} />
        {order.isCompany && <InvoiceDetails order={order} />}
        <ItemsOrdered items={items} />

        <Heading title={`Total: ${totalPrice} RON`} description={description} />
      </div>
    </div>
  );
};

export default OrderPage;
