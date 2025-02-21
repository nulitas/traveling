import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetUserCommentsQuery } from "@/services/commentApi";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/auth";
import { MessageSquare, AlertCircle } from "lucide-react";

interface CommentedArticleProps {
  user: User;
}

export default function CommentedArticle({ user }: CommentedArticleProps) {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const loadingRef = useRef<HTMLDivElement>(null);

  const {
    data: comments,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserCommentsQuery(
    { userId: user?.id?.toString() || "", page, pageSize },
    { skip: !isAuthenticated || !user }
  );

  const sortedComments = useMemo(() => {
    if (!comments?.data) return [];
    return [...comments.data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments]);

  const hasMore = comments?.meta.pagination
    ? page < comments.meta.pagination.pageCount
    : false;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, isFetching]);

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
        Please log in to view your commented articles.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">
            An error occurred while fetching your comments.
            {error && "status" in error && ` Status: ${error.status}`}
          </p>
        </div>
      </div>
    );
  }

  if (!sortedComments.length) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-300" />
        <h3 className="mt-4 text-sm font-medium text-gray-900">
          No comments yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by commenting on an article.
        </p>
      </div>
    );
  }

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
    <div className="space-y-4">
      {sortedComments.map((comment) => (
        <div
          key={comment.id}
          className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
        >
          {comment.article ? (
            <Link
              to={`/articles/${comment.article.documentId}`}
              className="block"
            >
              <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                {comment.article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{comment.content}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <time dateTime={comment.createdAt}>
                  {formatDate(comment.createdAt)}
                </time>
                <span>•</span>
                <span>Click to view article</span>
              </div>
            </Link>
          ) : (
            <div className="text-sm text-gray-500">
              Article no longer available
            </div>
          )}
        </div>
      ))}

      <div ref={loadingRef} className="py-4 flex justify-center">
        {isFetching && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>

      {!hasMore && sortedComments.length > 0 && (
        <p className="text-center text-sm text-gray-500 py-4">
          No more comments to load
        </p>
      )}
    </div>
  );
}
