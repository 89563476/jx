import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-spinners/BeatLoader";
import { changeIframeSrc, iframeSrcSelector, keyCountSelector } from "../../stores/parse";
import styles from "./VideoIframe.module.css";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function VideoIframe() {
    const iframeSrc = useSelector(iframeSrcSelector)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    const ref = useRef<HTMLIFrameElement>(null);

    const onLoad = useCallback(() => {
        setLoading(false)
    }, [])

    const keyCount = useSelector(keyCountSelector)


    useEffect(() => {
        dispatch(changeIframeSrc(false))
    }, [])


    useEffect(() => {
        if (iframeSrc !== undefined) {
            setLoading(true)
            ref.current?.contentWindow?.location.replace(iframeSrc)
        }
    }, [iframeSrc, keyCount])

    return (
        <>
            <iframe className={styles.Iframe} ref={ref} key={keyCount} onLoad={onLoad} allowFullScreen={true} title="" src="about:blank" />
            <div className={styles.Loading} style={{ display: loading ? "flex" : "none" }}>
                <Loader
                    color="#4096ff"
                    loading={true}
                    cssOverride={override}
                    size={24}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </>
    )
}