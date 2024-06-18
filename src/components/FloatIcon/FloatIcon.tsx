import { Button, Col, Row, Space, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Icon from "../../assets/icon.png";
import styles from './FloatIcon.module.css';


import parseList from '../../parse-list';
import { store } from '../../stores';
import { activeIndexSelector, clearHistory, hrefSelector, initActiveIndex, jumpRecentSelection, pidSelector, setActiveIndex, setCacheHref, setHasRecentSelection } from '../../stores/parse';
import { NOTIFICATION_KEY } from '../../utils/common';

export default function FloatIcon() {
  const dispatch = useDispatch()

  const activeIndex = useSelector(activeIndexSelector)
  const href = useSelector(hrefSelector)
  const pid = useSelector(pidSelector)
  const state = store.getState().parse

  const [isHide, setIsHide] = useState(true)



  useEffect(() => {
    dispatch(initActiveIndex())
  }, [])

  useEffect(() => {
    if (pid != undefined) {
      const Btn = (
        <Space>
          <Button type="link" onClick={() => {
            notification.destroy(NOTIFICATION_KEY)
          }}>
            否（W）
          </Button>
          <Button type="primary" onClick={() => {
            dispatch(jumpRecentSelection())
          }}>
            是（E）
          </Button>
        </Space>
      );

      if (Object.hasOwn(state.history, pid) && href !== undefined && href !== location.href) {
        dispatch(setCacheHref(href))
        notification.open({
          key: NOTIFICATION_KEY,
          message: '通知',
          description:
            '是否跳转到最近观看的选集？',
          btn: Btn,
          duration: 30,
          style: { zIndex: 999999 },
          onClose() {
            dispatch(setCacheHref(undefined))
          }
        });
      }
      dispatch(setHasRecentSelection(false))
      dispatch(clearHistory())
    }
  }, [pid])

  const hide = useCallback(() => {
    setIsHide(true)
  }, [])

  const show = useCallback(() => {
    setIsHide(false)
  }, [])

  return (
    <div className={styles.FloatIcon} >
      <div style={{ position: "relative" }} onMouseEnter={show} onMouseLeave={hide}>
        <img src={Icon} width={32} height={32} style={{ cursor: "pointer" }} ></img>
        <div style={{ position: "absolute", top: 0, left: 32, width: 200, zIndex: 1, backgroundColor: "#fff", borderRadius: 4, border: "1px solid #f5f5f5", boxShadow: "rgba(0, 0, 0, 0.04) 0px 12px 32px 4px, rgba(0, 0, 0, 0.08) 0px 8px 20px" }}
          className={isHide ? styles.Hidden : styles.Visible}>
          <Row justify="start" style={{ padding: 8, backgroundColor: "#f5f7fa", borderTopLeftRadius: 4, borderTopRightRadius: 4, }}>
            <Col flex="auto" style={{ fontWeight: "bold", color: "#000" }}>落雪视频解析</Col>
            {/* <Col flex="none"> */}
            {/* <Switch defaultChecked onChange={onChange} /> */}
            {/* </Col> */}
          </Row>
          <Row gutter={8} style={{ margin: 4 }}>
            {parseList.map((item, index) => (
              <Col span={12} style={{ marginTop: 4, marginBottom: 4 }} key={item.name}>
                <a href={item.url + window.top?.location.href} style={{ display: "block", height: "100%" }} onClick={(event) => event.preventDefault()} onContextMenu={event => event.stopPropagation()}>
                  <Button block type={activeIndex === index ? "primary" : "default"} onClick={() => dispatch(setActiveIndex(index))}>{item.name}</Button>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}


