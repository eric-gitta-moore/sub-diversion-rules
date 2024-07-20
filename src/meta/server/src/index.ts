import fs from "node:fs";
import Koa from "koa";
import path from "node:path";

const test = fs.readFileSync(
  path.resolve(process.cwd(), "./assets/base.yaml"),
  "utf-8",
);

const app = new Koa();

app.use(async (ctx) => {
  const url: string = (ctx.query?.url as string) || "";
  ctx.body = test.replace(`http://test.com`, decodeURIComponent(url));
});

const server = app.listen(3000);

server.on("listening", () => {
  console.log(server.address());
  console.log(`assets dir: ${path.resolve(process.cwd(), "./assets")}`);
});
