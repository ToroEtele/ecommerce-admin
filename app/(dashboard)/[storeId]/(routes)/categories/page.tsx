import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { CategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";
import { SubcategoryColumn } from "../subcategories/components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const subcategories = await prismadb.subcategory.findMany({
    where: {
      category: {
        storeId: params.storeId,
      },
    },
    include: {
      billboard: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name_hu: item.name_hu,
    name_ro: item.name_ro,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  const formattedSubcategories: SubcategoryColumn[] = subcategories.map(
    (item) => ({
      id: item.id,
      name_hu: item.name_hu,
      name_ro: item.name_ro,
      billboardLabel: item.billboard.label,
      categoryLabel: item.category.name_hu,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient
          categoryData={formattedCategories}
          subcategoryData={formattedSubcategories}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
