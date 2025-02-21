import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface ArticleCommentFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

export default function ArticleCommentForm({
  onSubmit,
  isLoading,
}: ArticleCommentFormProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  const remainingChars = maxLength - content.length;
  const isNearLimit = remainingChars <= 50;
  const hasContent = content.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <div
          className={`
            relative rounded-lg border bg-white transition-all duration-200
            ${isFocused ? "border-gray-400 shadow-sm" : "border-gray-200"}
          `}
        >
          <label htmlFor="comment" className="sr-only">
            Write a comment
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setContent(e.target.value);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Write your thoughts..."
            required
            rows={4}
            maxLength={maxLength}
            className="block w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />

          {/* Character count */}
          <div className="absolute bottom-2 right-2">
            <span
              className={`
                text-xs transition-colors
                ${isNearLimit ? "text-red-500" : "text-gray-400"}
              `}
            >
              {remainingChars} characters remaining
            </span>
          </div>
        </div>

        {/* Button group */}
        <div className="mt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setContent("")}
            className={`
              px-3 py-1.5 text-xs text-gray-500 transition-colors
              ${hasContent ? "hover:text-gray-700" : "hidden"}
            `}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading || !hasContent}
            className={`
              inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isLoading
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : hasContent
                  ? "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
