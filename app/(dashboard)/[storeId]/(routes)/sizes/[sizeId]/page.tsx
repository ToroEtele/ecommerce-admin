import prismadb from "@/lib/prismadb";

import { SizeForm } from "./components/size-form";

const SizePage = async ({
  params,
}: {
  params: { sizeId: string; storeId: string };
}) => {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
    include: {
      subcategories: true,
    },
  });
  const subcategories = await prismadb.subcategory.findMany({
    where: {
      category: {
        storeId: params.storeId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} subcategories={subcategories} />
      </div>
    </div>
  );
};

export default SizePage;
