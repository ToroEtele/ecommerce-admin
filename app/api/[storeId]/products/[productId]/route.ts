import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        subcategory: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name_hu,
      name_ro,
      price,
      description_hu,
      description_ro,
      quantity,
      subcategoryId,
      images,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      isNew,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
    if (!params.productId)
      return new NextResponse("Product id is required", { status: 400 });
    if (!name_hu) return new NextResponse("Name is required", { status: 400 });
    if (!name_ro) return new NextResponse("Name is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("Images are required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (quantity === undefined || quantity === null)
      return new NextResponse("Quantity is required", { status: 400 });
    if (!subcategoryId)
      return new NextResponse("Category id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size id is required", { status: 400 });
    if (!description_hu)
      return new NextResponse("Description is required", { status: 400 });
    if (!description_ro)
      return new NextResponse("Description is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name_hu,
        description_hu,
        name_ro,
        description_ro,
        price,
        quantity,
        subcategoryId,
        colorId,
        sizeId,
        isNew,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
