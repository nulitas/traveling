import { useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetArticleQuery } from "@/services/articleApi";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/services/commentApi";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/store/modules/authSlice";
import { Comment } from "@/types/comment";
import { toast } from "react-toastify";
import ArticleCommentForm from "@/components/ArticleCommentForm";
import ArticleCommentItem from "@/components/ArticleCommentItem";
import { ArrowLeft, AlertCircle, MessageSquare } from "lucide-react";
import DeleteConfirmationModal from "@/components/ConfirmationModal";
export default function ArticleDetails() {
  const { documentId } = useParams<{ documentId: string }>();
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );

  const {
    data: article,
    isLoading: isArticleLoading,
    isError: isArticleError,
    error: articleError,
  } = useGetArticleQuery(documentId || "");

  const {
    data: comments,
    isFetching: isCommentsFetching,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
  } = useGetCommentsQuery({ articleId: documentId || "" });

  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] =
    useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);

  const articleData = article?.data;
  const commentsData = comments?.data || [];
  const pagination = comments?.meta?.pagination;
  const hasMore = pagination ? page < pagination.pageCount : false;

  const handleCreateComment = useCallback(
    async (content: string) => {
      if (!currentToken) {
        toast.error("You must be logged in to comment");
        return;
      }
      try {
        await createComment({
          data: {
            content,
            article: articleData?.id.toString() || "",
          },
        }).unwrap();
        toast.success("Comment posted successfully");
        refetchComments();
      } catch {
        toast.error("Failed to post comment. Please try again.");
      }
    },
    [currentToken, createComment, articleData, refetchComments]
  );

  const handleUpdateComment = useCallback(
    async (comment: Comment, newContent: string) => {
      if (!currentToken) {
        toast.error("You must be logged in to update a comment");
        return;
      }
      try {
        await updateComment({
          id: comment.documentId,
          data: { content: newContent },
        }).unwrap();
        toast.success("Comment updated successfully");
        refetchComments();
      } catch (err) {
        toast.error("Failed to update comment. Please try again.");
        console.error("Failed to update comment:", err);
      }
    },
    [currentToken, updateComment, refetchComments]
  );

  const openDeleteModal = (commentId: string) => {
    setSelectedCommentId(commentId);
    setIsModalOpen(true);
  };

  const confirmDeleteComment = useCallback(async () => {
    if (!currentToken || !selectedCommentId) {
      toast.error("You must be logged in to delete a comment");
      return;
    }
    try {
      await deleteComment(selectedCommentId).unwrap();
      toast.success("Comment deleted successfully");
      refetchComments();
    } catch (err) {
      toast.error("Failed to delete comment. Please try again.");
      console.error("Failed to delete comment:", err);
    } finally {
      setIsModalOpen(false);
      setSelectedCommentId(null);
    }
  }, [currentToken, selectedCommentId, deleteComment, refetchComments]);

  if (isArticleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isArticleError) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>Error: {articleError.toString()}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/articles"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Articles
      </Link>
      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          {articleData?.title}
        </h1>

        {articleData?.cover_image_url ? (
          <div className="aspect-video relative overflow-hidden rounded-xl border border-gray-200">
            <img
              src={articleData.cover_image_url || "/placeholder.svg"}
              alt={articleData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/no-image.png";
                e.currentTarget.className =
                  "w-full h-full object-cover bg-gray-100";
              }}
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 rounded-xl border border-gray-200">
            No Image Available
          </div>
        )}

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 text-lg leading-relaxed">
            {articleData?.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-200 pt-6">
          <time dateTime={articleData?.publishedAt}>
            {articleData?.publishedAt
              ? new Date(articleData.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown"}
          </time>
        </div>

        <section className="border-t border-gray-200 pt-10 mt-10">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
          </div>

          <ArticleCommentForm
            onSubmit={handleCreateComment}
            isLoading={isCreatingComment}
          />

          <div className="mt-8">
            {isCommentsError ? (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <p>Error loading comments: {commentsError.toString()}</p>
              </div>
            ) : (
              <>
                {commentsData.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {commentsData.map((comment) => (
                      <ArticleCommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onUpdate={handleUpdateComment}
                        onDelete={() => openDeleteModal(comment.documentId)}
                        isUpdating={isUpdatingComment}
                        isDeleting={isDeletingComment}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                )}

                {hasMore && (
                  <div className="flex justify-center py-8">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={() => setPage((prevPage) => prevPage + 1)}
                      disabled={isCommentsFetching}
                    >
                      {isCommentsFetching ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <DeleteConfirmationModal
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteComment}
      />
    </article>
  );
}
