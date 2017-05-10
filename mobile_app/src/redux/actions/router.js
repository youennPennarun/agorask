/* @flow */
export const PUSH = 'ROUTER_PUSH';
export const POP = 'ROUTER_POP';
export const TRANSITION_START = 'ROUTER_TRANSITION_START';
export const TRANSITION_END = 'ROUTER_TRANSITION_END';


export function login() {
  return pushRoute({key: 'login'});
}

export function pushRoute(route: Object = {}) {
  const routeConfig = {
    ...route,
    routeKey: route.key
  };
  return {
    type: PUSH,
    route: routeConfig,
  };
}

export function popRoute() {
  return {
    type: POP,
  };
}

export function transitionStart() {
  return {
    type: TRANSITION_START,
  };
}

export function transitionEnd() {
  return {
    type: TRANSITION_END,
  };
}

