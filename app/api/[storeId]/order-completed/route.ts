import prismadb from "@/lib/prismadb";
import { verifyCheckoutData } from "@/lib/utils";
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

  verifyCheckoutData(checkoutData);
  if (!products || products.length === 0)
    return new NextResponse("Product ids are required", { status: 400 });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      phone,
      clientName: name,
      address,
      city,
      state,
      zipCode: zip,
      email,
      isCompany,
      companyName: cmp_name,
      companyCity: cmp_city,
      companyCUI: cmp_cui,
      companyAddress: cmp_address,
      companyState: cmp_state,
      companyBank: cmp_bank,
      companyIBAN: cmp_cont,
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
