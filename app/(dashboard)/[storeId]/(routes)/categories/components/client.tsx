"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiAlert } from "@/components/ui/api-alert";

import { columns, CategoryColumn } from "./columns";
import {
  columns as subcategoryColum,
  SubcategoryColumn,
} from "../../subcategories/components/columns";

import { ApiList } from "@/components/ui/api-list";

interface CategoriesClientProps {
  categoryData: CategoryColumn[];
  subcategoryData: SubcategoryColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
  subcategoryData,
  categoryData,
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      {/* Categories */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categoryData.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={categoryData} />
      {/* Subcategories */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Subcategories (${subcategoryData.length})`}
          description="Manage subcategories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/subcategories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={subcategoryColum}
        data={subcategoryData}
      />
      {/* API endpoints */}
      <Heading title="API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
