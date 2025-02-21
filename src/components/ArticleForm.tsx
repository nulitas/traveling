import { useState } from "react";
import type { Article } from "@/types/article";
import type { Category } from "@/types/category";
import { Loader2 } from "lucide-react";

interface ArticleFormProps {
  initialData?: Article;
  categories: Category[];
  onSubmit: (formData: ArticleFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
}

export interface ArticleFormData {
  title: string;
  description: string;
  cover_image_url: string;
  category: number | null;
}

export default function ArticleForm({
  initialData,
  categories,
  onSubmit,
  isSubmitting,
  submitLabel,
  onCancel,
}: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    cover_image_url: initialData?.cover_image_url || "",
    category: initialData?.category?.id || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <div className="relative">
          <input
            type="url"
            name="cover_image_url"
            value={formData.cover_image_url}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                cover_image_url: e.target.value,
              }))
            }
            placeholder="https://example.com/image.jpg"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={formData.category || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              category: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            submitLabel
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
