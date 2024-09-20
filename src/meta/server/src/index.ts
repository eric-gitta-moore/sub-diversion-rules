import fs from "node:fs";
import Koa from "koa";
import path from "node:path";

const defaultTplUrl = 'https://github.com/eric-gitta-moore/sub-diversion-rules/raw/main/src/meta/server/assets/base.yaml'
const tplUrl = process.env.TPL_URL || defaultTplUrl

const test = fs.readFileSync(
  path.resolve(process.cwd(), "./assets/base.yaml"),
  "utf-8",
);

const app = new Koa();

app.use(async (ctx) => {
  let tpl = test
  try {
    tpl = await fetch(tplUrl).then(e => e.text())
  } catch (e) {
    console.warn('获取远程配置失败', e)
  }
  const url: string = (ctx.query?.url as string) || "";
  ctx.body = tpl.replace(`http://test.com`, decodeURIComponent(url));
});

const server = app.listen(3000);

server.on("listening", () => {
  console.log(server.address());
  console.log(`assets dir: ${path.resolve(process.cwd(), "./assets")}`);
});
