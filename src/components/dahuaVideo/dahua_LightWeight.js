// const DHWsInstance = DHWs.getInstance({
//     reConnectCount: 2,
//     connectionTimeout: 30 * 1000,
//     messageEvents: {
//         loginState() {
//             console.log('aaaa');
//         }
//     }
// });
// function login_LightWeight(item) {
//     console.log(item)
//     let logindata = {
//         loginIp: '41.200.15.56',
//         loginPort: '8320',
//         userName: 'gldj',
//         userPwd: 'gldj123456',
//         token: '',
//         https: 1
//     };
//     DHWsInstance.detectConnectQt().then((res) => {
//         if (res) {
//             // 连接客户端成功
//             DHWsInstance.login(logindata);
//             DHWsInstance.on('loginState', (res) => {
//                 // this.isLogin = res;
//                 if (res) {
//                     // this.$Message.success('登录成功');
//                     // this.activePanel = 'key2';
//                     // 登录成功后播放视频
//                     // setPos();
//                     const params = [
//                         {
//                             ctrlType: 'playerWin',
//                             ctrlCode: 'ctrl1',
//                             ctrlProperty: {
//                                 displayMode: 1,
//                                 splitNum: 1,
//                                 channelList: [{ channelId: item.id.split('_')[0] }]
//                             },
//                             visible: true,
//                             domId: 'DHLightWeight'
//                         }
//                     ];
//                     DHWsInstance.createCtrl(params)
//                         .then((res) => {
//                             console.log(res);
//                             $('#DHLightWeight .btns').show()
//                         })
//                         .catch((e) => {
//                             console.log(e);
//                             $('#DHLightWeight .btns').hide()
//                         });
//                     DHWsInstance.on('createCtrlResult', (res) => {
//                         console.warn(res);
//                     });
//                 } else {
//                     // this.$Message.info('登录失败');
//                 }
//             });
//         } else {
//             // 连接客户端失败
//             // this.$Message.info('请重新安装客户端');
//         }
//     });
// }
// function login_LightWeightDJ(item,splitNum=1) {
//     // if(item.videoid) item.id = item.videoid;
//     // if(lastVideoid === item.id ){
//     //    return;
//     // }
//     let channelList = []
//     if(Array.isArray(item)){
//         channelList = item.map(val=>{
//             return { channelId: val.split('_')[0] }
//         })
//     }else{
//         channelList = [ { channelId: item.split('_')[0] }]
//     }
//     console.log('ddd-item:',channelList)
//     let logindata = {
//         loginIp: '41.200.15.56',
//         loginPort: '8320',
//         userName: 'gldj',
//         userPwd: 'gldj123456',
//         token: '',
//         https: 1
//     };
//     DHWsInstance.detectConnectQt().then((res) => {
//         if (res) {
//             // 连接客户端成功
//             DHWsInstance.login(logindata);
//             DHWsInstance.on('loginState', (res) => {
//                 // this.isLogin = res;
//                 if (res) {
//                     // this.$Message.success('登录成功');
//                     // this.activePanel = 'key2';
//                     // 登录成功后播放视频
//                     // setPos();
//                     const params = [
//                         {
//                             ctrlType: 'playerWin',
//                             ctrlCode: 'ctrl1',
//                             ctrlProperty: {
//                                 displayMode: 1,
//                                 splitNum,
//                                 channelList
//                             },
//                             visible: true,
//                             domId: 'DHLightWeight'
//                         }
//                     ];
//                     DHWsInstance.createCtrl(params)
//                         .then((res) => {
//                             console.log(res);
//                             console.log(11111111)
//                             $('#DHLightWeight .btns').show()
//                             if(Array.isArray(item)){
//                                 lastVideoid = item;
//                             }
//                             console.log('正在播放的视频流');
//                             console.log(channelList);
//                         })
//                         .catch((e) => {
//                             console.log(e);
//                             $('#'+'DHLightWeight'+' .btns').hide()
//                         });
//                     DHWsInstance.on('createCtrlResult', (res) => {
//                         console.warn(res);
//                     });
//                 } else {
//                     // this.$Message.info('登录失败');
//                 }
//             });
//         } else {
//             // 连接客户端失败
//             // this.$Message.info('请重新安装客户端');
//         }
//     });
// }
// function closeLightWeight() {
//     const params = [
//         {
//             ctrlCode: 'ctrl1',
//             visible: !DHWsInstance.ctrls.find((e) => {
//                 if (e.ctrlCode === 'ctrl1') {
//                     return e;
//                 }
//             }).visible
//         }
//     ];
//     DHWsInstance.setCtrlVisible(params);
//     $('#DHLightWeight .btns').hide()
// }

// function setPos() {
//     let target = document.getElementById('DHLightWeight');
//     console.log(target, 'target');
//     target.style.right = document.body.offsetWidth / 4;
//     target.style.top = document.body.offsetHeight / 4;
//     target.style.width = document.body.offsetWidth / 2;
//     target.style.height = document.body.offsetHeight / 2;
//     if (document.createEvent) {
//         var event = document.createEvent('HTMLEvents');
//         event.initEvent('resize', true, true);
//         window.dispatchEvent(event);
//     } else if (document.createEventObject) {
//         window.fireEvent('onresize');
//     }
// }
