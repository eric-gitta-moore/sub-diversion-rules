import { ruleProvider } from "./rule-provider.js";
import {
  useProxyGroups,
  useProxyProviders,
  useRuleProviders,
} from "./helper.js";
import { proxyProvider } from "./proxy-provider.js";
import fs from "node:fs";
import yaml from "yamljs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function getConf() {
  const baseYaml = yaml.load(path.join(__dirname, `./base.yml`));
  return {
    ...baseYaml,
    "proxy-groups": useProxyGroups(),
    "rule-providers": useRuleProviders(ruleProvider),
    "proxy-providers": useProxyProviders(proxyProvider),
  };
}

(function () {
  const conf = getConf();
  fs.writeFileSync(path.join(__dirname, `../conf.yml`), yaml.stringify(conf));
})();
