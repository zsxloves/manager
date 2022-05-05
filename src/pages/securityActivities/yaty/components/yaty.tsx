import { useEffect, useState, useRef, useImperativeHandle } from 'react';
import React from 'react';

import style from './../style.less';
import { Select } from 'antd';
import { Slider, Row, Col, Button } from 'antd';

const { Option } = Select;

//定义props的类型
interface Props {
  showYaty: boolean;
  showTables: Function;
  yatyData: any;
  setYatyDetail: Function;
  goBackLeft: Function;
}
interface RefTypes {
  handelClick: Function;
}
let timer: any = null;
const Yatyshow = React.forwardRef<RefTypes, Props>((props, ref) => {
  const [speed, setSpeed] = useState<number>(1);
  const listNum = [
    { name: 'x1', value: 1 },
    { name: 'x2', value: 2 },
    { name: 'x3', value: 3 },
    { name: 'x5', value: 5 },
    { name: 'x10', value: 10 },
    { name: 'x20', value: 20 },
    { name: 'x60', value: 60 },
    { name: 'x120', value: 120 },
  ];
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
  const speedOptions = listNum.map((item, index) => {
    return (
      <Option value={item.value} key={index}>
        {item.name}
      </Option>
    );
  });
  const timeshow = times.map((item, index) => {
    return (
      <Col span={1} key={index}>
        <p></p>
        <span>{item}</span>
      </Col>
    );
  });
  const [nowData, setNowData] = useState<string>('');
  const [nowTime, setNowTime] = useState<string>('00:00:00');
  const [timeValue, setTimeValue] = useState<any>(0);
  const timerString = useRef<string>('00:00:00');
  const endClick = () => {
    if (timer) {
      clearInterval(timer);
      timer = '';
    }
  };
  const timeAdd = () => {
    const time = timerString.current.split(':');
    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);
    let seconds = parseInt(time[2]);
    let nowSecond = '',
      nowMinute = '',
      nowHour = '';
    if (hours === 23 && minutes === 59 && seconds === 59) {
      if (timer) {
        clearInterval(timer);
      }
      return;
    }
    seconds++;
    if (seconds < 10) {
      nowSecond = '0' + seconds;
      if (minutes < 10) {
        nowMinute = '0' + minutes;
      } else {
        nowMinute = '' + minutes;
      }
      if (hours < 10) {
        nowHour = '0' + hours;
      } else {
        nowHour = '' + hours;
      }
    } else if (seconds === 60) {
      nowSecond = '00';
      minutes++;
      if (minutes === 60) {
        nowMinute = '00';
        hours++;
        if (hours < 10) {
          nowHour = '0' + hours;
        } else {
          nowHour = '' + hours;
        }
      } else if (minutes < 10) {
        nowMinute = '0' + minutes;
        if (hours < 10) {
          nowHour = '0' + hours;
        } else {
          nowHour = '' + hours;
        }
      } else {
        nowMinute = '' + minutes;
        if (hours < 10) {
          nowHour = '0' + hours;
        } else {
          nowHour = '' + hours;
        }
      }
    } else {
      nowSecond = '' + seconds;
      if (minutes < 10) {
        nowMinute = '0' + minutes;
      } else {
        nowMinute = '' + minutes;
      }
      if (hours < 10) {
        nowHour = '0' + hours;
      } else {
        nowHour = '' + hours;
      }
    }
    timerString.current = nowHour + ':' + nowMinute + ':' + nowSecond;

    const timeNum = hours * 60 * 60 + minutes * 60 + seconds;
    const value = parseInt(((timeNum / (24 * 60 * 60)) * 100).toFixed(2));
    setTimeValue(value);

    const param: any = [];
    props.yatyData.forEach((item: any) => {
      const timeOne = Number(item?.startTimeNumber) * 30 * 60;
      const timeTwo = Number(item?.endTimeNumber) * 30 * 60;
      if (timeOne <= timeNum && timeTwo >= timeNum) {
        param.push(item.planId);
      }
    });
    props.setYatyDetail(param);
  };
  // 设置时间改变
  const changeYatyTime = (val: number) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    const timeSpeed = 1000 / val;
    timer = setInterval(() => {
      // console.log(val)
      timeAdd();
      setNowTime(timerString.current);
    }, timeSpeed);
  };
  // 时间改变
  const changeTime = (value: any) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    console.log(value);
    const time = (value * (24 * 60 * 60)) / 100;
    const hour = time / (60 * 60);
    const minute = (time % (60 * 60)) / 60;
    const second = (time % (60 * 60)) % 60;
    let hours = '',
      minutes = '',
      seconds = '';
    if (second < 10) {
      seconds = '0' + second;
    } else {
      seconds = '' + second;
    }
    if (minute < 10) {
      minutes = '0' + minute;
    } else {
      minutes = '' + minute;
    }
    if (hour < 10) {
      hours = '0' + hour;
    } else {
      hours = '' + hour;
    }
    timerString.current = hours + ':' + minutes + ':' + seconds;
    changeYatyTime(speed);
  };
  const showTable = () => {
    props.showTables();
  };
  const goBack = () => {
    if (timer) {
      clearInterval(timer);
    }
    props.goBackLeft();
  };
  const setSpeeds = (val: any) => {
    setSpeed(val);
    changeYatyTime(val);
  };
  useEffect(() => {
    let formatDateTime: any = new Date();
    formatDateTime =
      formatDateTime.getFullYear() +
      '-' +
      (formatDateTime.getMonth() + 1 > 9
        ? formatDateTime.getMonth() + 1
        : '0' + (formatDateTime.getMonth() + 1)) +
      '-' +
      (formatDateTime.getDate() > 9 ? formatDateTime.getDate() : '0' + formatDateTime.getDate());
    setNowData(formatDateTime);
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const handelClick = () => {
    changeYatyTime(1);
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    handelClick,
    endClick,
  }));
  return (
    <div>
      {props.showYaty ? (
        <div className={style.yabox}>
          <div className={style.tyTop}>
            <div className={style.left}>
              <span>
                推演时间：{nowData} {nowTime}
              </span>
            </div>
            <div className={style.right}>
              <Select value={speed} className={style.timeSelect} onChange={setSpeeds}>
                {speedOptions}
              </Select>
              <Button type="primary" onClick={showTable}>
                日程
              </Button>
              <Button type="primary" onClick={goBack} style={{ marginLeft: '16px' }}>
                返回左侧列表
              </Button>
            </div>
            <div style={{ clear: 'both' }} />
          </div>
          <div className={style.tyContent}>
            <Slider value={timeValue} onChange={changeTime} />
            <Row className={style.timet}>{timeshow}</Row>
          </div>
        </div>
      ) : null}
    </div>
  );
});
export default Yatyshow;
