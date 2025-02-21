import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from "@/services/articleApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { selectCurrentUser } from "@/store/modules/authSlice";
import { Article } from "@/types/article";
import ArticleForm, { ArticleFormData } from "@/components/ArticleForm";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/ConfirmationModal";

export default function ManageArticles() {
  const currentUser = useSelector(selectCurrentUser);
  const [page] = useState(1);
  const [pageSize] = useState(3);
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const {
    data: articlesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetArticlesQuery({
    page,
    pageSize,
    userId: currentUser?.id,
  });

  const { data: categories } = useGetCategoriesQuery();
  const [createArticle, { isLoading: isCreatingArticle }] =
    useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdatingArticle }] =
    useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeletingArticle }] =
    useDeleteArticleMutation();

  const userArticles = articlesData?.data || [];

  const handleCreateArticle = async (formData: ArticleFormData) => {
    try {
      await createArticle({ data: formData }).unwrap();
      toast.success("Article created successfully");
      setIsCreating(false);
      refetch();
    } catch {
      toast.error("Failed to create article. Please try again.");
    }
  };

  const handleUpdateArticle = async (formData: ArticleFormData) => {
    if (!editingArticle) return;
    try {
      await updateArticle({
        id: editingArticle.documentId,
        data: formData,
      }).unwrap();
      toast.success("Article updated successfully");
      setEditingArticle(null);
      refetch();
    } catch {
      toast.error("Failed to update article. Please try again.");
    }
  };

  const openDeleteModal = (article: Article) => {
    setArticleToDelete(article);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    try {
      await deleteArticle(articleToDelete.documentId).unwrap();
      toast.success("Article deleted successfully");
      setArticleToDelete(null);
      refetch();
    } catch {
      toast.error("Failed to delete article. Please try again.");
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
          <span className="text-sm">Error: {error.toString()}</span>
        </div>
      </div>
    );
  }

  if (isCreating || editingArticle) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isCreating ? "Create New Article" : "Edit Article"}
          </h1>
        </div>

        <ArticleForm
          initialData={editingArticle || undefined}
          categories={categories?.data || []}
          onSubmit={isCreating ? handleCreateArticle : handleUpdateArticle}
          isSubmitting={isCreatingArticle || isUpdatingArticle}
          submitLabel={isCreating ? "Create Article" : "Save Changes"}
          onCancel={() => {
            setIsCreating(false);
            setEditingArticle(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Articles</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </button>
      </div>

      {userArticles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900">No articles yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new article
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Article
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userArticles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {article.title}
                    </h3>
                    {article.category && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingArticle(article)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                      disabled={isDeletingArticle}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit article</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(article)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                      disabled={isDeletingArticle}
                    >
                      {isDeletingArticle ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="sr-only">Delete article</span>
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {article.description}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  Last updated:{" "}
                  {new Date(article.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        isOpen={!!articleToDelete}
        onClose={() => setArticleToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
