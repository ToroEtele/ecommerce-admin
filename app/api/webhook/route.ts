import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  console.log("event.type", event.type);
  console.log("session", session);

  if (event.type === "checkout.session.completed") {
    console.log("Payment was successful: ", session?.metadata?.orderId);
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        isCanceled: false,
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map((orderItem) => ({
      id: orderItem.productId,
      qty: orderItem.quantity,
    }));

    productIds.map(async (productId) => {
      await prismadb.product.update({
        where: {
          id: productId.id,
        },
        data: {
          quantity: {
            decrement: productId.qty,
          },
        },
      });
    });

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds.map((productId) => productId.id)],
        },
        quantity: {
          equals: 0,
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
