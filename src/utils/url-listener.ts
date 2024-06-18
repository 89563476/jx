const pushState = window.history.pushState;
const replaceState = window.history.replaceState;

const urlListener = (callback: ({ state }: any) => void) => {
  window.addEventListener("hashchange", callback, false);
  window.addEventListener("popstate", callback, false);

  window.history.pushState = (state, ...args) => {
    const returnValue = pushState.apply(history, <any>[state].concat(args));
    callback({ state });
    return returnValue;
  };

  window.history.replaceState = (state, ...args) => {
    const returnValue = replaceState.apply(history, <any>[state].concat(args));
    callback({ state });
    return returnValue;
  };
};
const unUrlListener = (callback: ({ state }: any) => void) => {
  window.removeEventListener("hashchange", callback, false);
  window.removeEventListener("popstate", callback, false);
  window.history.pushState = pushState;
  window.history.replaceState = replaceState;
};
export { urlListener, unUrlListener };
