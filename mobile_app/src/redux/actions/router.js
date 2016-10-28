export const PUSH = 'ROUTER_PUSH';
export const POP = 'ROUTER_POP';


export function pushRoute(name: String, props: Object = {}) {
  return {
    type: PUSH,
    nextRoute: {
      name,
      props,
    },
  };
}


export function popRoute() {
  return {
    type: POP,
  };
}


