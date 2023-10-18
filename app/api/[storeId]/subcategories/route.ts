import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId, categoryId } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });

    // const storeByUserId = await prismadb.store.findFirst({
    //   where: {
    //     id: params.storeId,
    //     userId,
    //   },
    // });
    // if (!storeByUserId)
    //   return new NextResponse("Unauthorized", { status: 405 });

    const subcategory = await prismadb.subcategory.create({
      data: {
        name,
        billboardId,
        categoryId,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.log("[SUBCATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const subcategories = await prismadb.subcategory.findMany({
      where: {
        category: {
          id: categoryId,
          storeId: params.storeId,
        },
      },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.log("[SUBCATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
