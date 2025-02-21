import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/categoryApi";
import type { Category as CategoryType } from "@/types/category";
import CategoryForm from "@/components/CategoryForm";
import { Pencil, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
import DeleteConfirmationModal from "@/components/ConfirmationModal";

export default function Category() {
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(
    null
  );

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleCreateCategory = async (name: string) => {
    try {
      await createCategory({ data: { name } }).unwrap();
      toast.success("Category created successfully");
      setIsCreating(false);
      refetch();
    } catch {
      toast.error("Failed to create category. Please try again.");
    }
  };

  const handleUpdateCategory = async (name: string) => {
    if (!editingCategory) return;
    try {
      await updateCategory({
        id: editingCategory.documentId,
        data: { name },
      }).unwrap();
      toast.success("Category updated successfully");
      setEditingCategory(null);
      refetch();
    } catch {
      toast.error("Failed to update category. Please try again.");
    }
  };

  const openDeleteModal = (category: CategoryType) => {
    setCategoryToDelete(category);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.documentId).unwrap();
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
      refetch();
    } catch {
      toast.error("Failed to delete category. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Error: {error.toString()}</span>
        </div>
      </div>
    );
  }

  if (isCreating || editingCategory) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isCreating ? "Create New Category" : "Edit Category"}
          </h1>
        </div>

        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={isCreating ? handleCreateCategory : handleUpdateCategory}
          onCancel={() => {
            setIsCreating(false);
            setEditingCategory(null);
          }}
          isSubmitting={isCreatingCategory || isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        {!isCreatingCategory && !editingCategory && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </button>
        )}
      </div>

      {categoriesData?.data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900">
            No categories yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new category
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {categoriesData?.data.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group"
            >
              <span className="text-sm font-medium text-gray-900">
                {category.name}
              </span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="sr-only">Edit category</span>
                </button>
                <button
                  onClick={() => openDeleteModal(category)}
                  disabled={isDeleting}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="sr-only">Delete category</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
