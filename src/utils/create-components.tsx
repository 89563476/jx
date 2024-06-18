import ReactDOM from 'react-dom/client';
import FloatIcon from '../components/FloatIcon/FloatIcon';
import Store from '../components/Store/Store';
// import './index.css';
import { playerContainer } from '../player-container';
import { GM_addStyle } from '$';
import VideoIframe from '../components/VideoIframe/VideoIframe';
import { StrictMode } from 'react';

export function createFloatIcon() {
    const container = ReactDOM.createRoot((() => {
        if (location.host === "www.mgtv.com") {
            GM_addStyle(".m-playwrap .video{overflow:visible !important}")
        }
        const app = document.createElement('div');
        app.id = "lx-video-app"
        app.style.position = "absolute"
        if (location.host === "v.youku.com") {
            app.style.zIndex = "2000"
        } else {
            app.style.zIndex = "1001"
        }
        app.style.top = "0"
        const container = document.querySelector(playerContainer!.container) as HTMLElement

        updateAppLeft()
        function updateAppLeft() {
            let left = ""
            if (container.getBoundingClientRect().left > 32) {
                left = `-32px`
            } else {
                left = "-" + container.getBoundingClientRect().left + "px"
            }
            if (app.style.left !== left) {
                app.style.left = left
            }
        }

        window.addEventListener("fullscreenchange", updateAppLeft);
        window.addEventListener("resize", updateAppLeft)


        container.style.overflow = "visible"
        if (location.href.match("https://www.bilibili.com/")) {
            container.style.zIndex = "101";
        }

        container.append(app);

        return app
    })());
    container.render(
        <StrictMode>
            <Store>
                <FloatIcon />
            </Store>
        </StrictMode>,
    )
};

export function createVideo() {
    const container = ReactDOM.createRoot(
        (() => {
            const app = document.createElement('div');
            app.style.width = "100%";
            app.style.height = "100%";
            app.id = "lx-video-iframe"
            app.style.position = "absolute"
            app.style.top = "0"
            app.style.left = "0"
            if (location.host === "www.iqiyi.com") {
                app.style.zIndex = "9"
            } else if (location.host === "v.youku.com") {
                app.style.zIndex = "1300"
            } else if (location.host === "www.mgtv.com") {
                app.style.zIndex = "100"
            } else {
                app.style.zIndex = "999"
            }
            app.style.backgroundColor = "#000"
            let container = document.querySelector(playerContainer!.container) as HTMLElement
            container.append(app);
            return app;
        })(),
    );
    container.render(
        <StrictMode >
            <Store>
                <VideoIframe />
            </Store >
        </StrictMode>,
    );

}