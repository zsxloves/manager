function initLeftClickEvent() {
    bindAction('LEFT_CLICK', (picked, position, xy, xyz) => {
        console.log(JSON.stringify(position));
        if (picked && picked.id) {
            var layer = picked.id.layer;
            var conf = picked.id.config;
            if (layer) {
                if (layer.name == '实时点位图层') {
                    var devideIDObj = parent._URLATTR[parent.proj]['预警ID'];
                    if ($('#popup-' + conf.id).length == 0) {
                        var entity = parent.dingweiFea.getFeatureById(conf.id);
                        var obj = devideIDObj[conf.id];
                        if(obj != undefined ){
                            entity.popup = {
                                html: parent.getDingWeiDotPopupHtml(obj,conf.item),
                                anchor: [0, -35]
                            };
                            var flag = parent.isHasMonitor(conf.id);
                            if(flag == true){
                                setTimeout(function () {
                                    addDingWeiPopupMonitor(obj,conf.id);
                                }, 500);
                            }
                        }
                    } else {
                        var obj = devideIDObj[conf.id];
                            var flag = parent.isHasMonitor(conf.id);
                        if(obj != undefined && flag == true){
                            setTimeout(function () {
                                addDingWeiPopupMonitor(obj,conf.id);
                            }, 500);
                        }
                    }
                }
                if( layer.name === "站点线路"){
                    if ($('#popup-' + conf.id).length === 0) {
                        var entity = parent.zdLineFea.getFeatureById(conf.id);
                        setTimeout(function () {
                            addGLpopupVideo(conf,'单个');
                        }, 500);
                    } else {
                        setTimeout(function () {
                            addGLpopupVideo(conf,'单个');
                        }, 500);
                    }
                }
                // 模拟虚线
                if (conf.polyline && parent.$('.testBtn').hasClass('testActive')) {
                    parent.setCarModelDot(conf.polyline.positions);
                }
            }
        }
    });
}
function addDingWeiPopupMonitor(item,deviceid) {
    var video = document.createElement('video');
        var domstr = '#monitor-'+deviceid;
        var videoUrl = item.monitor.videourl;
        var videoType = item.monitor.videotype;

    parent.clearAllDingWeiHls();
    if($(domstr).find('video').length > 0 ) $(domstr).find('video').remove();
    $(domstr).find('.adding').show();
    if (Hls.isSupported() && videoType == 'hls') {
        $.ajax({
            url: videoUrl,
            success: function (result) {
                var hls = new Hls();
                hls.loadSource(result.replace(/.*hls/, '/hls_proxy'));
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play();
                    $(domstr).find('.adding').hide();
                });
                _dingWeiHls[item.deviceid] = hls;
            }
        });
    } else if (videoType == 'mp4') {
        video.src = videoUrl;
        video.play();
        $(domstr).find('.adding').hide();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        video.addEventListener('canplay', function () {
            video.play();
            $(domstr).find('.adding').hide();
        });
    }
    $(domstr).append(video);
}



// var _GLPopupHlsObj = {};
function addGLpopupVideo(item,flag) {
    // var video = document.createElement('video');
    // if (Hls.isSupported() && item.videotype == 'hls') {
    //     $.ajax({
    //         url: item.videourl,
    //         success: function (result) {
    //             var hls = new Hls();
    //             hls.loadSource(result.replace(/.*hls/, '/hls_proxy'));
    //             hls.attachMedia(video);
    //             hls.on(Hls.Events.MANIFEST_PARSED, function () {
    //                 video.play();
    //                 $('#popup-' + item.id)
    //                     .find('.adding')
    //                     .hide();
    //             });
    //             _GLPopupHlsObj[item.id] = hls;
    //         }
    //     });
    // } else if (item.videotype == 'mp4') {
    //     video.src = item.videourl;
    //     video.addEventListener('canplay', function () {
    //         video.play();
    //         $('#popup-' + item.id)
    //             .find('.adding')
    //             .hide();
    //     });
    // } else
    if (flag == '多个' && item.length >0  && item[0].videotype === 'dhlw') {
        // login_LightWeight(item)
        login_LightWeight_n(item);
    }
    if (flag == '单个' && item.videotype === 'dhlw') {
        login_LightWeight(item);
    }
    // else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //     video.src = item.videourl;
    //     video.addEventListener('canplay', function () {
    //         video.play();
    //         $('#popup-' + item.id)
    //             .find('.adding')
    //             .hide();
    //     });
    // }
    // $('#popup-' + item.id)
    //     .find('.unitcontent')
    //     .append(video);
}
// function glPopupCloseBtn(vid) {
//     console.log(vid);
//     viewer.mars.popup.close('popup-' + vid);
//     if (_GLPopupHlsObj[vid]) {
//         _GLPopupHlsObj[vid].destroy();
//         _GLPopupHlsObj[vid] = null;
//         delete _GLPopupHlsObj[vid];
//     }
//     getLayer('监控点位').getFeatureById(vid).popup = null;
//     $('#popup-' + vid).remove();
// }