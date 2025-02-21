import { useState } from "react";
import { useGetMeQuery } from "@/services/authApi";

import DetailProfile from "@/components/ProfileDetail";
import CommentedArticle from "@/components/ProfileComment";
import { UserIcon, MessageSquare } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading, isError, error } = useGetMeQuery();
  const [activeTab, setActiveTab] = useState<"info" | "comments">("info");

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  if (isError)
    return (
      <div className="text-center text-red-500 font-semibold">
        Error: {error.toString()}
      </div>
    );
  if (!user)
    return (
      <div className="text-center text-red-500 font-semibold">
        User not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 border-2 border-white shadow-sm mb-4">
          <span className="text-2xl font-medium text-gray-600">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Member since {new Date(user.createdAt).getFullYear()}
        </p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Profile sections">
          <button
            onClick={() => setActiveTab("info")}
            className={`
              py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm
              ${
                activeTab === "info"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <UserIcon className="w-4 h-4" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`
              py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm
              ${
                activeTab === "comments"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <MessageSquare className="w-4 h-4" />
            Comments
          </button>
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "info" ? (
          <DetailProfile user={user} />
        ) : (
          <CommentedArticle user={user} />
        )}
      </div>
    </div>
  );
}
