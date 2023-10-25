import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { verifyCheckoutData } from "@/lib/utils";

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
  const { products: productsOrdered, lng, checkoutData } = await req.json();
  const {
    name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    isCompany,
    cmp_name,
    cmp_city,
    cmp_cui,
    cmp_address,
    cmp_state,
    cmp_bank,
    cmp_cont,
  } = checkoutData;

  verifyCheckoutData(checkoutData);

  if (!productsOrdered || productsOrdered.length === 0)
    return new NextResponse("Product ids are required", { status: 400 });

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productsOrdered.map((p: { id: string; qty: never }) => p.id),
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    const quantity = productsOrdered.find(
      (p: { id: string; qty: never }) => p.id === product.id
    ).qty;

    line_items.push({
      quantity,
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
      isCanceled: true,
      phone,
      address,
      city,
      state,
      zipCode: zip,
      email,
      isCompany,
      clientName: name,
      companyName: cmp_name,
      companyCity: cmp_city,
      companyCUI: cmp_cui,
      companyAddress: cmp_address,
      companyState: cmp_state,
      companyBank: cmp_bank,
      companyIBAN: cmp_cont,
      orderItems: {
        create: productsOrdered.map((product: { id: string; qty: number }) => ({
          product: {
            connect: {
              id: product.id,
            },
          },
          quantity: product.qty,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    // billing_address_collection: "auto",
    // phone_number_collection: {
    //   enabled: true,
    // },
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
