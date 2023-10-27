import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { isDelivered } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
    if (isDelivered === null || isDelivered === undefined)
      return new NextResponse("Delivery state is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const order = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        isDelivered,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
