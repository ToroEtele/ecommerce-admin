import prismadb from "@/lib/prismadb";

import { SubategoryForm } from "./components/subcategory-form";

const SubcategoryPage = async ({
  params,
}: {
  params: { subcategoryId: string; storeId: string };
}) => {
  const subcategory = await prismadb.subcategory.findUnique({
    where: {
      id: params.subcategoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubategoryForm
          billboards={billboards}
          initialData={subcategory}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default SubcategoryPage;
