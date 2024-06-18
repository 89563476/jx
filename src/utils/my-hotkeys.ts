import { message, notification } from "antd";
import hotkeys, { HotkeysEvent } from "hotkeys-js";
import { getIframeWindow, nextVod } from ".";
import { default as list } from "../parse-list";
import { store } from "../stores";
import { currentActiveIndex, jumpRecentSelection, setActiveIndex } from "../stores/parse";
import { NOTIFICATION_KEY } from "./common";

function playFirst() {
  store.dispatch(setActiveIndex(0));
}

function replay() {
  store.dispatch(setActiveIndex(store.getState().parse.activeIndex));
}

function playNext() {
  let index = store.getState().parse.activeIndex;
  if (index != null) {
    index++;
    if (index >= list.length) {
      index = 0;
    }
  }
  store.dispatch(setActiveIndex(index));
}

function playPrev() {
  let index = store.getState().parse.activeIndex;
  if (index != null) {
    index--;
    if (index < 0) {
      index = list.length - 1;
    }
  }
  store.dispatch(setActiveIndex(index));
}

function playFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    const elem = document.querySelector(".yzmplayer,.dplayer");
    if (elem != null) elem.requestFullscreen();
    else document.documentElement.requestFullscreen();
  }
  return false;
}

function funJumpRecentSelection() {
  store.dispatch(jumpRecentSelection())
}

function funCloseJumpRecentSelection() {
  notification.destroy(NOTIFICATION_KEY)
}


interface IDataItem {
  key: string;
  func: () => void;
}

const data: IDataItem[] = [
  {
    key: "r",
    func: playFirst,
  },
  {
    key: "c",
    func: () => store.dispatch(currentActiveIndex()),
  },
  {
    key: "q,.",
    func: playNext,
  },
  {
    key: ",",
    func: playPrev,
  },
  {
    key: "f",
    func: playFullscreen,
  },
  {
    key: "n",
    func: nextVod,
  },
  {
    key: "e",
    func: funJumpRecentSelection,
  },
  {
    key: "w",
    func: funCloseJumpRecentSelection,
  },
];

export function addWindowHotkeys() {
  window.addEventListener(
    "message",
    function (e) {
      if (e.data.message === "videoPausedMessage") {
        message.error("请先播放视频，再使用画中画");
      }
      for (const item of data) {
        if (e.data.message === item.func.name) {
          item.func();
          break;
        }
      }
    },
    false
  );

  for (const item of data) {
    hotkeys(
      item.key,
      { element: document.body },
      function (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) {
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        if (item.func === playFullscreen) {
          // alert(getIframeWindow()?.contentWindow?.window.fullScreen);
          const doc = getIframeWindow();
          // console.log(doc);
          // alert(doc?.contentWindow);

          // document.querySelector("#player-container #lx-video-iframe");
          doc &&
            doc.contentWindow?.postMessage(
              { message: playFullscreen.name },
              "*"
            );
        } else {
          item.func && item.func();
        }
      }
    );
  }
}

export function addIframeHotkeys() {
  // 覆盖样式
  // GM_addStyle("iframe{position: fixed !important; width: 100vw !important; height: 100vh !important; top: 0 !important; left: 0 !important; z-index: 99999999 !important;background-color: black;}")

  const win = window.top;
  if (win !== null) {
    // 清理ok解析左上角按钮
    window.fullScreen = playFullscreen;

    window.addEventListener(
      "message",
      function (e) {
        e.preventDefault();
        if (e.data.message === undefined) {
          return;
        }
        if (e.data.message === "playFullscreen") {
          // alert(location.href);
          const videoElement = document.querySelector("video");
          const frameElement: HTMLIFrameElement | null =
            document.querySelector("iframe");
          if (videoElement != null) {
            playFullscreen();
            // (
            //   document.querySelector(".yzmplayer-full-icon") as HTMLElement
            // )?.click();
          } else if (frameElement != null) {
            frameElement?.contentWindow?.postMessage(
              { message: playFullscreen.name },
              "*"
            );
          }
        } else if (e.data.message === "currentActive") {
          const videoElement = document.querySelector("video");
          const frameElement: HTMLIFrameElement | null =
            document.querySelector("iframe");
          if (videoElement != null) {
            message.success({
              style: {
                zIndex: 999999,
                marginTop: "30px",
              },
              key: "currentActive",
              content: e.data.data,
            });
          } else if (frameElement != null) {
            frameElement?.contentWindow?.postMessage(e.data, "*");
          }
        } else if (e.data.message === "videoPictureInPicture") {
          // window.focus()
          const video = document.querySelector("video");
          if (video) {
            // video.play().then(() => {
            //
            // })
            video.requestPictureInPicture();

            // if (video.paused) {
            //     win.postMessage({message: "videoPausedMessage"}, "*")
            // } else {
            //     video.requestPictureInPicture()
            // }
          } else {
            const frameElement = document.querySelector("iframe");
            if (frameElement) {
              frameElement?.contentWindow?.postMessage(
                { message: e.data.message },
                "*"
              );
            }
          }
        }
      },
      false
    );

    window.addEventListener("dblclick", function (event) {
      return playFullscreen();
    });

    for (const item of data) {
      hotkeys(item.key, function (event, handler) {
        event.preventDefault();
        event.stopPropagation();
        if (item.func === playFullscreen) {
          playFullscreen();
        } else {
          win.postMessage({ message: item.func.name }, "*");
        }
      });
    }
  }
}
