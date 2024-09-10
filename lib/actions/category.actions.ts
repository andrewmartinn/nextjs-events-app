"use server";

import { connectToDb } from "../database";

import Category from "../database/models/category.model";

import { handleError } from "../utils";
import { CreateCategoryParams } from "../definitions";

// CREATE CATEGORY
export const createCategory = async (category: CreateCategoryParams) => {
  try {
    await connectToDb();

    const newCategory = await Category.create({ name: category.name });

    if (!newCategory) {
      throw new Error("SERVER ERROR: Failed to create category");
    }

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async () => {
  try {
    await connectToDb();

    const categories = await Category.find({});

    if (!categories) {
      throw new Error("SERVER ERROR: Failed to fetch all categories");
    }

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
