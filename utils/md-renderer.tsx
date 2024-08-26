import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Импортируйте стили KaTeX

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{}} // Optional components
      rehypePlugins={[rehypeKatex]} // rehype-katex for KaTeX-formulae render
      remarkPlugins={[remarkMath]} // remark-math for math ecuations render
    >
      {content
        .replaceAll("+++", "```")
        .replaceAll("\\(", "(")
        .replaceAll("\\)", ")")}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
