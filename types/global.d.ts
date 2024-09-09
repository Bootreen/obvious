// support import sql-files as modules
declare module "*.sql" {
  const content: string;
  export default content;
}
