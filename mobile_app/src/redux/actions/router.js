export const PUSH = 'ROUTER_PUSH';
export const POP = 'ROUTER_POP';


export function login() {
  return pushRoute({key: 'login'});
}

export function pushRoute(route: Object = {}) {
  return {
    type: PUSH,
    route,
  };
}


export function popRoute() {
  return {
    type: POP,
  };
}


