interface FindElementOption {
  isAll?: boolean;
  tryTime?: number;
  maxTryTime?: number;
}

export const NOTIFICATION_KEY = "lx-notification-key"

export async function findTargetElement(
  selector: string,
  option: FindElementOption = {}
): Promise<any> {
  // for (let index = 0; index < 100; index++) {
  //   const el = option.isAll
  //     ? document.querySelectorAll(selector)
  //     : document.querySelector(selector);
  //   if (option.isAll ? (<NodeListOf<Element>>el).length > 0 : el) {
  //     return Promise.resolve(el);
  //   }
  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 100);
  //   });
  // }
  // return Promise.reject(null);

  return new Promise((resolve, reject) => {
    let timer: null | number = null;
    let count = 100;

    function clear() {
      if (timer != null) {
        clearInterval(timer);
        timer = null;
      }
    }

    function findElement() {
      // console.log("findElement()");
      const el = option.isAll
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);
      if (option.isAll ? (<NodeListOf<Element>>el).length > 0 : el) {
        clear();
        return resolve(el);
      }
      if (--count <= 0) {
        clear();
      }
    }

    timer = setInterval(findElement, 100);
  });
}
