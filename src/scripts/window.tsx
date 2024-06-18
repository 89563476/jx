import { GM_addStyle } from "$";
import { playerContainer } from "../player-container";
import { handleUrlListener, hideElement, hideVideoContainer, videoTagHandle } from "../utils";
import { findTargetElement } from "../utils/common";
import { createFloatIcon, createVideo } from "../utils/create-components";
import { addWindowHotkeys } from "../utils/my-hotkeys";


export function main() {
  videoTagHandle();

  hideElement(playerContainer!.displayNodes.join(","));
  GM_addStyle(".lx-ant-message{z-index: 9999;position:absolute;width:100%;};");
  GM_addStyle(".ant-modal-wrap,.ant-notification{z-index: 99999 !important;}");
  hideVideoContainer(playerContainer!.container.split(",").map(item => `${item}:not([class~="lx"])`).join(","));

  findTargetElement(playerContainer!.container).then(function (container: HTMLElement) {

    setTimeout(() => {
      container.classList.add("lx");

      createFloatIcon();

      createVideo();
    }, 150);

    handleUrlListener();

    addWindowHotkeys();
  });
}
