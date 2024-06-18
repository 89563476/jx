import { GM_addStyle } from "$";
import { playerContainer } from "../player-container";
import { store } from "../stores";
import { changeIframeSrc, setHistory } from "../stores/parse";
import { findTargetElement } from "./common";
import { createFloatIcon, createVideo } from "./create-components";
import { urlListener } from "./url-listener";

export function hideElement(selector: string) {
  GM_addStyle(
    `${selector}{visibility: hidden !important; background-color: black;}`
  );
}

export function hideVideoContainer(selector: string) {
  GM_addStyle(
    `${selector}{background-color: black !important;}`
  );
  GM_addStyle(
    `${selector.split(",").map(item => `${item} > *`)}{display: none !important;background-color: black !important;}`
  );
}

export function videoTagHandle() {
  findTargetElement(playerContainer?.container.split(",").map(item => item + " video").join(",") as string, {
    isAll: true,
    tryTime: 3000
  }).then((items: NodeListOf<HTMLVideoElement>) => {
    for (const video of items) {
      function pause() {
        video.muted = true
        if (!video.paused) {
          video.pause()
        }
        setTimeout(() => video.remove(), 300)
      }
      pause()
      video.addEventListener("playing", pause)
    }
  })
}

export function nextVod() {
  switch (location.host) {
    case "v.qq.com":
      document.querySelector<HTMLElement>(".txp_btn_next_u")!.click()
      break
    case "www.iqiyi.com":
      document.querySelector<HTMLElement>(".iqp-btn-next")!.click()
      break
    case "v.youku.com":
      document.querySelector<HTMLElement>(".kui-next-icon-0")!.click()
      break
    case "www.mgtv.com":
      document.querySelector<HTMLElement>(".icon-next")!.click()
      break
    case "www.bilibili.com":
      document.querySelector<HTMLElement>(".bpx-player-ctrl-next")!.click()
      break
  }
}

export function getIframeWindow() {
  try {
    const iframe: HTMLIFrameElement | undefined | null = document
      .querySelector(playerContainer!.container)
      ?.querySelector("#lx-video-iframe iframe");
    if (iframe != null) {
      return iframe;
    }
  } catch {
    return null;
  }
  return null;
}


export function handleUrlListener() {
  let localHref = location.href
  urlListener(() => {
    if (localHref != location.href) {
      localHref = location.href
      videoTagHandle()

      setTimeout(() => {
        store.dispatch(changeIframeSrc(true))
        findTargetElement(playerContainer!.container).then(container => {
          container.classList.add("lx")

          if (document.querySelector("#lx-video-iframe") == null) {
            createVideo()
          }

          if (document.querySelector("#lx-video-app") == null) {
            createFloatIcon()
          }
        })

        store.dispatch(setHistory())

      }, 150)
    }
  })

}


