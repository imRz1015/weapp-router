/*
 * @Author: 汤启民
 * @Date: 2021-12-15 16:40:15
 * @Description: YpRouter实现
 */

import {
  RouterConfig,
  Route,
  RouteConfig,
  NavigateResponse,
  BeforeEach,
} from "./type";
import {
  getRouteByName,
  getRouteByPath,
  mapRoutes,
  validateRoute,
} from "./utils";

export default class YpRouter {
  /** 路由表 */
  private routes: Route[] = [];

  /** 导航守卫函数 */
  // eslint-disable-next-line
  private beforeEach: BeforeEach = (to, from, next) => {
    next();
  };

  constructor(options: RouterConfig) {
    this.createRouter(options.routes);
    if (options.beforeEach) {
      this.registerGuards(options.beforeEach);
    }
  }

  /** 注册路由表 */
  createRouter(routes: Route[]): void {
    this.routes = mapRoutes(routes);
  }

  /** 注册守卫 */
  registerGuards(beforeEach: BeforeEach) {
    this.beforeEach = beforeEach;
  }

  /** 跳转使用守卫进行鉴权，如果被重定向到其他页面，则刷新跳转参数 */
  useBeforeEach({ to, from, target, url, events, success, fail }: any, next) {
    let targetRoute = target;
    let resultUrl = url;
    let resultEvents = events;
    let resultSuccessFn = success;
    let resultErrorHandler = fail;
    this.beforeEach(to, from, (data) => {
      if (typeof data === "boolean" && !data) {
        return;
      }
      if (typeof data === "string") {
        targetRoute = getRouteByName(data, this.routes);
        resultUrl = validateRoute(data, null, targetRoute, "push");
      }
      if (typeof data === "object") {
        targetRoute = getRouteByName(data.name, this.routes);
        resultUrl = validateRoute(data.name, data.query, targetRoute, "push");
        resultEvents = data.events;
        resultSuccessFn = data.success;
        resultErrorHandler = data.fail;
      }
      next({
        finalTarget: targetRoute,
        finalUrl: resultUrl,
        resultEvents,
        successHandler: resultSuccessFn,
        errHandler: resultErrorHandler,
      });
    });
  }

  /** navigateTo跳转页面，如果目标是tabBar页面，则使用switchTab */
  push(routeConfig: RouteConfig) {
    const { name = "", query, events, success, fail } = routeConfig;
    const targetRoute: Route = getRouteByName(name, this.routes);
    const fromPage = this.getCurrentPage();
    const url = validateRoute(name, query, targetRoute, "push");
    this.useBeforeEach(
      {
        to: name,
        from: fromPage.name,
        target: targetRoute,
        url,
        events,
        success,
        fail,
      },
      ({ finalTarget, finalUrl, resultEvents, successHandler, errHandler }) => {
        wx[finalTarget.isTabBar ? "switchTab" : "navigateTo"]({
          url: finalUrl,
          events: resultEvents,
          success(response: NavigateResponse) {
            successHandler && successHandler(response);
          },
          fail(err) {
            errHandler && errHandler(err);
          },
        });
      }
    );
  }

  /** 使用redirectTo重定向页面 */
  async replace(routeConfig: RouteConfig) {
    const { name = "", query } = routeConfig;
    const targetRoute: Route = this.routes.find((route) => route.name === name);
    const url = validateRoute(name, query, targetRoute, "replace");
    const fromPage = this.getCurrentPage();
    this.useBeforeEach(
      { to: name, from: fromPage.name, target: targetRoute, url },
      ({ finalUrl }) => {
        wx.redirectTo({
          url: finalUrl,
        });
      }
    );
  }

  /** 使用reLaunch装载页面 */
  async reLaunch(routeConfig: RouteConfig) {
    const { name = "", query } = routeConfig;
    const targetRoute: Route = this.routes.find((route) => route.name === name);
    const fromPage = this.getCurrentPage();
    const url = validateRoute(name, query, targetRoute, "reLaunch");
    this.useBeforeEach(
      { to: name, from: fromPage.name, target: targetRoute, url },
      ({ finalUrl }) => {
        wx.reLaunch({
          url: finalUrl,
        });
      }
    );
  }

  /** 后退 */
  // eslint-disable-next-line
  async back(delta: number) {
    wx.navigateBack({
      delta,
    });
  }

  /** 获取当前页面信息 */
  // eslint-disable-next-line
  getCurrentPage() {
    const pages = getCurrentPages();
    const len = pages.length;
    return getRouteByPath(pages[len - 1].route, this.routes);
  }

  /** 获取当前页面的参数信息 */
  // eslint-disable-next-line
  getQuery() {
    const pages = getCurrentPages();
    const len = pages.length;
    const route = pages[len - 1];
    return route.options;
  }
}
