import { hideElement } from "../utils";
import { addIframeHotkeys } from "../utils/my-hotkeys";


export function main() {
  function delayHideElement() {
    setTimeout(() => hideElement("#adv_wrap_hh"), 100);
  }
  if (location.href.match("https://jx.jsonplayer.com") ||
    location.href.match("https://jx.xmflv.com") ||
    location.href.match("https://jyjx.wevip.cc") ||
    location.href.match("https://jy3.we-vip.com") ||
    location.href.match("https://playerjy.woxiande.com:21089") ||
    location.href.match("https://jx.777jiexi.com")) {
    delayHideElement();
  } else if (location.href.match("https://jx.yangtu.top")) {
    hideElement(".art-state,#HMCOVER_ID1");
    delayHideElement();
  } else if (location.href.match("https://bd.jx.cn")) {
    hideElement(".pause-ad");
  }
  addIframeHotkeys();
}

