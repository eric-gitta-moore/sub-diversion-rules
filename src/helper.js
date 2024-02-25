import { proxyProvider } from "./proxy-provider.js";

/**
 * @type {number|boolean}
 */
// export const INTERVAL = 86400;
export const INTERVAL = false;

export function useInterval() {
  return INTERVAL
    ? {
        interval: INTERVAL,
      }
    : {};
}

export function useGroupConfig() {
  return {
    auto: ["自动选择"],
    default: ["默认"],
    direct: ["DIRECT"],
    manual: [`手动选择`, `手动选择2`],
    basic: ["负载均衡", "故障转移", "选择机场"],
    country: ["香港", "台湾", "日本", "新加坡", "美国", "其它地区"],
  };
}

export function useProxyGroups() {
  function useCommonGroup() {
    return [
      {
        name: "默认",
        type: "select",
        proxies: [
          ...useGroupConfig().auto,
          ...useGroupConfig().basic,
          ...useGroupConfig().manual,
          ...useGroupConfig().country,
          ...useGroupConfig().direct,
        ],
      },
      { name: "自动选择", type: "url-test", ...useAllProxy() },
      { name: "手动选择", type: "select", ...useAllProxy() },
      {
        name: "手动选择2",
        type: "select",
        proxies: [
          ...useGroupConfig().default,
          ...useGroupConfig().auto,
          ...useGroupConfig().basic,
          ...useGroupConfig().country,
          ...useGroupConfig().direct,
        ],
      },
      { name: "选择机场", type: "select", proxies: Object.keys(proxyProvider) },
      {
        name: "负载均衡",
        type: "load-balance",
        strategy: "consistent-hashing",
        ...useAllProxy(),
      },
      { name: "故障转移", type: "fallback", ...useAllProxy() },
    ];
  }
  function useCustomGroup() {
    return [
      { name: "Abroad SSH", ...useProxiesArray() },
      { name: "Google", ...useProxiesArray() },
      { name: "AWS", ...useProxiesArray() },
      { name: "Microsoft", ...useProxiesArray() },
      { name: "TikTok", ...useProxiesArray() },
      { name: "YouTube", ...useProxiesArray() },
      { name: "Twitter", ...useProxiesArray() },
      { name: "Facebook", ...useProxiesArray() },
      { name: "Zoom", ...useProxiesArray() },
      { name: "Scholar", ...useProxiesArray() },
      { name: "GitHub", ...useProxiesArray() },
      { name: "OneDrive", ...useProxiesArray() },
      { name: "Xbox", ...useProxiesArray() },
      { name: "JetBrains", ...useProxiesArray() },
      { name: "Dev", ...useProxiesArray() },
      { name: "Apple", ...useProxiesArrayCN() },
      { name: "OpenAI", ...useProxiesArray() },
      { name: "NETFLIX", ...useProxiesArray() },
    ].map((e) => ({ ...e, type: "select" }));
  }
  function useAriaGroup() {
    return [
      {
        name: "香港",
        ...useAllProxy(),
        filter: "(?i)港|hk|hongkong|hong kong",
      },
      { name: "台湾", ...useAllProxy(), filter: "(?i)台|tw|taiwan" },
      { name: "日本", ...useAllProxy(), filter: "(?i)日本|jp|japan" },
      {
        name: "美国",
        ...useAllProxy(),
        filter: "(?i)美|us|unitedstates|united states",
      },
      { name: "新加坡", ...useAllProxy(), filter: "(?i)(新|sg|singapore)" },
      {
        name: "其它地区",
        ...useAllProxy(),
        filter:
          "(?i)^(?!.*(?:🇭🇰|🇯🇵|🇺🇸|🇸🇬|🇨🇳|港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates)).*",
      },
    ].map((e) => ({ ...e, type: "url-test" }));
  }
  function useProviderGroup() {
    return Object.entries(proxyProvider).map(([name, _]) => {
      return { name, type: "url-test", use: [name] };
    });
  }
  function useCommonGroupAfter() {
    return [
      { name: "国内", ...useProxiesArrayCN() },
      { name: "漏网之鱼", ...useProxiesArray() },
    ].map((e) => ({ ...e, type: "select" }));
  }

  function useDividerGen() {
    let idx = 1;
    return () => {
      return { name: `====分割线 ${idx++}====`, type: "select", proxies: [] };
    };
  }
  const useDivider = useDividerGen();

  return [
    ...useCommonGroup(),
    useDivider(),
    ...useCustomGroup(),
    useDivider(),
    ...useAriaGroup(),
    useDivider(),
    ...useProviderGroup(),
    useDivider(),
    ...useCommonGroupAfter(),
  ];
}

export function useAllProxy() {
  return { use: Object.keys(proxyProvider) };
}

export function useProxiesArray() {
  return {
    use: [
      ...useGroupConfig().default,
      ...useGroupConfig().country,
      ...useGroupConfig().manual,
      ...useGroupConfig().auto,
      ...useGroupConfig().basic,
      ...useGroupConfig().direct,
    ],
  };
}

export function useProxiesArrayCN() {
  return {
    use: [
      ...useGroupConfig().direct,
      ...useGroupConfig().default,
      ...useGroupConfig().country,
      ...useGroupConfig().manual,
      ...useGroupConfig().auto,
      ...useGroupConfig().basic,
    ],
  };
}

export function useHealthCheck(
  { interval, url } = {
    interval: INTERVAL,
    url: `https://cp.cloudflare.com/generate_204`,
  },
) {
  return INTERVAL
    ? {
        "health-check": {
          enable: true,
          url,
          interval,
        },
      }
    : {};
}

/**
 *
 * @param {Record<string,string>} ruleSet
 * @param pathFormater
 * @returns {Object}
 */
export function useRuleProviders(
  ruleSet,
  { pathFormater } = {
    pathFormater: (name) => `./rule-providers/${name}.yaml`,
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
        ...{ path: pathFormater(ruleName), url: ruleLink },
        ...ruleProvidersDefaultConf,
      };
      return [ruleName, ruleVal];
    }),
  );
}

/**
 *
 * @param {Record<string,string>} proxySet
 * @param pathFormater
 */
export function useProxyProviders(
  proxySet,
  { pathFormater } = {
    pathFormater: (name) => `./proxy-providers/${name}.yaml`,
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
        ...{ path: pathFormater(ruleName), url: ruleLink },
        ...ruleProvidersDefaultConf,
      };
      return [ruleName, ruleVal];
    }),
  );
}
