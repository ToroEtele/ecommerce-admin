import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

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
  const body = await req.json();

  const { products, lng, checkoutData } = body;
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

  if (!name) return new NextResponse("Name is required", { status: 400 });
  if (!email) return new NextResponse("Email is required", { status: 400 });
  if (!phone) return new NextResponse("Phone is required", { status: 400 });
  if (!address) return new NextResponse("Address is required", { status: 400 });
  if (!city) return new NextResponse("City is required", { status: 400 });
  if (!state) return new NextResponse("State is required", { status: 400 });
  if (!zip) return new NextResponse("Zip is required", { status: 400 });
  if (isCompany) {
    if (!cmp_name)
      return new NextResponse("Company name is required", { status: 400 });
    if (!cmp_city)
      return new NextResponse("Company city is required", { status: 400 });
    if (!cmp_cui)
      return new NextResponse("Company cui is required", { status: 400 });
    if (!cmp_address)
      return new NextResponse("Company address is required", { status: 400 });
    if (!cmp_state)
      return new NextResponse("Company state is required", { status: 400 });
    if (!cmp_bank)
      return new NextResponse("Company bank is required", { status: 400 });
    if (!cmp_cont)
      return new NextResponse("Company contact is required", { status: 400 });
  }

  if (!products || products.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      phone,
      address: `${state}, ${city}, ${address}`,
      orderItems: {
        create: products.map((product: { id: string; qty: number }) => ({
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

  products.map(async (product: { id: string; qty: number }) => {
    await prismadb.product.update({
      where: {
        id: product.id,
      },
      data: {
        quantity: {
          decrement: product.qty,
        },
      },
    });
  });

  await prismadb.product.updateMany({
    where: {
      id: {
        in: [...products.map((p: { id: string; qty: number }) => p.id)],
      },
      quantity: {
        equals: 0,
      },
    },
    data: {
      isArchived: true,
    },
  });

  return NextResponse.json(
    { url: process.env.FRONTEND_STORE_URL },
    {
      headers: corsHeaders,
    }
  );
}
