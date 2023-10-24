import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { products: productsOrdered, lng } = await req.json();

  console.log("HELLO");
  if (!productsOrdered || productsOrdered.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  console.log("HELLO");

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productsOrdered.map((p: { id: string; qty: never }) => p.id),
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "RON",
        product_data: {
          name: product.name_hu,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productsOrdered.map((product: { id: string; qty: number }) => ({
          product: {
            connect: {
              id: product.id,
              quantity: product.qty,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/${lng}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/${lng}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
