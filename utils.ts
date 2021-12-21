import { Route, UrlParams } from './type'

/** 将routes平铺为一维数组 */
export const mapRoutes = (routes: Route[]): Route[] => {
  return [...routes]
}

/**
 * 处理参数编码
 * @param {object} data
 */
export function encode(data) {
  return encodeURIComponent(JSON.stringify(data))
}

/**
 * query化
 * @param {object} obj
 */
export function parseQuery(obj) {
  return Object.keys(obj)
    .map((k) => {
      const v = obj[k]
      return `${k}=${v}`
    })
    .join('&')
}

/** 校验路由 */
export function validateRoute(name: string, query: UrlParams, targetRoute: Route, type = 'push'): string {
  if (!name) {
    throw new Error(`Router.${type}: name is required`)
  }
  if (!targetRoute) {
    throw new Error(`Router.${type}: Can not find route '${name}' , did you registered in routes ?`)
  }
  let url = `/${targetRoute.path}`
  if (query) {
    if (targetRoute.isTabBar) {
      throw new Error(`Router.${type}: Route '${name}' is a tabBar page, it will not be allowed to get parameters`)
    }
    url = `${url}?${parseQuery(query)}`
  }
  return url
}

export function getRouteByPath(path: string, routes) {
  return routes.find((route) => route.path === path)
}

export function getRouteByName(name: string, routes) {
  return routes.find((route) => route.name === name)
}
