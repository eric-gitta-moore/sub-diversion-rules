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
  const {
    useCommonGroup,
    useCustomGroup,
    useAriaGroup,
    useProviderGroup,
    useCommonGroupAfter,
    useDividerGen,
  } = useGenGroupHelper();
  return {
    auto: ["自动选择"],
    default: ["默认"],
    direct: ["DIRECT"],
    manual: [`手动选择`, `手动选择2`],
    basic: ["负载均衡", "故障转移", "选择机场"],
    // country: ["香港", "台湾", "日本", "新加坡", "美国", "其它地区"],
    country: useAriaGroup().map((e) => e.name),
  };
}

function useGenGroupHelper() {
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
    function genAriaGroup(name, filter = null) {
      return {
        name,
        ...useAllProxy(),
        filter: !filter ? `(?i)(${name})` : filter,
      };
    }

    return [
      genAriaGroup(`香港`),
      genAriaGroup(`台湾`),
      genAriaGroup(`日本`),
      genAriaGroup(`美国`, `(?i)美|us|unitedstates|united states`),
      genAriaGroup(`新加坡`),
      genAriaGroup(`澳大利亚`),
      genAriaGroup(`德国`),
      genAriaGroup(`印度`),
      genAriaGroup(`巴西`),
      genAriaGroup(`加拿大`),
      genAriaGroup(`韩国`),
      genAriaGroup(`英国`),
      genAriaGroup(`智利`),
      genAriaGroup(`土耳其`),
      genAriaGroup(`阿根廷`),
      genAriaGroup(`荷兰`),
      genAriaGroup(
        `其它地区`,
        "(?i)^(?!.*(?:🇭🇰|🇯🇵|🇺🇸|🇸🇬|🇨🇳|港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates)).*",
      ),
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
      return {
        name: `🔜====分割线 ${idx++}====🔚`,
        type: "select",
        proxies: [...useGroupConfig().direct],
      };
    };
  }
  return {
    useCommonGroup,
    useCustomGroup,
    useAriaGroup,
    useProviderGroup,
    useCommonGroupAfter,
    useDividerGen,
  };
}

export function useProxyGroups() {
  const {
    useCommonGroup,
    useCustomGroup,
    useAriaGroup,
    useProviderGroup,
    useCommonGroupAfter,
    useDividerGen,
  } = useGenGroupHelper();
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
    proxies: [
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
    proxies: [
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
