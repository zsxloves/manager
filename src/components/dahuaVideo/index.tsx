import { useEffect, useState } from 'react';
import type { FC } from 'react';
import styles from './index.less';
import { message } from 'antd';
//定义props的类型
interface Props {
  viderUrls: string[] | string;
  onCancel: (falg?: boolean) => void;
}
const DahuaVideo: FC<Props> = (props) => {
  const { viderUrls, onCancel } = props;
  const [showClose, setShowClose] = useState<boolean>(false);
  const DHWsInstance = DHWs.getInstance({
    reConnectCount: 2,
    connectionTimeout: 30 * 1000,
    messageEvents: {
      loginState() {},
    },
  });
  /* 单个 */
  // let lastVideoid = '';
  const login_LightWeight = (videoid: any) => {
    // if(item.videoid) item.id = item.videoid;
    // if(lastVideoid === item.id ){
    //     return;
    // }
    console.log('videoid:', videoid);
    const logindata = {
      loginIp: '41.200.15.56',
      loginPort: '8320',
      userName: 'gldj',
      userPwd: 'gldj123456',
      token: '',
      https: 1,
    };
    DHWsInstance.detectConnectQt().then((res1: any) => {
      if (res1) {
        // 连接客户端成功
        DHWsInstance.login(logindata);
        DHWsInstance.on('loginState', (result: any) => {
          // this.isLogin = res;
          if (result) {
            // this.$Message.success('登录成功');
            // this.activePanel = 'key2';
            // 登录成功后播放视频
            // setPos();
            const params = [
              {
                ctrlType: 'playerWin',
                ctrlCode: 'ctrl1',
                ctrlProperty: {
                  displayMode: 1,
                  splitNum: 1,
                  channelList: [{ channelId: videoid.split('_')[0] }],
                },
                visible: true,
                domId: 'DHLightWeight',
              },
            ];
            DHWsInstance.createCtrl(params)
              .then(() => {
                setShowClose(true);
                // lastVideoid = videoid;
                console.log('正在播放的视频流');
              })
              .catch((e: any) => {
                console.log(e);
                setShowClose(false);
              });
            DHWsInstance.on('createCtrlResult', (res: any) => {
              console.warn(res);
            });
          } else {
            message.error('登录失败');
          }
        });
      } else {
        // 连接客户端失败
        message.error('请重新安装客户端');
      }
    });
  };
  /* 多个 */
  const login_LightWeight_n = (vArr: any) => {
    const vidArr: any[] = [];
    // 默认视角
    // if( parent._CONF['车辆视角'] && parent._CONF['车辆视角'].videoid ){
    //     vidArr.push({ channelId: parent._CONF['车辆视角'].videoid.split('_')[0]});
    // }
    vArr.forEach((item: string) => {
      if (item) {
        vidArr.push({ channelId: item.split('_')[0] });
      }
    });
    console.log('videoIds--未处理:', vArr);
    console.log('videoIds--处理:', vidArr);
    let splitNum = 1;
    if (vArr.length === 1) {
      splitNum = 1;
    } else if (vArr.length > 1 && vArr.length < 5) {
      splitNum = 4;
    } else {
      splitNum = 9;
    }
    const logindata = {
      loginIp: '41.200.15.56',
      loginPort: '8320',
      userName: 'gldj',
      userPwd: 'gldj123456',
      token: '',
      https: 1,
    };
    // let str = '';
    // vidArr.forEach((item: string) => {
    //     str += item;
    // });
    // if(str === lastVideoid){
    // return;
    // }
    DHWsInstance.detectConnectQt().then((res1: any) => {
      if (res1) {
        // 连接客户端成功
        DHWsInstance.login(logindata);
        DHWsInstance.on('loginState', (res: any) => {
          // this.isLogin = res;
          if (res) {
            // this.$Message.success('登录成功');
            // this.activePanel = 'key2';
            // 登录成功后播放视频
            // setPos();
            const params = [
              {
                ctrlType: 'playerWin',
                ctrlCode: 'ctrl1',
                ctrlProperty: {
                  displayMode: 1,
                  splitNum: splitNum,
                  channelList: vidArr,
                },
                visible: true,
                domId: 'DHLightWeight',
              },
            ];
            DHWsInstance.createCtrl(params)
              .then((val: any) => {
                console.log(val);
                setShowClose(true);
                // lastVideoid = '';
                // vidArr.forEach((item: string) => {
                //     lastVideoid += item;
                // });
                console.log('正在播放的视频流:', vidArr);
              })
              .catch((e: any) => {
                console.log(e);
                setShowClose(false);
              });
            DHWsInstance.on('createCtrlResult', (val: any) => {
              console.warn(val);
            });
          } else {
            message.error('登录失败');
          }
        });
      } else {
        // 连接客户端失败
        message.error('请重新安装客户端');
      }
    });
  };
  const closeLightWeight = () => {
    if (DHWsInstance.ctrls.length != 0) {
      const params = [
        {
          ctrlCode: 'ctrl1',
          visible: !DHWsInstance.ctrls.find((e: any) => {
            if (e.ctrlCode === 'ctrl1') {
              return e;
            }
          }).visible,
        },
      ];
      DHWsInstance.setCtrlVisible(params);
      setShowClose(false);
    }
    onCancel();
  };
  useEffect(() => {
    if (Array.isArray(viderUrls)) {
      login_LightWeight_n(viderUrls);
    } else {
      login_LightWeight(viderUrls);
    }
  }, [viderUrls]);
  return (
    <div id="DHLightWeight" className={styles.dhVideo} style={{ display: 'block' }}>
      {showClose && (
        <i className={`iconfont icon-guanbi ${styles.btns}`} onClick={closeLightWeight} />
      )}
    </div>
  );
};
export default DahuaVideo;
