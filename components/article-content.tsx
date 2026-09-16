export function ArticleContent({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/).filter(Boolean);

  return (
    <div className="article-content">
      {blocks.map((block, index) => {
        const value = block.trim();
        if (value.startsWith("### ")) return <h3 key={index}>{value.slice(4)}</h3>;
        if (value.startsWith("## ")) return <h2 key={index}>{value.slice(3)}</h2>;
        if (value.startsWith("> ")) return <blockquote key={index}>{value.slice(2)}</blockquote>;
        if (value.split("\n").every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={index}>
              {value.split("\n").map((line) => (
                <li key={line}>{line.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{value}</p>;
      })}
    </div>
  );
}
