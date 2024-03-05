import { ruleProvider } from "./rule-provider.js";
import { useProxyGroups } from "./helper.js";
import { proxyProvider } from "./proxy-provider.js";
import fs from "node:fs";
import yaml from "yamljs";
import path from "node:path";
import url from "node:url";
import { useProxyProviders, useRuleProviders } from "./use-provider.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function getConf() {
  const baseYaml = yaml.load(path.join(__dirname, `./base.yaml`));
  const presetProxies = yaml.load(path.join(__dirname, `./proxies.yaml`));
  return {
    ...baseYaml,
    "proxy-groups": useProxyGroups({ proxies: presetProxies?.proxies }),
    "rule-providers": useRuleProviders(ruleProvider),
    "proxy-providers": useProxyProviders(proxyProvider),
    ...presetProxies,
  };
}

(function () {
  const conf = getConf();
  fs.writeFileSync(path.join(__dirname, `../conf.yml`), yaml.stringify(conf));
})();
