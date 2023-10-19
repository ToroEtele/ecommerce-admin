import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { SubcategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";

const SubcategoriesPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
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
        <CategoriesClient data={formattedSubcategories} />
      </div>
    </div>
  );
};

export default SubcategoriesPage;
