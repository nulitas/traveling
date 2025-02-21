import { useState } from "react";
import type { Comment } from "@/types/comment";
import type { User } from "@/types/auth";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  onUpdate: (comment: Comment, newContent: string) => void;
  onDelete: (commentId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function ArticleCommentItem({
  comment,
  currentUser,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleUpdate = () => {
    onUpdate(comment, editedContent);
    setIsEditing(false);
  };

  const isOwnComment = currentUser && comment.user.id === currentUser.id;

  const formatDate = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - commentDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return commentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="py-6 first:pt-0">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              {comment.user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-x-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-gray-900">
                {comment.user.username}
              </h3>
              <p className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </p>
            </div>

            {isOwnComment && !isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="sr-only">Edit comment</span>
                </button>
                <button
                  onClick={() => onDelete(comment.documentId)}
                  disabled={isDeleting}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="sr-only">Delete comment</span>
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[100px] p-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none bg-gray-50"
                  placeholder="Edit your comment..."
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-gray-400">
                  <span>{editedContent.length} characters</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating || !editedContent.trim()}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
