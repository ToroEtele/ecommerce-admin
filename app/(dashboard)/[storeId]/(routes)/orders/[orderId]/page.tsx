import React from "react";

import prismadb from "@/lib/prismadb";
import OrderDetails from "./components/order-details";
import InvoiceDetails from "./components/invoice-details";
import ItemsOrdered from "./components/items-ordered";
import { Heading } from "@/components/ui/heading";
import { Checkbox } from "@/components/ui/checkbox";

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

        <div className="flex gap-10">
          <Heading
            title={`Total: ${totalPrice} RON`}
            description={description}
          />
          {!order.isCanceled ? (
            <div className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox checked={order.isPaid} className="text-green-500 " />
              <div className="space-y-1 leading-none">
                <h1 className="font-bold">Is Delivered?</h1>
                <p className="text-sm">
                  Check if the order was succesfully delivered
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4 border-red-600/60">
              <div className="space-y-1 leading-none">
                <h1 className="font-bold text-red-600">Canceled!</h1>
                <p className="text-sm">
                  This order was canceled by the customer!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
