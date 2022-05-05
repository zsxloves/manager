const DHWsInstance = DHWs.getInstance({
    reConnectCount: 2,
    connectionTimeout: 30 * 1000,
    messageEvents: {
        loginState() {
            console.log('aaaa');
        }
    }
});
/* 单个 */
var lastVideoid = '';
function login_LightWeight(item) {
    if(item.videoid) item.id = item.videoid;
    if(lastVideoid === item.id ){
       return;
    }
    let logindata = {
        loginIp: '41.200.15.56',
        loginPort: '8320',
        userName: 'gldj',
        userPwd: 'gldj123456',
        token: '',
        https: 1
    };
    DHWsInstance.detectConnectQt().then((res) => {
        if (res) {
            // 连接客户端成功
            DHWsInstance.login(logindata);
            DHWsInstance.on('loginState', (res) => {
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
                                splitNum: 1,
                                channelList: [
                                    { channelId: item.id.split('_')[0] }
                                ]
                            },
                            visible: true,
                            domId: 'DHLightWeight'
                        }
                    ];
                    DHWsInstance.createCtrl(params)
                        .then((res) => {
                            console.log(res);
                            $('#'+'DHLightWeight'+' .btns').show()
                            lastVideoid = item.id;
                            console.log('正在播放的视频流');console.log([
                                { channelId: item.id.split('_')[0] }
                            ]);
                        })
                        .catch((e) => {
                            console.log(e);
                            $('#'+'DHLightWeight'+' .btns').hide()
                        });
                    DHWsInstance.on('createCtrlResult', (res) => {
                        console.warn(res);
                    });
                } else {
                    // this.$Message.info('登录失败');
                }
            });
        } else {
            // 连接客户端失败
            // this.$Message.info('请重新安装客户端');
        }
    });
}

/* 多个 */
function login_LightWeight_n(vArr) {
    var vidArr = [];
    // 默认视角
    // if( parent._CONF['车辆视角'] && parent._CONF['车辆视角'].videoid ){
    //     vidArr.push({ channelId: parent._CONF['车辆视角'].videoid.split('_')[0]});
    // }
    vArr.forEach(item => {
        if(item.videoid) {
            vidArr.push({ channelId: item.videoid.split('_')[0] });
        }
    });
    let logindata = {
        loginIp: '41.200.15.56',
        loginPort: '8320',
        userName: 'gldj',
        userPwd: 'gldj123456',
        token: '',
        https: 1
    };
    var str = '';
    vidArr.forEach(item => {
        str += item;
    });
    if(str === lastVideoid){
       return;
    }
    DHWsInstance.detectConnectQt().then((res) => {
        if (res) {
            // 连接客户端成功
            DHWsInstance.login(logindata);
            DHWsInstance.on('loginState', (res) => {
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
                                splitNum: 4,
                                channelList: vidArr
                            },
                            visible: true,
                            domId: 'DHLightWeight'
                        }
                    ];
                    DHWsInstance.createCtrl(params)
                        .then((res) => {
                            console.log(res);
                            $('#'+'DHLightWeight'+' .btns').show();
                            lastVideoid = '';
                            vidArr.forEach(item => {
                                lastVideoid += item;
                            });
                            console.log('正在播放的视频流');console.log(vidArr);
                        })
                        .catch((e) => {
                            console.log(e);
                            $('#'+'DHLightWeight'+' .btns').hide()
                        });
                    DHWsInstance.on('createCtrlResult', (res) => {
                        console.warn(res);
                    });
                } else {
                    // this.$Message.info('登录失败');
                }
            });
        } else {
            // 连接客户端失败
            // this.$Message.info('请重新安装客户端');
        }
    });
}

function closeLightWeight() {
    if(DHWsInstance.ctrls.length != 0){
        const params = [
            {
                ctrlCode: 'ctrl1',
                visible: !DHWsInstance.ctrls.find((e) => {
                    if (e.ctrlCode === 'ctrl1') {
                        return e;
                    }
                }).visible
            }
        ];
        DHWsInstance.setCtrlVisible(params);
        $('#'+'DHLightWeight'+' .btns').hide()
    }
}

function setPos() {
    let target = document.getElementById('DHLightWeight');
    console.log(target, 'target');
    target.style.right = document.body.offsetWidth / 4;
    target.style.top = document.body.offsetHeight / 4;
    target.style.width = document.body.offsetWidth / 2;
    target.style.height = document.body.offsetHeight / 2;
    if (document.createEvent) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, true);
        window.dispatchEvent(event);
    } else if (document.createEventObject) {
        window.fireEvent('onresize');
    }
}


/* 车头监控 */
// const DHWsInstance_eye = DHWs.getInstance({
//     reConnectCount: 2,
//     connectionTimeout: 30 * 1000,
//     messageEvents: {
//         loginState() {
//             console.log('aaaa');
//         }
//     }
// });
// function login_LightWeight_eye(item) {
//     let logindata = {
//         loginIp: '41.200.15.56',
//         loginPort: '8320',
//         userName: 'gldj',
//         userPwd: 'gldj123456',
//         token: '',
//         https: 1
//     };
//     DHWsInstance_eye.detectConnectQt().then((res) => {
//         if (res) {
//             // 连接客户端成功
//             DHWsInstance_eye.login(logindata);
//             DHWsInstance_eye.on('loginState', (res) => {
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
//                                 channelList: [
//                                     { channelId: item.id.split('_')[0] }
//                                 ]
//                             },
//                             visible: true,
//                             domId: 'DHLightWeight_eye'
//                         }
//                     ];
//                     DHWsInstance_eye.createCtrl(params)
//                         .then((res) => {
//                             console.log(res);
//                             $('#'+'DHLightWeight_eye'+' .btns').show()
//                             lastVideoid = item.id;
//                             console.log('正在播放的视频流');console.log([
//                                 { channelId: item.id.split('_')[0] }
//                             ]);
//                         })
//                         .catch((e) => {
//                             console.log(e);
//                             $('#'+'DHLightWeight_eye'+' .btns').hide()
//                         });
//                         DHWsInstance_eye.on('createCtrlResult', (res) => {
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
// function closeLightWeight_eye() {
//     if(DHWsInstance_eye.ctrls.length != 0){
//         const params = [
//             {
//                 ctrlCode: 'ctrl1',
//                 visible: !DHWsInstance_eye.ctrls.find((e) => {
//                     if (e.ctrlCode === 'ctrl1') {
//                         return e;
//                     }
//                 }).visible
//             }
//         ];
//         DHWsInstance_eye.setCtrlVisible(params);
//         $('#'+'DHLightWeight_eye'+' .btns').hide()
//     }
// }
