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

    const { name, value_hu, value_ro, subcategories } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value_hu) {
      return new NextResponse("Value (hu) is required", { status: 400 });
    }

    if (!value_ro) {
      return new NextResponse("Value (ro) is required", { status: 400 });
    }

    if (!subcategories) {
      return new NextResponse("Subcategory is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const size = await prismadb.size.create({
      data: {
        name,
        value_hu,
        value_ro,
        storeId: params.storeId,
        subcategories: {
          connect: subcategories.map((s: { value: string; label: string }) => ({
            id: s.value,
          })),
        },
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const subcategoryId = searchParams.get("subcategoryId") || undefined;

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
        subcategories: {
          some: {
            id: subcategoryId,
            category: {
              id: categoryId,
            },
          },
        },
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
