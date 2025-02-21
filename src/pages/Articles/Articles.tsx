import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import ArticleCard from "@/components/ArticleCard";
import { Search, Filter, AlertCircle, BookOpen, Settings } from "lucide-react";

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = useGetCategoriesQuery();
  const { articles, isLoading, isError, error, loadMore, hasMore, isFetching } =
    useArticles(selectedCategory);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isFetching, hasMore, loadMore]);

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Articles
          </h2>
          <p className="text-sm text-gray-500">
            {error?.toString() || "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <p className="mt-1 text-sm text-gray-500">
              Discover and read interesting articles
            </p>
          </div>
          <Link
            to="/articles/manage"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search articles
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <label htmlFor="category" className="sr-only">
                Filter by category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="category"
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    const newCategory = e.target.value
                      ? Number(e.target.value)
                      : null;
                    setSelectedCategory(newCategory);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories?.data.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900">
              No articles found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "No articles available for the selected category"}
            </p>
          </div>
        )}

        {/* Loading More */}
        <div ref={observerTarget} className="py-8 text-center">
          {isFetching && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              <p className="text-sm text-gray-500">Loading more articles...</p>
            </div>
          )}
          {!isFetching && !hasMore && articles.length > 0 && (
            <p className="text-sm text-gray-500">You've reached the end</p>
          )}
        </div>
      </div>
    </div>
  );
}
