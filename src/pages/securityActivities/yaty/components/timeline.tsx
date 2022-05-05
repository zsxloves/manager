import React, { useState, useImperativeHandle } from 'react';
import style from './style.less';
import { Slider, Row, Col, message } from 'antd';
export interface FormInfos {}
//定义props的类型
interface Props {
  disabled: boolean;
  showPlanYa: Function;
  changeYa: Function;
  setChangeId: Function;
}
interface RefTypes {
  timeValue: any;
  setLi: Function;
  changeNowClick: Function;
}
let nowSet: any = false;
const Timeline = React.forwardRef<RefTypes, Props>((props, ref) => {
  const [timeValue, setTimeValue] = useState<any>([0, 0]);
  const times = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];
  const timeshow = times.map((item, index) => {
    return (
      <Col span={1} key={index}>
        <p />
        <span>{item}</span>
      </Col>
    );
  });
  const changeSlider = (value: any) => {
    setTimeValue(value);
    console.log(value);
  };
  const changeNowClick = (flag: any) => {
    nowSet = flag;
  };
  const [lis, setLis] = useState<any>('');
  const clickMenu = (item: any, newArr: any) => {
    if (nowSet) {
      message.error('请先提交当前预案或返回');
      return;
    }
    nowSet = true;
    props.showPlanYa(item);
    const newTime = [Number(item.startTimeNumber), Number(item.endTimeNumber)];
    setTimeValue(newTime);
    props.changeYa(item, newArr);
    props.setChangeId(item.id);
  };
  const setLi = (arr: any) => {
    const timeArr: any = [];
    arr.forEach((item: any) => {
      const newTime = [Number(item.startTimeNumber), Number(item.endTimeNumber)];
      timeArr.push(newTime);
    });
    const endLi = arr.map((item: any, index: any) => {
      const width = (timeArr[index][1] - timeArr[index][0]) * 25 + 'px';
      const left = timeArr[index][0] * 25 + 'px';
      return (
        <li onClick={() => clickMenu(item, arr)} style={{ width: width, left: left }} key={index} />
      );
    });
    setLis(endLi);
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    timeValue,
    setLi,
    changeNowClick,
  }));
  return (
    <>
      <div className={style.tyContent}>
        <Slider
          range
          value={timeValue}
          step={1}
          max={48}
          onChange={changeSlider}
          disabled={props.disabled}
        />
        <Row className={style.timet}>{timeshow}</Row>
        <div className={style.yaUl}>
          <ul>{lis}</ul>
        </div>
      </div>
    </>
  );
});
export default Timeline;
