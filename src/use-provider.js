import { useHealthCheck, useInterval } from "./helper.js";

/**
 *
 * @param {Record<string,string>} ruleSet
 * @param pathFormater
 * @returns {Object}
 */
export function useRuleProviders(
  ruleSet,
  { pathFormatter } = {
    pathFormatter: (name) => `./rule-providers/${name}.yaml`,
  },
) {
  const ruleProvidersDefaultConf = {
    type: "http",
    behavior: "classical",
    format: "yaml",
    ...useInterval(),
  };

  return Object.fromEntries(
    Object.entries(ruleSet).map(([ruleName, ruleLink]) => {
      const ruleVal = {
        ...{ path: pathFormatter(ruleName), url: ruleLink },
        ...ruleProvidersDefaultConf,
      };
      return [ruleName, ruleVal];
    }),
  );
}

/**
 *
 * @param {Record<string,string>} proxySet
 * @param pathFormatter
 */
export function useProxyProviders(
  proxySet,
  { pathFormatter } = {
    pathFormatter: (name) => `./proxy-providers/${name}.yaml`,
  },
) {
  const ruleProvidersDefaultConf = {
    type: "http",
    ...useInterval(),
    ...useHealthCheck(),
  };

  return Object.fromEntries(
    Object.entries(proxySet).map(([ruleName, ruleLink]) => {
      const ruleVal = {
        ...{ path: pathFormatter(ruleName), url: ruleLink },
        ...ruleProvidersDefaultConf,
      };
      return [ruleName, ruleVal];
    }),
  );
}
