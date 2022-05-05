import React, { useState, useEffect, useRef } from 'react';
import Mars3d from '@/components/Mars3d';
import { useModel } from 'umi';
import {
  Button,
  Col,
  Drawer,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tooltip,
  InputNumber,
  Slider,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { getIcons } from '@/services/prepar';
import {
  videoQuery,
  videoDetailQuery,
  addLayerCamera,
  removeCameraDW,
  layerQuery,
} from './service'; //getModelLayer
import { slectPlace, slectBaseMap } from '../../../services/layerunit';
import { preview } from '@/services/video'; //海康视频流
import VideoPlayer from './components/videoPlayer';
import Modelload from './components/modelload';
import SceneSelect from './components/SceneSelect';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import Hls from 'hls.js';

const { Option } = Select;
const { Search } = Input;
window.Hls = Hls;
let map: any = null;
let spbdSet = false;
let sytzSet = false;
let graphicLayerOne: any = '';
let spPoint = ''; // 视频标点设置
let mapSpbd = ''; // 视频标点url
let TimeInterval: any = null;
let videoElement: any = null;
let video3D: any = null;
let graphicLayerIn: any = null;
let graphicLayerTo: any = null;
//let ellipsoid: any = {}; //坐标系转换

const VideoPunctuation: React.FC = () => {
  // 视频标点开始
  const updatemodel: any = useRef();
  const controlSJ: any = useRef({
    lng: 120.225294,
    lat: 30.216162,
    alt: 1994,
    heading: 0,
    pitch: -1,
    roll: 0,
  });
  const sceneSJ: any = useRef({
    lng: 120.225202,
    lat: 30.235252,
    alt: 1994,
    heading: 0,
    pitch: -45,
  });
  const video: any = useRef({
    ckdFrustum: true,
    cameraAngle: 18, // 水平角度
    cameraAngle2: 11, // 垂直角度
    distanceValue: 1000, // 投射距离
    heading: 171, //四周距离
    pitchValue: -74, // 俯仰角度
    opcity: 0.8, //透明度
  });
  const allVideos: any = useRef([]); //左侧监控数据
  const SDAngle: any = useRef(1); //视点角度
  const DWDistance: any = useRef(0.2); //单位距离
  // const spbd: any = useRef(false); //视频标点
  // const sytz: any = useRef(false); //视野调整
  const [spDrarer, setSpDrarer] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState'); //引入地图
  map = initialState?.map;
  const [showRightSp, setShowRightSp] = useState<boolean>(false);
  const [vdtype, setVdType] = useState<string>('1');
  const [videos, setVideos] = useState<any>([]);
  const [category, setCateGory] = useState<string>('');
  const [carmeraLoad, setCareraLoad] = useState<boolean>(false);
  const [spbd, setSpbd] = useState<boolean>(false);
  const [sytz, setSytz] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>('');
  const [videoGlId, setVideoGlId] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [videoDetail, setVideoDetail] = useState<videoObj>({});
  const [cameraType, setCameraType] = useState<string>('1');
  const [imgValue, setImgValue] = useState<string>('7');
  const [cameraPosition, setCameraP] = useState<cameraP>({});
  const [modelTreeData, setMOdelTree] = useState<any>({}); // 模型value
  const [hasMore, setHasMore] = useState<boolean>(true); //是否开启下拉加载
  const [videoPage, setVideoPage] = useState<number>(2);
  const [videoUrlHK, setVideoUrlHK] = useState<string>(); // 海康视频地址
  const [xLoad, setXLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  //const [sceneViews, setSceneViews] = useState<any>([]); //存放场景下views视域
  const [iconList, setIconList] = useState<any[]>([]); //图标列表
  const [Rgba, setRgba] = useState<boolean>(false); //叠加预览
  const [fuseD, setFuseD] = useState<boolean>(false); //三维融合
  const [sliderValue, setSliderValue] = useState<number>(1);
  // const eventTarget = new mars3d.BaseClass();
  const selectedView = useRef<any>({});
  const changeTopSearch = (e: any) => {
    setSearchValue(e.target.value);
  };
  const changeCategory = (e: any) => {
    setCateGory(e.target.value);
  };
  //控制地图鼠标操作
  const controlMap = (bol: boolean) => {
    map.viewer.scene.screenSpaceCameraController.enableRotate = bol;
    map.viewer.scene.screenSpaceCameraController.enableTranslate = bol;
    map.viewer.scene.screenSpaceCameraController.enableZoom = bol;
    map.viewer.scene.screenSpaceCameraController.enableTilt = bol;
    map.viewer.scene.screenSpaceCameraController.enableLook = bol;
    console.log('map', map.viewer.scene.screenSpaceCameraController);
  };

  const flyHome = (id: any) => {
    slectPlace({ id })
      .then((res) => {
        const data = res?.result?.detail;
        const position = JSON.parse(data?.centerPosition || '{}');
        slectBaseMap({ id: data?.id, pageSize: 999, pageNumber: 1 }).then((ress) => {
          if (ress.data.rows.length > 0) {
            const result = ress.data.rows;
            result.forEach((item: any) => {
              const enetity = JSON.parse(item.entity || '{}');
              if (enetity.type === '3dtiles' && item.isDefult === '1') {
                updatemodel.current?.loadmodel(enetity, function () {
                  if (!Boolean(Object.keys(position || {}).length == 0)) map.centerAt(position);
                });
                // 加载完成事件
              } else if (enetity.type === 'xyz' && item.isDefult === '1') {
                // 瓦片图层
                try {
                  if (!Boolean(Object.keys(position || {}).length == 0)) map.centerAt(position);
                  const newEntity = enetity;
                  newEntity.show = true;
                  const layer = mars3d.LayerUtil.create(newEntity);
                  map.addLayer(layer);
                } catch (error) {
                  return;
                }
              }
            });
          }
        });
      })
      .catch((err) => {
        if (err?.message) {
          message.error(err.message || err);
        }
      });
  };
  const initFunc = () => {
    // 图标列表
    getIcons({})
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.data.rows.map((item: any) => {
            item.showChildren = false;
            item.childrenList = item?.childrenList?.sort((a: any, b: any) => a.code - b.code);
            return item;
          });
          const cameraIcon = list
            .map((item: any) => {
              if (item.levelName === '摄像头标记') return item;
            })
            .filter((items: any) => {
              return items !== undefined;
            });
          setIconList(cameraIcon);
          console.log(cameraIcon, '图标');
        }
      })
      .catch((err) => {
        message.error(err.message || err);
        map.viewer.camera.setView({});
      });
  };

  // 地图模型展示
  const setModelMap = (id: any) => {
    if (!id) return;
    layerQuery({ queryObject: { id } }).then((res) => {
      const entity = res.result.page?.content;
      if (entity?.length > 0) {
        const data = JSON.parse(entity[0].entity || '{}');
        setMOdelTree({
          data: entity[0],
          key: entity[0].id,
          title: entity[0].name,
        });
        updatemodel.current?.loadmodel(data);
      }
    });
  };
  // 添加图标点
  const addPoint = (position: any) => {
    if (spPoint) {
      graphicLayerOne.removeGraphic(spPoint);
    }

    spPoint = new mars3d.graphic.BillboardEntity({
      name: '视频标点',
      position: [position.lng, position.lat, position.height],
      style: {
        height: 70,
        width: 70,
        image: mapSpbd,
        scale: 0.5,
        pixelOffset: new Cesium.Cartesian2(0, 0), //偏移量
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        // clampToGround: true, 贴地
      },
    });
    // graphicLayerOne.bindContextMenu([
    //   {
    //     text: '更换图标',
    //     iconCls: 'fa fa-trash-o',
    //     callback: function (e: any) {
    //       message.success('点击', e);
    //     },
    //   },
    // ]);
    controlSJ.current.lng = position.lng;
    controlSJ.current.lat = position.lat;
    controlSJ.current.alt = position.height;
    graphicLayerOne.addGraphic(spPoint);
  };
  // 预览
  const flyToPoint = () => {
    // setImgValue(videoDetail.iconID as string);
    // mapSpbd = videoDetail.minioFileUrl as string;

    if (cameraPosition?.lng && cameraPosition?.lat) {
      addPoint(cameraPosition);
      map.flyToPoint(
        new mars3d.LngLatPoint(
          cameraPosition.lng,
          cameraPosition.lat,
          Number(cameraPosition.height),
          {
            heading: 0,
            pitch: -45,
          },
        ),
      );
    } else {
      message.warning('该监控未标点');
    }
  };
  //获取海康视频流
  const searchVideo = (data: any) => {
    if (!data?.id) {
      message.error('视频id缺失!');
      return;
    }
    // setVideoUrlHK('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'); //测试
    if (data.videoType === 'f0f9ed28-133a-4a02-a8c2-a56873106ee3' || data.videoType === 'dhlw') {
      // callBackUrl(vvideoId, '大华');
      console.log('大华视频');
      return;
    } else if (data.videoType === 'b76a4c09-35a5-4f83-ae4f-315860ad3680') {
      const platform = data?.source === '1' ? 'ISC' : 'IOT';
      preview({
        data: {
          cameraId: data?.vvideoId,
          platform: platform,
          protocol: 'hls',
          expand: 'transcode=1&videotype=h264',
        },
      })
        .then((res: any) => {
          // callBackUrl([res.result.result], '海康');
          console.log('海康视频', res.result.result);
          setVideoUrlHK(res.result.result);
        })
        .catch((err: any) => {
          console.error(err.message || err);
        });
    }
  };

  // 查询摄像机详情
  const videoDetailQuerys = (id: any) => {
    const param = {
      vedioID: id,
    };
    setVideoUrlHK('');
    updatemodel.current?.clear();
    setMOdelTree({});
    videoDetailQuery(param)
      .then((res) => {
        if (res.data.rows && res.data.rows.length > 0) {
          const details = res.data.rows[0];
          const JSONPASE = JSON.parse(details?.entity);
          const obj = {
            lng: details.lon,
            lat: details.lat,
            height: details.height,
          };
          //显示详情图标
          setImgValue(details.iconID);
          mapSpbd = details.minioFileUrl as string;
          map.addLayer(graphicLayerOne);
          if (obj.lng && obj.lat) {
            addPoint(obj);
            map.flyToPoint(
              new mars3d.LngLatPoint(obj.lng, obj.lat, Number(obj?.height), {
                heading: 0,
                pitch: -45,
              }),
            );
          }
          setVideoDetail(details);
          setCateGory(details?.type);
          searchVideo(details);
          if (JSONPASE?.video3D != null || JSONPASE?.controlSJ) {
            if (JSONPASE?.video3D) selectedView.current = JSONPASE?.video3D;
            if (JSONPASE?.controlSJ) controlSJ.current = JSONPASE?.controlSJ;
          } else {
            controlSJ.current = {
              lng: details.lon,
              lat: details.lat,
              alt: details.height,
              heading: 0,
              pitch: -1,
              roll: 0,
            };
          }
          setCameraP(obj);
          setCameraType(details.category);
          // 设置图层id并展示图层模型
          setModelMap(details.layerID);
          setVideoGlId(details.id);
        } else {
          allVideos.current.filter((item: any) => {
            if (item.id === id) {
              setCameraP({
                lng: item.lon,
                lat: item.lat,
                height: item.height,
              });
              map.flyToPoint(
                new mars3d.LngLatPoint(item.lng, item.lat, Number(item?.height), {
                  heading: 0,
                  pitch: -45,
                }),
              );
            }
          });
          graphicLayerOne.removeGraphic(spPoint);
          setImgValue('0');
          setCateGory('');
          setCameraType('1');
          setMOdelTree({});
          setVideoGlId('');
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  //视野调整
  const syChange = (check: any) => {
    if (cameraPosition?.lng && cameraPosition?.lat) {
      if (spbd) {
        message.warning('请先关闭视频标点');
        return;
      }
      if (fuseD) {
        message.warning('请先关闭融合预览');
        return;
      }
      if (Rgba) {
        message.warning('请先关闭叠加预览');
        return;
      }
      // map?.on(mars3d.EventType.click, listenFunc);
      // map.off(mars3d.EventType.click);
      if (check) {
        if (!controlSJ.current) {
          return;
        }
        map.setCameraView({ ...controlSJ.current });
        controlMap(false);
      } else {
        map.setCameraView({ ...controlSJ.current, pitch: -45, alt: 1994 });
        controlMap(true);
      }
      setSytz(check);
      sytzSet = check;
    } else {
      message.warning('该监控未标点');
    }
  };
  const clickVideo = (item: any, index: number) => {
    if (sytzSet) {
      message.warning('请先关闭视野调整');
      return;
    }
    if (spbdSet) {
      setSpbd(false);
      spbdSet = false;
      map.removeLayer(graphicLayerOne);
    }
    mapSpbd = '';
    if (allVideos.current[index].flag) {
      return;
    } else {
      allVideos.current.map((items: any, indexs: number) => {
        if (indexs === index) {
          items.flag = true;
          setVideoId(item.id);
          // 执行查询详情
          setVideoDetail(item);
          videoDetailQuerys(item.id);
        } else {
          items.flag = false;
        }
      });
      const showVideo = allVideos.current.map((itema: any, indexa: any) => {
        return (
          <li
            onClick={() => {
              clickVideo(itema, indexa);
            }}
            key={itema.id}
            className={itema.flag ? 'active' : ''}
          >
            <span>{itema.videoName}</span>
          </li>
        );
      });
      setVideos(showVideo);
    }
  };

  // 加载更多数据
  const loadMoreData = (page?: number, size?: number) => {
    // 超过条数 禁止加载
    if (xLoad && !page) {
      message.warning('数据已加载完');
      setHasMore(false);
      return false;
    }
    const vData: any = {
      videoName: searchValue,
      pageNumber: page || videoPage,
      pageSize: size || 30,
      // polygon: sceneViews,
    };
    if (vdtype === '2') {
      vData.hasMarker = '0';
    } else if (vdtype === '3') {
      vData.hasMarker = '1';
    }
    setLoading(true);
    // page 是当前请求第几页数据
    // limit 每页我需要返回的数据条数
    videoQuery(vData)
      .then((res) => {
        const result = res.data.rows;
        if (result?.length === 0) {
          setXLoad(true);
          // setVideos([]);
          // setImgValue('0');
          // setCateGory('');
          // setCameraP({});
          // setCameraType('1');
          // setMOdelTree('');
          // setVideoGlId('');
          // setShowRightSp(false);
          setLoading(false);
          return;
        }
        if (page) {
          result.map((item: any, index: number) => {
            if (index === 0) {
              item.flag = true;
              setVideoId(item.id);
              // 执行查询详情
              setVideoDetail(item);
              videoDetailQuerys(item.id);
            } else {
              item.flag = false;
            }
          });
        }
        setCareraLoad(false);
        setShowRightSp(true);
        allVideos.current.push(...result);
        const showVideo = result.map((item: any, index: any) => {
          return (
            <li
              onClick={() => {
                clickVideo(item, index);
              }}
              key={item.id}
              className={item.flag ? 'active' : ''}
            >
              <span>{item.videoName}</span>
            </li>
          );
        });
        if (page) {
          setVideos(showVideo);
        } else {
          setVideos([...videos, ...showVideo]);
        }
        console.log(showVideo, '监控', allVideos.current);
        setLoading(false);
        // setVideoData([]);
        // setCount(res.data?.totalCount);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  /*监听滚动*/
  const onScroll = (e: any) => {
    if (e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight) {
      // 滚动到底部需要做的事情
      setVideoPage(videoPage + 1);
      loadMoreData();
    }
  };

  const changeType = (e: any) => {
    setVdType(e.target.value);
  };

  interface videoObj {
    name?: string;
    videoUrl?: string;
    address?: string;
    iconID?: string;
    minioFileUrl?: string;
    vedioName?: string;
    videoType?: string;
    vvideoId?: string;
  }

  const setCameraTypes = (value: any) => {
    setCameraType(value);
  };

  const changeImg = (e: any) => {
    const value = e.target.value;
    if (!spbd) return;
    setImgValue(value);
    const url = iconList
      .map((item: any) => {
        if (value === item?.id) {
          return item?.minioFileUrl;
        }
      })
      .filter((info: any) => info !== undefined);
    if (url?.length > 0) mapSpbd = url[0];
  };
  const changeXyz = (position: any) => {
    const point = mars3d.LngLatPoint.fromCartesian(position);
    point.format(); // 经度、纬度、高度
    const { lng, lat, alt } = point;
    const positions = {
      lng: lng,
      lat: lat,
      height: alt,
    };
    return positions;
  };
  const listenFunc = (event: any) => {
    if (spbdSet) {
      //绑定监听事件
      map.addLayer(graphicLayerOne);
      const positions = changeXyz(event.cartesian);
      setCameraP(positions);
      addPoint(positions);
    }
  };
  const changeSpbd = (checkeds: any) => {
    if (sytz) {
      message.warning('请先关闭视野调整');
      return;
    }
    setSpbd(checkeds);
    spbdSet = checkeds;
    if (checkeds) {
      map.addLayer(graphicLayerOne);
      map?.on(mars3d.EventType.click, listenFunc);
      // setProhibit(true);
    } else {
      // map.removeLayer(graphicLayerOne);
      map.off(mars3d.EventType.click);
      // setProhibit(false);
    }
  };

  interface cameraP {
    lng?: string;
    lat?: string;
    height?: string;
  }

  const saveCamera = () => {
    const entJSON = {
      video3D: selectedView.current?.options ? selectedView.current.toJSON() : null,
      controlSJ: { ...controlSJ.current },
    };
    const param = {
      height: cameraPosition.height,
      lat: cameraPosition.lat,
      layerID: modelTreeData?.key || null,
      iconID: imgValue,
      iconSrc: mapSpbd,
      lon: cameraPosition.lng,
      type: category,
      vedioID: videoId,
      category: cameraType, //监控
      entity: JSON.stringify(entJSON),
      vedioCode: videoDetail?.vvideoId,
    };
    addLayerCamera(param)
      .then((res) => {
        if (res.success) {
          message.success('保存成功');
          setSpbd(false);
          spbdSet = false;
          map.off(mars3d.EventType.click);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  const removeCamera = () => {
    if (videoGlId) {
      const param = [videoGlId];
      removeCameraDW(param).then((res) => {
        if (res.success) {
          message.success('删除成功');
          videoDetailQuerys(videoId);
        }
      });
    } else {
      message.info('没有绑定的点位，删除失败');
    }
  };
  const viewsControl = () => {
    map.setCameraView({ ...controlSJ.current }, { duration: 0.1 });
  };

  const save_settings = () => {
    const cartographic = map.viewer.scene.globe.ellipsoid.cartesianToCartographic(
      map.viewer.camera.position,
    );
    const cartesian3 = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height,
    );
    const point = mars3d.LngLatPoint.fromCartesian(cartesian3);
    controlSJ.current.lng = point.lng;
    controlSJ.current.lat = point.lat;
    controlSJ.current.alt = point.alt;
    const POS = {
      lng: point.lng,
      lat: point.lat,
      height: point.alt,
    };
    setCameraP(POS);
    addPoint(POS);
  };

  // 前进--zoom
  const setMoveForward = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.moveForward(DWDistance.current);
    save_settings();
  };
  // 后退--zoom
  const setMoveBackward = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.moveBackward(DWDistance.current);
    save_settings();
  };
  //视野上移
  const moveFieldTop = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.moveUp(DWDistance.current);
    save_settings();
  };
  //视野下移
  const moveFieldDown = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.moveDown(DWDistance.current);
    save_settings();
  };
  //视野左移
  const moveFieldLeft = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.moveLeft(DWDistance.current);
    save_settings();
  };
  //视野右移
  const moveFieldRight = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.moveRight(DWDistance.current);
    save_settings();
  };

  // 视点左旋--roll
  const setRollLeft = () => {
    if (Rgba || fuseD) return;
    if (controlSJ.current.roll < 1) {
      controlSJ.current.roll = 360;
    } else {
      controlSJ.current.roll -= SDAngle.current;
    }
    viewsControl();
  };
  // 视点右旋--roll
  const setRollRight = () => {
    if (Rgba || fuseD) return;
    if (controlSJ.current.roll > 360) {
      controlSJ.current.roll = 1;
    } else {
      controlSJ.current.roll += SDAngle.current;
    }
    viewsControl();
  };
  // 放大--zoom
  const setZoomIn = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.zoomIn(SDAngle.current);
    save_settings();
  };
  // 缩小--zoom
  const setZoomOut = () => {
    if (Rgba || fuseD) return;
    map.viewer.camera.zoomOut(SDAngle.current);
    save_settings();
  };
  //视点上移
  const moveTop = () => {
    if (Rgba || fuseD) return;
    if (controlSJ.current.pitch > 88) {
      message.warning('视角到顶了');
    } else {
      controlSJ.current.pitch += SDAngle.current;
    }
    viewsControl();
  };
  //视点下移
  const moveDown = () => {
    if (Rgba || fuseD) return;
    if (controlSJ.current.pitch < -88) {
      message.warning('视角到底了');
      // controlSJ.current.pitch = 360;
    } else {
      controlSJ.current.pitch -= SDAngle.current;
    }
    viewsControl();
  };
  //视点左移
  const moveLeft = () => {
    if (Rgba || fuseD) return;
    if (controlSJ.current.heading < 1) {
      controlSJ.current.heading = 360;
    } else {
      controlSJ.current.heading -= SDAngle.current;
    }
    viewsControl();
  };
  //视点右移
  const moveRight = () => {
    if (Rgba || fuseD) return;
    if (controlSJ.current.heading > 360) {
      controlSJ.current.heading = 1;
    } else {
      controlSJ.current.heading += SDAngle.current;
    }
    viewsControl();
  };
  const createVideoDom = () => {
    videoElement = mars3d.DomUtil.create('video', '', document.body);
    videoElement?.setAttribute('muted', 'muted');
    videoElement?.setAttribute('autoplay', 'autoplay');
    videoElement?.setAttribute('loop', 'loop');
    videoElement?.setAttribute('crossorigin', '');
    videoElement?.setAttribute('controls', '');
    videoElement!.style.display = 'none';

    const sourceContainer = mars3d.DomUtil.create('source', '', videoElement);
    sourceContainer.setAttribute('src', 'http://data.mars3d.cn/file/video/lukou.mp4');
    sourceContainer.setAttribute('type', 'video/mp4');
    hlsSet();
  };
  function hlsSet() {
    // 加HLS演示数据 https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
    const hlsUrl = videoUrlHK || '';
    if (window.Hls.isSupported()) {
      const hls = new window.Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoElement);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        videoElement?.play();
      });
      console.log('hlsh', hls);
    } else if (videoElement?.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = hlsUrl;
      videoElement.addEventListener('loadedmetadata', function () {
        videoElement?.play();
      });
    }
  }

  useEffect(() => {
    if (controlSJ.current && selectedView.current) {
      selectedView.current.cameraPosition = [
        controlSJ.current.lng,
        controlSJ.current.lat,
        controlSJ.current.alt,
      ];
      if (sytz) selectedView.current.camera = map.viewer?.camera;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlSJ.current]);
  useEffect(() => {
    //创建Graphic图层
    graphicLayerOne = new mars3d.layer.GraphicLayer({ name: '点位图层' });
    // graphicLayerTo = new mars3d.layer.GraphicLayer({ name: '三维融合' });
    // map.addLayer(graphicLayerTo);
    initFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selView = () => {
    if (!selectedView.current) return;
    map.on(mars3d.EventType.click, function (event: any) {
      const cartesian = event.cartesian;
      const point = mars3d.LngLatPoint.fromCartesian(cartesian);
      point.format(); // 经度、纬度、高度
      selectedView.current.targetPosition = point;
    });
  };

  const thisCamera = () => {
    createVideoDom();
    map.setSceneOptions({
      sceneMode: 3,
      fxaa: true, // 不开启抗锯齿，可视域会闪烁
      globe: {
        depthTestAgainstTerrain: true, // 不加无法投射到地形上
      },
    });
    if (!graphicLayerTo) {
      graphicLayerTo = new mars3d.layer.GraphicLayer({
        name: '三维融合',
      });
      map.addLayer(graphicLayerTo);
    }
    const cameraInfo = map.viewer.camera;
    //取屏幕中心点
    const targetPosition = map.getCenter({ format: false });
    if (!targetPosition) return;
    const cameraPositiona = Cesium.clone(map.camera.position);
    const fov = Cesium.Math.toDegrees(map.camera.frustum.fov) / 2; //相机水平张角
    const aspectRatio = map.scene.canvas.clientWidth / map.scene.canvas.clientHeight; //获取canvas宽高
    video3D = null;
    //构造投射体
    video3D = new mars3d.graphic.Video3D({
      position: cameraPositiona,
      targetPosition: targetPosition,
      style: {
        container: videoElement,
        angle: fov,
        angle2: fov / aspectRatio,
        opacity: 0.5, //透明度
        showFrustum: true, //显示视锥框线
        camera: {
          direction: { ...cameraInfo.direction },
          right: { ...cameraInfo.right },
          up: { ...cameraInfo.up },
        },
      },
    });
    graphicLayerTo.addGraphic(video3D);
    console.log('三维融合', video3D);
    selectedView.current = video3D; //记录下
    map.setSceneOptions({
      sceneMode: 3,
      fxaa: false, // 不开启抗锯齿，可视域会闪烁
      globe: {
        depthTestAgainstTerrain: true, // 不加无法投射到地形上
      },
    });
    controlMap(false);
  };

  const createVedioGraphic = () => {
    controlMap(true);
    createVideoDom();
    const cameraInfo = map.viewer.camera;
    if (!graphicLayerIn) {
      graphicLayerIn = new mars3d.layer.GraphicLayer({
        name: '视频融合',
      });
      map.setSceneOptions({
        sceneMode: 3,
        fxaa: true, // 不开启抗锯齿，可视域会闪烁
        globe: {
          depthTestAgainstTerrain: true, // 不加无法投射到地形上
        },
      });
      map.addLayer(graphicLayerIn);
    }
    const targetPosition3D = map.getCenter({ format: false });
    if (!targetPosition3D) return;
    const cameraPosition3D = Cesium.clone(map.camera.position);
    console.log(cameraPosition3D, 'targetPosition', targetPosition3D);
    video3D = null;

    video3D = new mars3d.graphic.Video3D({
      position: [controlSJ.current.lng, controlSJ.current.lat, controlSJ.current.alt],
      //targetPosition: [controlSJ.current.lng, controlSJ.current.lat, controlSJ.current.alt], //相机位置
      // targetPosition: targetPosition3D,
      style: {
        container: videoElement, //video视频DOM容器
        showFrustum: video.current.ckdFrustum,
        angle: video.current.cameraAngle, // 水平角度
        angle2: video.current.cameraAngle2, // 垂直角度
        distance: video.current.distanceValue, // 投射距离
        heading: controlSJ.current.heading, //四周距离
        pitch: controlSJ.current.pitch, // 俯仰角度
        opacity: video.current.opcity, //透明度
        camera: {
          direction: { ...cameraInfo.direction },
          right: { ...cameraInfo.right },
          up: { ...cameraInfo.up },
        },
      },
    });
    graphicLayerIn.addGraphic(video3D);
    console.log('视频融合', video3D);
    selectedView.current = video3D; // 记录下
    selView();
  };

  // 视频标点结束
  // 视频标点预览
  return (
    <div className={styles.wrap}>
      <Mars3d lnglat={() => {}} />
      {/* 视频标点 */}
      <div className={styles.btnbox} style={{ right: spDrarer ? '800px' : '0' }}>
        {/* <Button
          type="primary"
          className={styles.btnstyle}
          style={{ right: spDrarer ? '800px' : '0' }}
          onClick={() => {
            setSpDrarer(!spDrarer);
          }}
        >
          {spDrarer ? '隐藏' : '显示'}
        </Button> */}
        <div
          className={styles.btnstyle}
          onClick={() => {
            setSpDrarer(!spDrarer);
          }}
        >
          <i style={{ display: 'block', fontSize: '18px' }}>{spDrarer ? '>' : '<'}</i>
          {spDrarer ? '隐藏侧栏' : '显示侧栏'}
        </div>
      </div>
      {spDrarer && (
        <Drawer
          // title="Drawer with extra actions"
          placement="right"
          // className="hcDrawer spDrawer"
          className={`${styles.hcDrawer} ${styles.spDrawer}`}
          mask={false}
          maskClosable={false}
          width={800}
          visible={true}
        >
          <Row className={styles.top}>
            {/* <span className="iconfont icon-sousuo" /> */}
            <span className={`${styles.iconfont}`} />
            <span>视频标点</span>
          </Row>
          <Row className={styles.SelHeader}>
            {false && (
              <>
                <Col style={{ lineHeight: '40px' }}>
                  <span>场景：</span>
                </Col>
                <Col className={styles.sceneSel}>
                  <SceneSelect
                    obtainViews={(view: any, position: any, id: any) => {
                      if (view?.length > 0) {
                        // setSceneViews(view);
                      } // else {
                      //   message.warning('该场景下没有视域');
                      // }
                      if (position) {
                        const PO = {
                          lng: position.lng || position.lon,
                          lat: position.lat,
                          alt: position.alt || position.height,
                          heading: position.heading,
                          pitch: position.pitch,
                        };
                        sceneSJ.current = PO;
                        map.setCameraView(PO);
                      } else {
                        message.warning('暂无场景位置信息');
                      }
                      flyHome(id);
                    }}
                  />
                </Col>
              </>
            )}

            <Search
              placeholder="请输入视频名称关键字"
              onSearch={() => {
                setVideos([]);
                allVideos.current = [];
                setVideoPage(2);
                setShowRightSp(false);
                // if (sceneViews.length > 0) {
                loadMoreData(1, 30);
                setXLoad(false);
                // } else {
                //   message.warning('请先选择场景');
                // }
              }}
              value={searchValue}
              onChange={changeTopSearch}
              enterButton
              className={styles.videoname}
            />
            <Radio.Group onChange={changeType} value={vdtype} className={styles.allRadio}>
              <Radio value={'1'}>全部</Radio>
              <Radio value={'2'}>未标</Radio>
              <Radio value={'3'}>已标</Radio>
            </Radio.Group>
          </Row>
          <Row className={styles.content}>
            <Col span={7} className={styles.lefts}>
              {/* <ul>{videos}</ul>
               */}
              <Scrollbars
                id="list-scrollbars"
                style={{ height: 'calc(100vh - 260px)' }}
                // autoHide
                onScroll={onScroll}
              >
                <InfiniteScroll
                  className="list-contents"
                  initialLoad={false}
                  pageStart={0} // 设置初始化请求的页数
                  loadMore={() => loadMoreData} // 监听的ajax请求
                  hasMore={!loading && hasMore} // 是否继续监听滚动事件 true 监听 | false 不再监听
                  useWindow={false}
                >
                  <ul>{videos}</ul>
                  {/* {total === data.length && data.length > 4 ? <div className="end-text">所有数据已看完</div> : ""} */}
                  {loading ? (
                    <div
                      style={{
                        position: 'relative',
                        top: '190px',
                        left: '60px',
                        marginTop: '-10px',
                        color: '#fff',
                      }}
                    >
                      加载中...
                    </div>
                  ) : (
                    ''
                  )}
                  {videos?.length === 0 && !loading ? (
                    <div
                      style={{
                        position: 'relative',
                        top: '190px',
                        left: '60px',
                        marginTop: '-10px',
                        color: '#fff',
                      }}
                    >
                      暂无数据
                    </div>
                  ) : (
                    ''
                  )}
                </InfiniteScroll>
              </Scrollbars>
            </Col>
            {showRightSp ? (
              <Col span={17} className={styles.rights}>
                <Row className={styles.titleName} style={{ color: '#ffeb3b' }}>
                  <span>{videoDetail.vedioName}</span>
                </Row>
                <Row className={styles.ylName}>- 视频预览 -</Row>
                <Row className={styles.videosshow}>
                  <VideoPlayer key={videoUrlHK} src={videoUrlHK} />
                </Row>
                <Row className={styles.srcName}>
                  <span>路径</span>
                  <span>{videoUrlHK}</span>
                </Row>
                <Row className={styles.typeName}>
                  <span>类别</span>
                  <Input value={category} onChange={changeCategory} maxLength={100} />
                  <span>(字数&lt;100)</span>
                </Row>
                <Row className={styles.jkName}>
                  <span>类型</span>
                  <Select value={cameraType} style={{ width: '30%' }} onChange={setCameraTypes}>
                    <Option value="0">人脸</Option>
                    <Option value="1">监控</Option>
                  </Select>
                </Row>
                <Row>
                  <div className={styles.leftImg}>
                    <span>图标</span>
                  </div>
                  <div className={styles.rightImg}>
                    <Radio.Group onChange={changeImg} value={imgValue} className={styles.allIcon}>
                      {iconList?.map((icons: any) => {
                        return (
                          icons?.childrenList?.length > 0 && (
                            <Radio
                              key={icons.id}
                              value={icons.id}
                              style={{ position: 'relative' }}
                              className={styles.iconBox}
                            >
                              <span className={styles.plots}>
                                <Tooltip placement="bottom" color="blue" title={icons.title}>
                                  <img
                                    onClick={() => {
                                      if (!spbd) return;
                                      mapSpbd = icons.minioFileUrl;
                                    }}
                                    src={icons.minioFileUrl}
                                  />
                                </Tooltip>
                              </span>
                            </Radio>
                          )
                        );
                      })}
                    </Radio.Group>
                  </div>
                </Row>
                <Row className={styles.models}>
                  <Col className={styles.header}>
                    <span>模型选择</span>
                  </Col>
                  <Col span={16} offset={1} className={styles.select}>
                    <Modelload
                      ref={updatemodel}
                      map={map}
                      modelTreeData={modelTreeData}
                      clearSelect={() => {
                        setMOdelTree({});
                      }}
                      setModelTreeData={(data: any) => {
                        const enetity = JSON.parse(data.data.entity || '{}');
                        console.log(data, '模型选择', enetity);
                        setMOdelTree(data);
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.spbd}>
                  <span>视频标点</span>
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    checked={spbd}
                    onClick={changeSpbd}
                    className={styles.switchOne}
                  />
                  {!spbd ? (
                    <div className={styles.showPoint}>
                      <p>
                        <span>经度：</span>
                        <span>{cameraPosition.lng}</span>
                      </p>
                      <p>
                        <span>纬度：</span>
                        <span>{cameraPosition.lat}</span>
                      </p>
                      <p>
                        <span>高度：</span>
                        <span>{cameraPosition.height}</span>
                      </p>
                    </div>
                  ) : (
                    <div className={styles.showPoint}>
                      <p>
                        <span>经度：</span>
                        <Input
                          value={cameraPosition.lng}
                          onChange={(e) => {
                            setCameraP({ ...cameraPosition, lng: e.target.value });
                            controlSJ.current.lng = e.target.value;
                          }}
                        />
                      </p>
                      <p>
                        <span>纬度：</span>
                        <Input
                          value={cameraPosition.lat}
                          onChange={(e) => {
                            setCameraP({ ...cameraPosition, lat: e.target.value });
                            controlSJ.current.lat = e.target.value;
                          }}
                        />
                      </p>
                      <p>
                        <span>高度：</span>
                        <Input
                          value={cameraPosition.height}
                          onChange={(e) => {
                            setCameraP({ ...cameraPosition, height: e.target.value });
                            controlSJ.current.alt = e.target.value;
                          }}
                        />
                      </p>
                      <Button type="primary" onClick={flyToPoint}>
                        预览
                      </Button>
                    </div>
                  )}
                </Row>
                <Row className={styles.sytz}>
                  <span>视野调整</span>
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    checked={sytz}
                    onClick={syChange}
                    className={styles.switchTow}
                  />
                  {sytz && (
                    <>
                      <div className={styles.sytzBox}>
                        <div className={styles.actionTitle}>调整视野</div>
                        <div className={styles.canshutitleBox}>
                          <div className={styles.canshutitle}>单位距离</div>
                          <InputNumber
                            size="small"
                            min={0}
                            max={10}
                            className={styles.canshuinput}
                            defaultValue={DWDistance.current}
                            autoComplete="off"
                            onChange={(value: any) => {
                              DWDistance.current = value;
                            }}
                          />
                          <div className={styles.canshunote}>(大于0)</div>
                          <div className="clear" />
                        </div>
                        <div className={styles.actionbox1}>
                          <div className={styles.actionstitle}>偏移</div>
                          <div
                            id="moveForward"
                            title="前进"
                            className={styles.forward}
                            onClick={() => setMoveForward()}
                            onMouseDown={() => {
                              TimeInterval = setInterval(() => {
                                setMoveForward();
                              }, 200);
                            }}
                            onMouseUp={() => {
                              clearInterval(TimeInterval);
                            }}
                          >
                            <i className="fa fa-compress" />
                            前进
                          </div>
                          <div
                            id="moveBackward"
                            title="后退"
                            className={styles.back}
                            onClick={() => setMoveBackward()}
                            onMouseDown={() => {
                              TimeInterval = setInterval(() => {
                                setMoveBackward();
                              }, 200);
                            }}
                            onMouseUp={() => {
                              clearInterval(TimeInterval);
                            }}
                          >
                            <i className="fa fa-expand" />
                            后退
                          </div>
                          <div className="clear" />
                        </div>
                        <div className={styles.eyebtnbg}>
                          <div>
                            <div
                              id="moveUp"
                              title="上升"
                              className={styles.eyebtn1}
                              onClick={() => moveFieldTop()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveFieldTop();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretUpOutlined />
                            </div>
                          </div>
                          <div style={{ marginBottom: '3px' }}>
                            <div
                              id="moveLeft"
                              title="左移"
                              className={styles.eyebtn2}
                              onClick={() => moveFieldLeft()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveFieldLeft();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretLeftOutlined />
                            </div>
                            <div
                              id="moveRight"
                              title="右移"
                              className={styles.eyebtn3}
                              onClick={() => moveFieldRight()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveFieldRight();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretRightOutlined />
                            </div>
                          </div>
                          <div>
                            <div
                              id="moveDown"
                              title="下降"
                              className={styles.eyebtn4}
                              onClick={() => moveFieldDown()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveFieldDown();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretDownOutlined />
                            </div>
                          </div>
                          <div className={styles.circle} />
                        </div>
                      </div>
                      <div className={styles.sytzBox}>
                        <div className={styles.actionTitle}>调整视点</div>
                        <div className={styles.canshutitleBox}>
                          <div className={styles.canshutitle}>单位角度</div>
                          <InputNumber
                            size="small"
                            min={0}
                            max={10}
                            className={styles.canshuinput}
                            defaultValue={SDAngle.current}
                            autoComplete="off"
                            onChange={(value: any) => {
                              SDAngle.current = value;
                            }}
                          />
                          <div className={styles.canshunote}>(大于0)</div>
                          <div className="clear" />
                        </div>

                        <div className={styles.actionbox1}>
                          <div className={styles.actionstitle}>旋转</div>
                          <div
                            id="moveForward"
                            title="左旋"
                            className={styles.forward}
                            onClick={() => setRollLeft()}
                            onMouseDown={() => {
                              TimeInterval = setInterval(() => {
                                setRollLeft();
                              }, 200);
                            }}
                            onMouseUp={() => {
                              clearInterval(TimeInterval);
                            }}
                          >
                            <i className="fa fa-compress" />
                            左旋
                          </div>
                          <div
                            id="moveBackward"
                            title="右旋"
                            className={styles.back}
                            onClick={() => setRollRight()}
                            onMouseDown={() => {
                              TimeInterval = setInterval(() => {
                                setRollRight();
                              }, 200);
                            }}
                            onMouseUp={() => {
                              clearInterval(TimeInterval);
                            }}
                          >
                            <i className="fa fa-expand" />
                            右旋
                          </div>
                          <div className="clear" />
                        </div>
                        <div className={styles.actionbox1}>
                          <div className={styles.actionstitle}>缩放</div>
                          <div
                            id="moveForward"
                            title="放大"
                            className={styles.forward}
                            onClick={() => setZoomIn()}
                            onMouseDown={() => {
                              TimeInterval = setInterval(() => {
                                setZoomIn();
                              }, 200);
                            }}
                            onMouseUp={() => {
                              clearInterval(TimeInterval);
                            }}
                          >
                            <i className="fa fa-compress" />
                            放大
                          </div>
                          <div
                            id="moveBackward"
                            title="缩小"
                            className={styles.back}
                            onClick={() => setZoomOut()}
                            onMouseDown={() => {
                              TimeInterval = setInterval(() => {
                                setZoomOut();
                              }, 200);
                            }}
                            onMouseUp={() => {
                              clearInterval(TimeInterval);
                            }}
                          >
                            <i className="fa fa-expand" />
                            缩小
                          </div>
                          <div className="clear" />
                        </div>
                        <div className={styles.eyebtnbg}>
                          <div>
                            <div
                              id="moveUp"
                              title="上看"
                              className={styles.eyebtn1}
                              onClick={() => moveTop()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveTop();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretUpOutlined />
                            </div>
                          </div>
                          <div style={{ marginBottom: '3px' }}>
                            <div
                              id="moveLeft"
                              title="左看"
                              className={styles.eyebtn2}
                              onClick={() => moveLeft()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveLeft();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretLeftOutlined />
                            </div>
                            <div
                              id="moveRight"
                              title="右看"
                              className={styles.eyebtn3}
                              onClick={() => moveRight()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveRight();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretRightOutlined />
                            </div>
                          </div>
                          <div>
                            <div
                              id="moveDown"
                              title="下看"
                              className={styles.eyebtn4}
                              onClick={() => moveDown()}
                              onMouseDown={() => {
                                TimeInterval = setInterval(() => {
                                  moveDown();
                                }, 200);
                              }}
                              onMouseUp={() => {
                                clearInterval(TimeInterval);
                              }}
                            >
                              <CaretDownOutlined />
                            </div>
                          </div>
                          <div className={styles.circle} />
                        </div>
                      </div>
                      <div className={styles.sytzBox} style={{ width: '460px' }}>
                        <div className={styles.actionTitle}> - 三维融合 - </div>
                        <div
                          className={styles.dobtnB}
                          id="videoFuse"
                          onClick={() => {
                            if (Rgba) {
                              message.warning('请先关闭叠加预览');
                              return;
                            }
                            setFuseD(!fuseD);

                            if (!fuseD) {
                              thisCamera();
                            } else {
                              // map.off(mars3d.EventType.click);
                              controlMap(false);
                              try {
                                selectedView.current.play = false;
                                graphicLayerTo.clear();
                                video3D = null;
                                selectedView.current = null;
                                graphicLayerTo = null;
                              } catch (e) {
                                console.log(e);
                              }
                            }
                          }}
                        >
                          {!fuseD ? '融合预览' : '关闭融合'}
                        </div>
                      </div>
                      <div className={styles.sytzBox}>
                        <div className={styles.actionTitle}> - 叠加预览 - </div>
                        <div
                          className={styles.dobtnA}
                          id="videoCoverBtn"
                          onClick={() => {
                            if (fuseD) {
                              message.warning('请先关闭融合预览');
                              return;
                            }
                            setRgba(!Rgba);
                            if (!Rgba) {
                              createVedioGraphic();
                            } else {
                              controlMap(false);
                              map.off(mars3d.EventType.click);
                              if (controlSJ.current) map.setCameraView({ ...controlSJ.current });
                              try {
                                selectedView.current.play = false;
                                graphicLayerIn.clear();
                                video3D = null;
                                selectedView.current = null;
                                map.removeLayer(graphicLayerIn);
                                graphicLayerIn = null;
                              } catch (e) {
                                console.log(e);
                              }
                            }
                          }}
                        >
                          {!Rgba ? '叠加预览' : '关闭预览'}
                        </div>
                        <div className={styles.superposition}>
                          {Rgba && (
                            <div id="videoCloseCoverbox" style={{ width: '80%' }}>
                              <div>
                                <span style={{ color: '#fff' }}>-- 视频透明度 --</span>
                              </div>
                              <div>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  onChange={(value: any) => {
                                    setSliderValue(value);
                                    selectedView.current.opacity = value;
                                  }}
                                  value={typeof sliderValue === 'number' ? sliderValue : 0}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Row>
                <Row className={styles.optionBtn}>
                  <Button type="primary" className={styles.submitBtn} onClick={saveCamera}>
                    保存
                  </Button>
                  <Button type="primary" onClick={removeCamera} danger>
                    删除
                  </Button>
                </Row>
              </Col>
            ) : (
              <div>
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    lineHeight: '428px',
                    marginLeft: '247px',
                  }}
                >
                  暂无数据
                </span>
              </div>
            )}
          </Row>
          {carmeraLoad ? (
            <Row className={styles.loadings}>
              <Space size="middle" style={{ margin: '0 auto' }}>
                <Spin size="large" />
              </Space>
            </Row>
          ) : null}
        </Drawer>
      )}
    </div>
  );
};

export default VideoPunctuation;
