import common from "@/styles/layout.default.module.css";

const QuizLayout = ({ children }: { children: React.ReactNode }) => (
  <section className={common.section}>
    <div className={common.mainContainer}>{children}</div>
  </section>
);

export default QuizLayout;
