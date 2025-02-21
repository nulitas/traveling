import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent placeholder:text-gray-400"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <span>{initialData ? "Update" : "Create"} Category</span>
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
