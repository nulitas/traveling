import { useState, useEffect, useCallback } from "react";
import { useGetArticlesQuery } from "@/services/articleApi";
import { Article } from "@/types/article";
export const useArticles = (categoryId: number | null = null) => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;
  const [articles, setArticles] = useState<Article[]>([]);

  const { data, isLoading, isError, error, isFetching } = useGetArticlesQuery({
    page: currentPage,
    pageSize: articlesPerPage,
    categoryId,
  });

  useEffect(() => {
    setArticles([]);
    setCurrentPage(1);
  }, [categoryId]);

  useEffect(() => {
    if (data?.data) {
      setArticles((prevArticles) => {
        const uniqueArticles = data.data.filter(
          (newArticle) =>
            !prevArticles.some(
              (existingArticle) => existingArticle.id === newArticle.id
            )
        );
        return [...prevArticles, ...uniqueArticles];
      });
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (
      !isFetching &&
      data?.meta?.pagination?.page &&
      data?.meta?.pagination?.pageCount &&
      data.meta.pagination.page < data.meta.pagination.pageCount
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, data]);

  return {
    articles,
    pagination: data?.meta.pagination,
    isLoading,
    isError,
    error,
    loadMore,
    hasMore: data ? currentPage < data.meta.pagination.pageCount : false,
    isFetching,
  };
};
