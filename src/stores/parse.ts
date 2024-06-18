import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import { type RootState } from ".";
import parseList from "../parse-list";
import { getPid, playerContainer } from "../player-container";
import { NOTIFICATION_KEY } from "../utils/common";


const key = "CURRENT_ACTIVE";
interface ParseState {
  activeIndex: number;
  iframeSrc?: string;
  keyCount: number;
  history: {
    [key: string]: {
      activeIndex?: number
      href?: string
      time?: number
    }
  },
  hasRecentSelection: boolean,
  cacheHref?: string,
  pid?: string
}

const initialState: ParseState = {
  activeIndex: 0,
  iframeSrc: undefined,
  keyCount: 0,
  history: {},
  hasRecentSelection: true,
  cacheHref: undefined,
  pid: undefined
};

function currentActiveFun(index: number) {
  message.config({
    prefixCls: "lx-ant-message",
    getContainer: () =>
      document.querySelector(playerContainer!.container) as HTMLElement,
  });
  message.success({
    // className: "lx-ant-message",
    style: {
      zIndex: 999999,
      marginTop: "30px",
      position: "relative",
    },
    // duration: 9999,
    key,
    content: `当前线路：${parseList[index].name}`,
  });
  // const doc = getIframeWindow();
  // doc &&
  //   doc.contentWindow?.postMessage(
  //     { message: "currentActive", data: `当前线路：${parseList[index].name}` },
  //     "*"
  //   );
}

function initHistoryItemFun(state: ParseState) {
  if (state.pid != undefined && state.history[state.pid] == undefined) {
    state.history[state.pid] = {}
  }
}

function setHistoryFun(state: ParseState) {
  if (!state.hasRecentSelection) {
    initHistoryItemFun(state)
    if (state.pid !== undefined && state.history[state.pid].href !== location.href) {
      state.history[state.pid].href = location.href
      state.history[state.pid].time = Date.now()
    }
  }
}

let oneDayTime = 24 * 3600 * 1000; //一天的总毫秒数
function clearHistoryFun(state: ParseState) {
  let nowTime = Date.now(); //当前的时间戳
  let comTime = nowTime - oneDayTime * 30;
  for (const item in state.history) {
    if (state.history[item].time != undefined && <number>state.history[item].time < comTime) {
      delete state.history[item]
    }
  }
}

function initActiveIndexFun(state: ParseState) {
  state.pid = getPid()
  if (state.pid != undefined && Object.hasOwn(state.history, state.pid) && state.history[state.pid].activeIndex !== undefined) {
    const activeIndex = <number>state.history[state.pid].activeIndex
    state.activeIndex = activeIndex < parseList.length ? activeIndex : 0
  }
}

function closeJumpRecentSelectionFun() {
  notification.destroy(NOTIFICATION_KEY)
}


export const parseSlice = createSlice({
  name: "parse",
  initialState,
  reducers: {
    setCacheHref(state, action: PayloadAction<string | undefined>) {
      state.cacheHref = action.payload
    },
    setHistory: setHistoryFun,
    clearHistory: clearHistoryFun,
    incrementKeyCount(state) {
      state.keyCount++;
    },
    initActiveIndex: initActiveIndexFun,
    setHasRecentSelection(state: ParseState, action: PayloadAction<boolean>) {
      state.hasRecentSelection = action.payload
      if (!action.payload) {
        setHistoryFun(state)
      }
    },
    setActiveIndex(state, action: PayloadAction<number>) {
      state.activeIndex = action.payload;
      state.iframeSrc =
        parseList[action.payload].url + window.top!.location.href;
      state.keyCount++;
      currentActiveFun(action.payload);

      initHistoryItemFun(state)
      if (state.pid != undefined) {
        state.history[state.pid].activeIndex = action.payload
        state.history[state.pid].time = Date.now()
      }
    },
    currentActiveIndex(state) {
      currentActiveFun(state.activeIndex);
    },
    changeIframeSrc(state, action: PayloadAction<boolean>) {
      state.iframeSrc =
        parseList[state.activeIndex].url + window.top!.location.href;
      if (action.payload) {
        state.keyCount++;
      }
    },
    jumpRecentSelection(state) {
      if (state.cacheHref != undefined) {
        closeJumpRecentSelectionFun()
        if (state.pid !== undefined) {
          state.history[state.pid].href = undefined
        }
        location.href = state.cacheHref
      }
    },
    closeJumpRecentSelection: closeJumpRecentSelectionFun
  },
  // extraReducers: (builder) => {

  // },
});

export const {
  setActiveIndex,
  currentActiveIndex,
  changeIframeSrc,
  incrementKeyCount,
  initActiveIndex,
  setHistory,
  clearHistory,
  setHasRecentSelection,
  jumpRecentSelection,
  closeJumpRecentSelection,
  setCacheHref
} = parseSlice.actions;

export const activeIndexSelector = (state: RootState) => state.parse.activeIndex;
export const iframeSrcSelector = (state: RootState) => state.parse.iframeSrc;
export const keyCountSelector = (state: RootState) => state.parse.keyCount;
export const pidSelector = (state: RootState) => state.parse.pid;
export const hrefSelector = (state: RootState) => state.parse.history[<string>state.parse.pid]?.href;

export default parseSlice.reducer;

