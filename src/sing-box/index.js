import fs from "node:fs";
import yaml from "yamljs";
import path from "node:path";
import url from "node:url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const PROXY_PROVIDER_URL =
  "https://sub-store.tianhaoltd.top/4ae91b41-9b14-4c79-8b36-b3d5b6366874/download/collection/all-in-one?target=sing-box";

async function getProxies({ proxyProviderURL } = { PROXY_PROVIDER_URL }) {
  const proxies = await fetch(proxyProviderURL).then((e) => e.json());
  return proxies;
}

async function getConf() {
  const baseYaml = yaml.load(path.join(__dirname, `./base.yaml`));
  return {
    ...baseYaml,
    ...(await getProxies()),
  };
}

(async function () {
  const conf = await getConf();
  fs.writeFileSync(
    path.join(__dirname, `../../sing-box.json`),
    JSON.stringify(conf, null, 2),
  );
})();
