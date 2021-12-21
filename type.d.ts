/*
 * @Author: 汤启民
 * @Date: 2021-12-15 16:49:28
 * @Description: 路由相关的类型声明
 * @LastEditTime: 2021-12-16 15:52:47
 * @LastEditors: Please set LastEditors
 * @FilePath: \yp-mini\src\router\core\type.d.ts
 */

/** 单个页面的配置 */
export interface Route {
  /** 页面的标签，尽量使用中文描述 */
  label: string
  /** 页面的名称，用于跳转 */
  name: string
  /** 跳转路径，对应app.json里面的路径 */
  path: string
  /** 是否是tabBar页面，该页面在跳转时不能携带参数，需要额外标注 */
  isTabBar?: boolean
}

/** url的参数 */
export interface UrlParams {
  [key: string]: any
}

/** 跳转成功后的Res */
export interface NavigateResponse {
  /** 消息提示 */
  errMsg: string
  /** 页面跳转通信信道 */
  eventChannel: any
}

/** 跳转时配置 */
export interface RouteConfig {
  /** 跳转页面的name */
  name: string
  /** 跳转参数，非tabBar页面才有效 */
  query?: UrlParams
  /** 接收跳转页面发送回来的消息 */
  events?: any
  /** 跳转成功的回调 */
  success?(response: NavigateResponse): void
  /** 跳转失败的回调 */
  fail?(err: any): void
}

/** 路由守卫函数的next参数调用时可以传的参数类型 */
export type NextFnParams = undefined | string | RouteConfig

/** 路由守卫函数的next参数类型 */
export interface NextFn {
  (p?: NextFnParams): void
}

/** 导航守卫方法 */
export interface BeforeEach {
  (to: string, from: string, next: NextFn): void
}

/** 声明路由初始化参数配置 */
export interface RouterConfig {
  /** 路由配置 */
  routes: Route[]
  /** 导航守卫配置 */
  beforeEach?: BeforeEach
}
