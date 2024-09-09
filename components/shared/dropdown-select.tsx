"use client";

import { startTransition, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";

type DropdownSelectProps = {
  value?: string;
  onChangeHandler?: () => void;
};

export default function DropdownSelect({
  value,
  onChangeHandler,
}: DropdownSelectProps) {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);

  // adds new categories to DB
  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      const newCategoryItem = {
        name: newCategory.trim(),
      };

      createCategory(newCategoryItem)
        .then((category) => {
          setCategories((prevCategories) => [...prevCategories, category]);
        })
        .catch((error) => console.log(error));
    }
  };

  // fetch all categories on component mount
  useEffect(() => {
    const fetchAllCategories = async () => {
      const categoryList: ICategory[] = await getAllCategories();
      categoryList && setCategories(categoryList);
    };

    fetchAllCategories();
  }, []);

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category._id}
              value={category._id}
              className="select-item p-regular-14"
            >
              {category.name}
            </SelectItem>
          ))}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add Category
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category name"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
}
