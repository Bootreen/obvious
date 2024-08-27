/* eslint-disable no-console */
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const preparsedContent = content
    .replaceAll("+++", "```")
    .replaceAll("\\(", "(") //  for some reason Gemini tends to unnecessary escape
    .replaceAll("\\)", ")"); // some of the brackets enclosing the formulas

  return (
    <ReactMarkdown
      components={{}} // Optional components
      rehypePlugins={[rehypeKatex]} // rehype-katex for KaTeX-formulae render
      remarkPlugins={[remarkMath]} // remark-math for math ecuations render
    >
      {preparsedContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
