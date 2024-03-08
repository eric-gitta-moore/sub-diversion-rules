import { proxyProvider } from "./proxy-provider.js";
import { PROXY_TYPE } from "./constant.js";

/**
 * @type {number|boolean}
 */
// export const INTERVAL = 86400;
export const INTERVAL = false;
export const TIMEOUT = 1000;

let proxies = [];

export function useInterval() {
  const obj = {};
  INTERVAL && (obj["interval"] = INTERVAL);
  return obj;
}

export function useTimeout() {
  const obj = {};
  TIMEOUT && (obj["timeout"] = TIMEOUT);
  return obj;
}

export function useGroupConfig() {
  const { useAriaGroup, useManualGroup, useRelayGroup } = useGenGroupHelper();
  return {
    auto: ["自动选择"],
    default: ["默认"],
    direct: ["DIRECT"],
    manual: [
      ...useManualGroup({}).map((e) => e.name),
      ...useRelayGroup().choose.map((e) => e.name),
    ],
    basic: ["负载均衡", "故障转移"],
    country: useAriaGroup().map((e) => e.name),
    //
    relay: [...useRelayGroup().choose.map((e) => e.name)],
  };
}

export function useProxyGroupConfigure() {
  function useType({ type }) {
    switch (type) {
      case PROXY_TYPE.URLTest:
        return {
          type: PROXY_TYPE.URLTest,
          ...useTimeout(),
        };
    }
  }
  return { useType };
}

function useGenGroupHelper() {
  const { useType } = useProxyGroupConfigure();
  function useManualGroup({ useConfig } = { useConfig: useGroupConfig }) {
    return [
      {
        name: "手动选择1",
        type: "select",
        proxies: useConfig
          ? [
              ...useConfig().auto,
              ...useConfig().basic,
              // ...useConfig().relay,
              ...useConfig().country,
              ...useConfig().direct,
            ]
          : [],
      },
      { name: "手动选择2", type: "select", "include-all": true },
      { name: "手动选择3", type: "select", "include-all": true },
      { name: "选择机场", type: "select", proxies: Object.keys(proxyProvider) },
    ];
  }
  function useRelayGroup() {
    const all = [
      // {
      //   name: "中继前置1",
      //   type: "select",
      //   proxies: [...useManualGroup({}).map((e) => e.name)],
      // },
      // { name: "中继后继1", type: "select", "include-all": true },
      // { name: "中继组1", type: "relay", proxies: ["中继前置1", "中继后继1"] },
    ];
    return {
      all,
      // 可以选择的组别
      choose: all.filter((e) => e.name.startsWith("中继组")),
      configure: all.filter(
        (e) => e.name.startsWith("中继前置") || e.name.startsWith("中继后继"),
      ),
    };
  }
  function useDialerGroup() {
    return [
      {
        name: "前置代理组",
        type: "select",
        "include-all-providers": true,
      },
    ];
  }
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
      {
        name: "自动选择",
        "include-all": true,
        ...useType({ type: PROXY_TYPE.URLTest }),
      },
      // {
      //   name: "负载均衡",
      //   type: "load-balance",
      //   strategy: "consistent-hashing",
      //   "include-all": true,
      // },
      // { name: "故障转移", type: "fallback", "include-all": true },
    ];
  }
  function useCustomGroup() {
    return [
      // { name: "Abroad SSH", ...useProxiesArray() },
      { name: "Google", ...useProxiesArray() },
      { name: "GoogleOneVPNCheckPoint", ...useProxiesArray() },
      { name: "GoogleOneVPNTun", ...useProxiesArray() },
      // { name: "AWS", ...useProxiesArray() },
      // { name: "Microsoft", ...useProxiesArray() },
      // { name: "TikTok", ...useProxiesArray() },
      // { name: "YouTube", ...useProxiesArray() },
      // { name: "Twitter", ...useProxiesArray() },
      // { name: "Facebook", ...useProxiesArray() },
      { name: "Zoom", ...useProxiesArray() },
      // { name: "Scholar", ...useProxiesArray() },
      // { name: "GitHub", ...useProxiesArray() },
      // { name: "OneDrive", ...useProxiesArray() },
      // { name: "Xbox", ...useProxiesArray() },
      // { name: "JetBrains", ...useProxiesArray() },
      // { name: "Dev", ...useProxiesArray() },
      // { name: "Apple", ...useProxiesArrayCN() },
      { name: "OpenAI", ...useProxiesArray() },
      // { name: "NETFLIX", ...useProxiesArray() },
    ].map((e) => ({ ...e, type: "select" }));
  }
  function useAriaGroup() {
    function genAriaGroup(name, filter = null) {
      return {
        name,
        "include-all-providers": true,
        filter: !filter ? `(?i)(${name})` : filter,
      };
    }

    const list = [
      genAriaGroup(`香港`),
      genAriaGroup(`台湾`),
      genAriaGroup(`日本`),
      genAriaGroup(`美国`, `(?i)美|us|unitedstates|united states`),
      genAriaGroup(`新加坡`),
      genAriaGroup(`澳大利亚`),
      // genAriaGroup(`德国`),
      // genAriaGroup(`印度`),
      // genAriaGroup(`巴西`),
      // genAriaGroup(`加拿大`),
      // genAriaGroup(`韩国`),
      genAriaGroup(`英国`),
      // genAriaGroup(`智利`),
      // genAriaGroup(`土耳其`),
      // genAriaGroup(`阿根廷`),
      // genAriaGroup(`荷兰`),
      // genAriaGroup(`法国`),
      genAriaGroup(`CN`, `(?i)cn|中国`),
    ];
    list.push(
      genAriaGroup(
        `其它地区`,
        `(?i)^(?!.*(?:(${list.map((e) => e.name).join("|")}))).*`,
      ),
    );

    return list.map((e) => ({
      ...e,
      ...useType({ type: PROXY_TYPE.URLTest }),
    }));
  }
  function useProviderGroup() {
    return Object.entries(proxyProvider).map(([name, _]) => {
      return { name, ...useType({ type: PROXY_TYPE.URLTest }), use: [name] };
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
        name: `⭕⭕====分割线 ${idx++}====⭕⭕`,
        type: "select",
        proxies: [...useGroupConfig().direct],
      };
    };
  }
  return {
    useCommonGroup,
    useDialerGroup,
    useManualGroup,
    useCustomGroup,
    useAriaGroup,
    useProviderGroup,
    useCommonGroupAfter,
    useDividerGen,
    useRelayGroup,
  };
}

export function useProxyGroups({ proxies: presetProxies } = { proxies: [] }) {
  proxies = presetProxies;
  const {
    useCommonGroup,
    useCustomGroup,
    useAriaGroup,
    useProviderGroup,
    useCommonGroupAfter,
    useDividerGen,
    useDialerGroup,
    useManualGroup,
    useRelayGroup,
  } = useGenGroupHelper();
  const useDivider = useDividerGen();

  return [
    ...useCommonGroup(),
    useDivider(),
    ...useManualGroup(),
    useDivider(),
    ...useDialerGroup(),
    ...useRelayGroup().all,
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

export function useHealthCheck() {
  return {
    "health-check": {
      enable: true,
      ...useInterval(),
      ...useTimeout(),
    },
  };
}
