import fs from "node:fs";
import yaml from "yamljs";
import path from "node:path";
import url from "node:url";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const PROXY_PROVIDER_URL =
  "https://sub-store.tianhaoltd.top/4ae91b41-9b14-4c79-8b36-b3d5b6366874/download/collection/all-in-one?target=sing-box";

function useProxies(
  { proxyProviderURL } = { proxyProviderURL: PROXY_PROVIDER_URL },
) {
  let proxies;
  async function getProxies() {
    if (proxies) {
      return proxies;
    }
    const httpsProxy = process.env.https_proxy;
    const agent = httpsProxy ? new HttpsProxyAgent(httpsProxy) : null;
    proxies = await fetch(proxyProviderURL, agent ? { agent } : {}).then((e) =>
      e.json(),
    );
    return proxies;
  }

  async function getOutbounds() {
    return (await getProxies()).map((e) => e["tag"]);
  }

  return {
    getProxies,
    getOutbounds,
  };
}

async function getConf() {
  const baseYaml = yaml.load(path.join(__dirname, `./base.yml`));
  const customOutbounds = baseYaml["custom_outbounds"];
  delete baseYaml["custom_outbounds"];

  const { getProxies, getOutbounds } = useProxies();

  for (const proxyItem of baseYaml["outbounds"]) {
    const filterExp = new RegExp(proxyItem["filter"] ?? ".*", "i");
    delete proxyItem["filter"];
    if ("include-all" in proxyItem) {
      delete proxyItem["include-all"];
      proxyItem["outbounds"] = [
        ...(await getOutbounds()),
        ...customOutbounds.map((e) => e["tag"]),
      ].filter((e) => filterExp.test(e));
    } else if ("include-all-providers" in proxyItem) {
      delete proxyItem["include-all-providers"];
      proxyItem["outbounds"] = (await getOutbounds()).filter((e) =>
        filterExp.test(e),
      );
    }
  }

  baseYaml["outbounds"] = [
    ...baseYaml["outbounds"],
    ...(await getProxies()),
    ...customOutbounds,
  ];
  return {
    ...baseYaml,
  };
}

(async function () {
  const conf = await getConf();
  fs.writeFileSync(
    path.join(__dirname, `../../sing-box.json`),
    JSON.stringify(conf, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, `../../sing-box.yml`),
    yaml.stringify(conf),
  );
})();
