import { unsafeWindow } from "$";

interface IPlayerContainer {
  host: string
  container: string
  displayNodes: string[]
  getPid: () => string | undefined
}

export const playerContainers: IPlayerContainer[] = [
  {
    host: "www.iqiyi.com",
    container: "#player,#flashbox",
    displayNodes: [
      "#playerPopup",
      "div[class^=qy-header-login-pop]",
      "section[class^=modal-cover_]",
      ".toast",
      "#modal-vip-cashier-scope",
      `[id^="float-common-"]`,
      `[class^="toast_toast__"]`
    ],
    getPid: function (): string | undefined {
      return unsafeWindow.QiyiPlayerProphetData.videoInfo.albumId
    }
  },
  {
    host: "v.qq.com",
    container: "#mod_player,#player-container",
    displayNodes: ["#mask_layer", ".mod_vip_popup", ".panel-tip-pay", ".login_dialog"],
    getPid: function (): string {
      return (unsafeWindow.__PINIA__.global.coverInfo.video_ids as string[]).find(item => unsafeWindow.__PINIA__.global.currentVid === item) ? unsafeWindow.__PINIA__.global.currentCid : ""
    }
  },
  {
    host: "v.youku.com",
    container: "#ykplayer,#player",
    displayNodes: [
      "#iframaWrapper",
      "#checkout_counter_mask",
      "#checkout_counter_popup",
    ],
    getPid: function (): string {
      return unsafeWindow.__INITIAL_DATA__.showId;
    }
  },
  {
    host: "www.mgtv.com",
    container: "#mgtv-player-wrap",
    displayNodes: [],
    getPid: function (): string {
      return unsafeWindow.__NUXT__.data[0].videoInfo.cid
    }
  },
  {
    host: "www.bilibili.com",
    // container: "#bilibili-player,#player_module,#bilibiliPlayer", // ,
    container: ".bpx-player-video-area", // ,
    displayNodes: [],
    getPid: function (): string {
      return unsafeWindow.__NEXT_DATA__.props.pageProps.dehydratedState.queries[0].state.data.seasonInfo.mediaInfo.media_id ?? ""
    }
  }
];

export function getPlayerContainer() {
  return playerContainers.find((item) => item.host === location.host);
}

export function getPid() {
  return playerContainer!.getPid()
}

export const playerContainer = getPlayerContainer();
