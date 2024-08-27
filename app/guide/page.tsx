"use client";

import MarkdownRenderer from "@/utils/md-renderer";
import { title } from "@/components/primitives";
import { useAppStates } from "@/store/app-states";

const GuidePage = () => {
  const { topic, guide } = useAppStates((state) => state);

  // console.log(guide);

  return (
    <div className="text-left flex flex-col gap-y-4">
      <h4 className={title()}>{topic}</h4>
      {guide.map((e, i) => (
        <MarkdownRenderer key={i} content={e} />
      ))}
    </div>
  );
};

export default GuidePage;
