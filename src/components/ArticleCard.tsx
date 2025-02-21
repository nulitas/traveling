import { useNavigate } from "react-router-dom";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/articles/${article.documentId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
    >
      {article.cover_image_url ? (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.cover_image_url || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-image.png";
              e.currentTarget.className =
                "w-full h-full object-cover bg-gray-100";
            }}
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
          No Image Available
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-slate-600 mb-2 font-medium">
          {article.category?.name || "Uncategorized"}
        </p>
        <p className="text-sm text-gray-600 line-clamp-3">
          {article.description}
        </p>
      </div>
    </div>
  );
}
