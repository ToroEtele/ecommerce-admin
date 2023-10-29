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

    const {
      name_hu,
      name_ro,
      description_hu,
      description_ro,
      quantity,
      price,
      subcategoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
      isNew,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
    if (!name_hu) return new NextResponse("Name is required", { status: 400 });
    if (!name_ro) return new NextResponse("Name is required", { status: 400 });
    if (!quantity)
      return new NextResponse("Quantity is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("Image is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!subcategoryId)
      return new NextResponse("Category id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size id is required", { status: 400 });
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 405 });

    const product = await prismadb.product.create({
      data: {
        name_hu,
        name_ro,
        price,
        description_hu,
        description_ro,
        quantity,
        isFeatured,
        isArchived,
        isNew,
        subcategoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const subcategoryId = searchParams.get("subcategoryId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isNew = searchParams.get("isNew") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        subcategoryId,
        subcategory: {
          categoryId,
        },
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        isNew: isNew ? true : undefined,
      },
      include: {
        images: true,
        subcategory: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
