import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default {
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
};
