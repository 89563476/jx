import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
import monkey from "vite-plugin-monkey";
import react from '@vitejs/plugin-react'
import { version } from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        version,
        name: "靳十二VIP视频解析 长期更新 免费观看",
        description:
          "🔥支持腾讯视频、爱奇艺、优酷、土豆、芒果TV、搜狐视频、乐视视频、PPTV、风行、华数TV、哔哩哔哩等，🔥支持多个解析接口切换，支持视频自由选集，🔥自动解析视频，🔥支持自定义拖拽位置，🔥支持视频广告跳过，🔥支持页内解析",
        author: "jin12",
        icon: "data:image/png;base64,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",
        namespace: "#",
        license: "MIT",
        match: [
          "https://v.qq.com/x/cover/*",
          "https://www.iqiyi.com/v_*",
          "https://v.youku.com/v_show/*",
          "https://www.mgtv.com/b/*",
          "https://www.bilibili.com/bangumi/play/*",
        ],
        include: ["/^http(s?):\/\/.*?(url|vid|jx|v|ref)=http(s?):\/\/.*$/"],
        "run-at": "document-end",
      },
      build: {
        systemjs: "inline",
        externalGlobals: {

        },
      },
    }),
  ],
  build: {
    minify: true
  }
});
