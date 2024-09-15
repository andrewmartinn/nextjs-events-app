"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const router = useRouter();

  // access search params from URL
  const searchParams = useSearchParams();

  // fetch all categories on component mount
  useEffect(() => {
    const fetchAllCategories = async () => {
      const categoryList: ICategory[] = await getAllCategories();
      categoryList && setCategories(categoryList);
    };

    fetchAllCategories();
  }, []);

  const onSelectCategory = (category: string) => {
    let newUrl = "";

    if (category && category !== "All") {
      // construct new url string with selected category
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      // clear category keys from url
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="category-select">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">
          All
        </SelectItem>
        {categories &&
          categories.map((item) => (
            <SelectItem
              value={item.name}
              key={item._id}
              className="select-item p-regular-14"
            >
              {item.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
