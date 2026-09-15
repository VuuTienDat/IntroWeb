import { company } from "@/lib/site";

type ArticleBylineProps = {
  updatedAt: string;
  updatedAtIso?: string;
  author?: string;
};

export function ArticleByline({
  updatedAt,
  updatedAtIso,
  author = company.name,
}: ArticleBylineProps) {
  return (
    <div className="article-byline">
      <span>
        Biên soạn bởi <strong>{author}</strong>
      </span>
      <span>
        Cập nhật <time dateTime={updatedAtIso ?? updatedAt}>{updatedAt}</time>
      </span>
      <span>Nội dung về công nghệ và vận hành, không thay thế tư vấn y khoa.</span>
    </div>
  );
}
