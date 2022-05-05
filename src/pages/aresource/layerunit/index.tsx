import type { Key } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import Mars3d from '../../../components/Mars3d';
import imgplace from '@/assets/img/prepar/编组备份.png';
import { useModel } from 'umi';
import style from '../../securityActivities/prepar/style.less';
import '../../securityActivities/prepar/common.less';
import { Select, Modal, Tree, Input, message, Tooltip, Row, Col, Button, Space } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import {
  getActList,
  queryPlanTree,
  addPlanTree,
  editPlanTree,
  delPlanTree,
  getIcons,
  editPrepar,
  getIconlist,
  addIcon,
  getIcon,
  editIcon,
  solutionDetail,
  solutionDelete,
  copyarplan,
  getType,
  slectPlace,
  slectBaseMap,
  copySolution,
  deleteIcon,
  preview,
} from '../../../services/layerunit';
import Point from '../../securityActivities/prepar/components/point';
import SignList from '../../securityActivities/prepar/components/signList';
import {
  UpOutlined,
  DownOutlined,
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Modelload from '../../securityActivities/prepar/components/modelload';
import jsonloop from 'jsonloop';
import addCircleScanPostStage from '@/utils/glsl';
import VideoPlayer from '@/components/videoPlayer/indexMore'; // 海康视频播放
import DahuaVideo from '@/components/dahuaVideo'; // 大华视频播放
import Import from '../../securityActivities/prepar/components/Importinfo'; //导入
const defaultSeperator = '.';
const cJSON = jsonloop(defaultSeperator);
let map: any = null;
let graphicLayerJK: any = null;
declare global {
  interface Window {
    clickPoint_jk: any;
  }
}
let jsonstyle: any = null;
let videoObj: any = {};
const Layerunit: React.FC = () => {
  const [actOptions, setActOptions] = useState<{ value: string; label: string }[]>(); //活动列表
  const [actName, setActname] = useState<string>(); //默认活动
  const [modalVisible, setModalVisible] = useState(false); //新增、修改弹框
  const [treeData, setTreeData] = useState<any>([]); //树
  const [titleName, setTitleName] = useState<any>([]); //弹框标题
  const [labelName, setLabelName] = useState<any>([]); //弹框label
  const [inputValue, setInputValue] = useState<any>([]); //弹框label
  const [parentId, setParentId] = useState<any>(''); //parentId
  const [activityId, setActId] = useState<any>(''); //活动id
  const [copyactId, setCopyactId] = useState<any>(''); //复制活动id
  const iter = useRef<any>({}); //子节点
  const [viewData, setViewData] = useState({}); //视域
  const [beforeData, setBeforeData] = useState({}); //视域
  const [editFlag, setEditFlag] = useState<boolean>(false); //编辑标记
  const updatePoint: any = useRef();
  const { initialState } = useModel('@@initialState'); //引入地图
  const tuceng = useRef<any>();
  const updatemodel: any = useRef();
  map = initialState?.map;

  const [geojson, setGeojson] = useState<any>(); //坐标
  const [pointinfo, setPointinfo] = useState<boolean>(true); //坐标列表
  const [tag, setTag] = useState<boolean>(true); //坐标列表伸展
  const [iconList, setIconList] = useState<any[]>([]); //图标列表
  const [iconTitle, setIconTitle] = useState<any[]>([]); //图标列表
  const [planID, setPlanId] = useState<string>(''); //预案id
  const [iconID, setIconID] = useState<string>(); //图标id
  const [modelTreeData, setMOdelTree] = useState<any>({});
  const [stylefill, setStyle] = useState<{ type?: any; billboard?: any; material?: any }>({});
  const [currentGraphic, setCurrentGraphic] = useState<any>(null);
  const [selectKeys, setSeletedKeys] = useState<Key[]>([]); //树选择的key
  const [markList, setMarkList] = useState<any[]>([]); //标记列表
  const [copyFlag, setCopyFlag] = useState<boolean>(false);
  const [copyarplanSure, setCopyarplanSure] = useState<boolean>(false);
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [deleteGraphic, setDeleteGraphic] = useState<any>();
  const [addpre, setAddpre] = useState<boolean>(false);
  const [solutionList, setSolutionList] = useState(null); //预案点位表详情
  const [markviewer, setMarkviewer] = useState(null); //预案点位表视角
  const [stateList, setstateList] = useState<any[]>([]); //类型
  const [icTitle, setIctitle] = useState<string>('');
  const [typeLabel, setTypeLabel] = useState<any>(); //类型名称
  const [currentsViews, setCurrentsViews] = useState<any>(); //当前场景视域
  const [baseData, setBaseData] = useState<any>(); //属性及场馆
  const [videoUrlHK, setVideoUrlHK] = useState<string[]>([]); // 海康视频地址
  const [videoUrlDH, setVideoUrlDH] = useState<string[] | string>([]); // 海康视频地址
  const [sectorflag, setSectorflag] = useState<boolean>(true); //扇形是否显示编辑
  const [importVisible, setImportVisible] = useState<boolean>(false); //导入状态

  const currentId = useRef<string>('');
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
  // 方案详情
  const form = useRef<
    ProFormInstance<{
      date: string;
    }>
  >();
  // 获取预案树
  const getTree = (val: any, label: any) => {
    // 预案树
    setTreeData([]);
    queryPlanTree({ sceneId: val }).then((res) => {
      const result = res?.data;
      const treeList = [
        {
          title: label,
          key: '0-0',
          id: '0-0',
          children: result,
        },
      ];
      setPlanId(iter?.current?.id || '');
      setSeletedKeys([iter?.current?.id ? iter?.current?.id : '0-0']);
      setTreeData(treeList);
    });
  };
  const actChange = (val: any, options: any) => {
    setActId(val);
    setActname(options.label);
    getTree(val, options.label);
    flyHome(val);
  };
  // 新增树
  const treeAddFun = (msg: any) => {
    setTitleName('新增方案');
    setLabelName('方案名称');
    setParentId(msg?.id || '');
    setModalVisible(true);
  };
  const treeAdd = () => {
    const query = {
      parentId,
      sceneId: activityId,
      name: inputValue,
    };
    addPlanTree({ ...query }).then(() => {
      getTree(activityId, actName);
    });
  };
  // 编辑树
  const treeEitFun = (msg: any) => {
    setTitleName('修改方案');
    setLabelName('方案名称');
    iter.current = msg;
    setModalVisible(true);
  };
  const treeEdit = () => {
    const query = {
      id: iter.current.id,
      name: inputValue,
    };
    editPlanTree({ ...query }).then(() => {
      getTree(activityId, actName);
    });
  };
  const treeDel = () => {
    delPlanTree([iter.current.id]).then((res) => {
      if (res.code == 200) {
        getTree(activityId, actName);
      }
    });
  };
  // 删除树
  const treeDelFun = (item: any) => {
    setTitleName('删除方案');
    Modal.confirm({
      title: '是否确认删除该预案？',
      onOk: () => {
        treeDel();
      },
    });
    iter.current = item;
  };

  const renderOperate = (node: any) => {
    return (
      <Space>
        <span>{node.title}</span>
        <span onClick={() => treeAddFun(node.data)}>
          <PlusSquareOutlined
            className="treeSelect"
            style={selectKeys[0] === node?.key ? { display: 'block' } : { display: 'none' }}
          />
        </span>
        {node?.data && (
          <>
            <span onClick={() => treeEitFun(node.data)}>
              <EditOutlined
                className="treeSelect"
                style={selectKeys[0] === node?.key ? { display: 'block' } : { display: 'none' }}
              />
            </span>
            <span onClick={() => treeDelFun(node.data)}>
              <DeleteOutlined
                className="treeSelect"
                style={selectKeys[0] === node?.key ? { display: 'block' } : { display: 'none' }}
              />
            </span>
          </>
        )}
      </Space>
    );
  };

  const bindContext = (graphics: any) => {
    if (!graphics) return;
    let content: any[] = [
      {
        text: '开始编辑对象',
        iconCls: 'fa fa-edit',
        show: function (e: any) {
          const graphic = e.graphic;
          if (!graphic || !graphic.startEditing) {
            return false;
          }
          return !graphic.isEditing;
        },
        callback: async function (e: any) {
          const graphic = e.graphic;
          if (graphic) {
            if (!planID) {
              message.warning('根节点不能修改标记哦！');
              return;
            }
            if (!currentId.current) {
              currentId.current = graphic.id;
            } else {
              if (currentId.current !== graphic.id) {
                message.warning('请编辑完图标再编辑！');
                return false;
              }
            }
            graphic.startEditing(graphic);
            //获取预案点位表详情
            const { data } = await solutionDetail({ id: graphic?.options?.attr?.data?.id }).catch(
              (err) => {
                message.error(err.message || err);
                return Promise.resolve(err);
              },
            );
            setSolutionList(data);
            setGeojson(graphic?.options?.position || [graphic?.options?.positions]);
            setCurrentGraphic(graphic);
            setEditFlag(true);
            setPointinfo(false);
            const markviewerinfo = map.getCameraView();
            setMarkviewer(markviewerinfo);
            tuceng.current.on(mars3d.EventType.editMovePoint, function (event: any) {
              setCurrentGraphic(event?.graphic);
              updatePoint.current.changeDiffHeight(event?.graphic.options.style.diffHeight);
              updatePoint.current.changeMsg(event?.graphic.toGeoJSON()?.geometry?.coordinates);
            });
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: '停止编辑对象',
        iconCls: 'fa fa-edit',
        show: function (e: any) {
          const graphic = e.graphic;
          if (!graphic) {
            return false;
          }
          return graphic.isEditing;
        },
        callback: function (e: any) {
          const graphic = e.graphic;
          if (graphic) {
            currentId.current = '';
            graphic.stopEditing(graphic);
            updatePoint.current.changes();
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: '删除对象',
        iconCls: 'fa fa-trash-o',
        show: (event: any) => {
          const graphic = event.graphic;
          if (!graphic || graphic.isDestroy) {
            return false;
          } else {
            return true;
          }
        },
        callback: function (e: any) {
          const graphic = e.graphic;

          if (!currentId.current) {
            currentId.current = graphic.id;
          } else {
            if (currentId.current !== graphic.id) {
              message.warning('请编辑完图标再编辑！');
              return;
            }
          }

          if (!graphic) {
            return;
          }
          setDeleteGraphic(graphic);
          setDeleteFlag(true);
        },
      },
    ];
    if (sectorflag) {
      if (graphics?.options?.name === '扇形雷达' || graphics?.options?.attr?.name === '扇形雷达') {
        content = [
          {
            text: '编辑对象',
            iconCls: 'fa fa-trash-o',
            show: (event: any) => {
              const graphic = event.graphic;
              if (!graphic) {
                return false;
              } else {
                return true;
              }
            },
            callback: function (e: any) {
              const graphic = e.graphic;
              if (!currentId.current) {
                currentId.current = graphic?.options?.attr?.data?.id;
              } else {
                if (currentId.current !== graphic?.options?.attr?.data?.id) {
                  message.warning('请编辑完图标再编辑！');
                  return;
                }
              }

              setSectorflag(false);
              solutionDelete([graphic?.options?.attr?.data?.iconLayerId]).then((res) => {
                console.log('删除成功', res);
              });
              const { startAngle, endAngle, rotationDegree } = graphic?.options?.style;
              const info = graphic.toGeoJSON();
              const res = info.geometry.coordinates;
              setGeojson(res);
              const radius = info.properties?.style?.radius;
              tuceng.current.removeGraphic(graphic);
              const circlegraphic = addCircleScanPostStage(
                res,
                radius,
                startAngle,
                endAngle,
                rotationDegree,
              );
              setCurrentGraphic(circlegraphic);
              bindContext(circlegraphic);
              tuceng.current.addGraphic(circlegraphic);
              setPointinfo(false);
            },
          },
          ...content,
        ];
      }
    }
    graphics?.bindContextMenu(content);
  };
  const layerRander = (data: any, imports?: any) => {
    if (tuceng.current) {
      tuceng.current.clear();
      map.removeLayer(tuceng.current);
    }
    tuceng.current = new mars3d.layer.GraphicLayer();
    map.addLayer(tuceng.current);
    if (!data) return;
    const graphics: any[] = [];
    data?.map((item: any) => {
      try {
        if (item.entity !== '') {
          const entity = cJSON.parse(item.entity || '{}');
          const graphic = entity?.GeoJSON
            ? mars3d.Util.geoJsonToGraphics(entity?.GeoJSON)[0]
            : undefined;
          graphic.pointerEvents = true;
          if (graphic.type === 'circle') {
            let _rotation = Math.random();
            graphic.style.stRotation = new Cesium.CallbackProperty(function () {
              _rotation -= 0.1;
              return _rotation;
            }, false);
          }
          if (graphic) {
            graphic.attr.data = item;
            graphics.push(graphic);
          } else {
            const e = '解析失败';
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw e;
          }
        }
      } catch (err: any) {
        console.log(err);
      }
    });
    graphics.map((item) => {
      tuceng.current.addGraphic(item);
    });
    if (imports) {
      editPrepar({ id: planID, geoJSON: cJSON.stringify(tuceng.current.toGeoJSON()) }).catch(
        (err) => {
          message.error(err.message || err);
        },
      );
      updatePoint.current?.changes();
    }
    tuceng.current.eachGraphic((e: any) => {
      bindContext(e);
    });
  };
  const videoFun = (video: any) => {
    if (video.videoType === 'f0f9ed28-133a-4a02-a8c2-a56873106ee3' || video.videoType === 'dhlw') {
      video.videoTypeName = 'dhlw';
      //大华
    } else if (video.videoType === 'b76a4c09-35a5-4f83-ae4f-315860ad3680') {
      video.videoTypeName = 'HLS';
      //海康
    }
    video.videoName = video.vedioName;
    updatePoint.current.videoChange(video);
  };
  //点击聚合点监控
  window.clickPoint_jk = (data: any) => {
    videoFun(videoObj[data]);
  };
  const iconFun = (item: any) => {
    let imgUrl = '';
    if (item.vvideoId.indexOf('_A') != -1) {
      imgUrl = '/img/mapImg/video_qiangji.svg';
    } else if (item.vvideoId.indexOf('_B') != -1) {
      imgUrl = '/img/mapImg/video_qiuji.svg';
    } else {
      imgUrl = '/img/mapImg/video_banqiuji.svg';
    }
    return imgUrl;
  };
  // 显示监控
  const addFeature = (arr: any) => {
    videoObj = {};
    // 聚合图层点位采集
    graphicLayerJK = new mars3d.layer.GraphicLayer({
      // clustering: {
      //   enabled: true,
      //   pixelRange: 80,
      // },
      name: '监控点位',
      show: true,
    });
    map.addLayer(graphicLayerJK);
    graphicLayerJK.bindContextMenu([
      {
        text: '添加监控',
        show: function (e: any) {
          const graphic = e.graphic;
          if (!graphic || !graphic.startEditing) {
            return false;
          }
          return !graphic.isEditing;
        },
        callback: function (e: any) {
          const graphic = e.graphic;
          if (!graphic) {
            return;
          }
          if (graphic) {
            videoFun(graphic.options.attr);
          }
        },
      },
    ]);
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      videoObj[item.vvideoId] = item;
      const position = new mars3d.LatLngPoint(item.lon, item.lat, item.height || 0);
      const defaultIcon = iconFun(item);
      const primitive = new mars3d.graphic.BillboardEntity({
        position: position,
        style: {
          image: item?.iconID?.length > 2 ? item.minioFileUrl : defaultIcon,
          width: 24,
          height: 24,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
        },
        attr: item,
        name: `${item.vvideoId}++${item.vedioName}`,
      });
      graphicLayerJK.addGraphic(primitive);
    }
    graphicLayerJK.bindPopup(
      function (event: any) {
        const item = event.graphic?.options?.attr;
        let innerPopup: any;
        if (item) {
          innerPopup = `<div>${item.vedioName}</div>`;
        } else {
          innerPopup =
            '<div class="zyglTp"><div class="tops"><span>列表</span></div><ul class="ulScrollBox">';
          event.id.map((val: any) => {
            const idName = val.name.split('++');
            innerPopup += `<li class="zyLi" onClick="clickPoint_jk('${idName[0]}')">
                <img src="${val._billboard._image._value}" />
                <span>${idName[1]}</span>
              </li>`;
          });
          innerPopup += '</ul></div>';
        }
        return innerPopup;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
    graphicLayerJK.on(mars3d.EventType.click, function (event: any) {
      //单机
      const video = event?.graphic?.options?.attr;
      if (
        video.videoType === 'f0f9ed28-133a-4a02-a8c2-a56873106ee3' ||
        video.videoType === 'dhlw'
      ) {
        //  大华
        setVideoUrlDH(video?.vvideoId);
      } else if (video.videoType === 'b76a4c09-35a5-4f83-ae4f-315860ad3680') {
        const platform = video.source === '1' ? 'ISC' : 'IOT';
        preview({
          data: {
            cameraId: video?.vvideoId,
            platform: platform,
            protocol: 'hls',
            expand: 'transcode=1&videotype=h264',
          },
        })
          .then((res: any) => {
            setVideoUrlHK([res.result.result]);
          })
          .catch((err: any) => {
            message.error(err.message || err);
          });
        // 海康
      }
    });
  };
  const videoRander = (videoList: any) => {
    addFeature(videoList);
  };
  //树选择
  const treeSelect = (msg: any, e: any) => {
    if (!pointinfo) {
      message.warning('请编辑完图标再切换图层');
      return;
    }
    setTypeLabel('');
    if (form.current) form.current.resetFields();
    setTag(true);
    updatemodel.current?.clear();
    iter.current = e.node?.data;
    setPlanId(e.node?.data?.id);
    setSeletedKeys([e.node?.data?.id || e.node?.key]);
    if (e.node?.data?.entity) {
      try {
        const data = cJSON.parse(e.node?.data?.entity || '{}');
        const str = stateList?.find((item: any) => {
          return item.value === data.type;
        });
        setTypeLabel(str?.label);
        setBaseData(data);
        if (form?.current) form?.current?.setFieldsValue(data);
        setMOdelTree(data?.modelTreeData);
        setBeforeData(data?.view);
        if (data?.modelTreeData?.data?.entity) {
          updatemodel.current?.loadmodel(
            cJSON.parse(data?.modelTreeData?.data?.entity || '{}'),
            function () {
              map.centerAt(data?.view);
            },
          );
        } else {
          map.centerAt(data?.view);
        }
      } catch (err) {
        console.log(err);
        message.error('JSON格式不正确');
        setAddpre(!addpre); //刷新
      }
    } else {
      setMOdelTree({});
    }
  };
  //弹框结果
  const handleOk = () => {
    setModalVisible(false);
    if (titleName === '新增方案') treeAdd();
    if (titleName === '修改方案') treeEdit();
    if (titleName === '删除方案') treeDel();
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const markMap = (item: any) => {
    if (currentId.current) message.warn('请编辑完图标再新增！');
    setGeojson([]);
    if (!tuceng.current) {
      tuceng.current = new mars3d.layer.GraphicLayer();
      map.addLayer(tuceng.current);
    }
    let selfstyle: any = JSON.parse(item.style || '{}');
    jsonstyle = selfstyle;
    setIctitle(item.title);
    if (item.typeName === 'billboard') {
      selfstyle.image = item?.minioFileUrl;
      selfstyle.width = 96;
      selfstyle.height = 96;
    }
    if (item.typeName === 'polyline') {
      selfstyle.color = jsonstyle?.color || '#ff8833';
      selfstyle.zIndex = jsonstyle?.zIndex || 1;
      selfstyle.width = jsonstyle?.width || 10;
      selfstyle.clampToGround = jsonstyle?.clampToGround || false;
      selfstyle.outline = jsonstyle?.outline || false;
      selfstyle.opacity = jsonstyle?.opacity || 1;
      selfstyle.closure = jsonstyle?.closure || false;
      selfstyle.distanceDisplayCondition = jsonstyle?.distanceDisplayCondition || false;
      selfstyle.distanceDisplayCondition_far = jsonstyle?.distanceDisplayCondition_far || 3000;
      selfstyle.distanceDisplayCondition_near = jsonstyle?.distanceDisplayCondition_near || 1;
      selfstyle.outlineWidth = jsonstyle?.outlineWidth || 3;
      selfstyle.speed = jsonstyle?.speed || 1;
      selfstyle.materialType = jsonstyle?.materialType || 'LineFlow';
      selfstyle.image = jsonstyle?.image || '/img/prepar/lineClr2.png';
    }
    if (item.typeName === 'div') {
      selfstyle = {
        html:
          `<div class="yaDiv">
        <div class="title">` +
          '上午赛事' +
          `</div>
    </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      };
    }
    if (item.typeName === 'wall') {
      selfstyle.diffHeight = 100;
      selfstyle.speed = selfstyle?.speed || 10;
      selfstyle.materialType = selfstyle?.materialType || 'LineFlow';
      selfstyle.image = jsonstyle?.image || '/img/prepar/imgwall.png';
      selfstyle.repeat = new Cesium.Cartesian2(5, 1);
      selfstyle.axisY = true;
      selfstyle.color = selfstyle?.color || '#bdf700';
      selfstyle.outline = selfstyle?.outline || false;
      selfstyle.opacity = selfstyle?.opacity || 1;
      selfstyle.closure = selfstyle?.closure || false;
      selfstyle.distanceDisplayCondition = selfstyle?.distanceDisplayCondition || false;
      selfstyle.distanceDisplayCondition_far = selfstyle?.distanceDisplayCondition_far || 3000;
      selfstyle.distanceDisplayCondition_near = selfstyle?.distanceDisplayCondition_near || 1;
      selfstyle.outlineWidth = selfstyle?.outlineWidth || 3;
    }
    if (item.typeName === 'circle') {
      let _rotation = Math.random();
      selfstyle = {
        clampToGround: false,
        material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleScan, {
          image: '/img/prepar/imgcircle.png',
          color: new Cesium.Color(0.0, 1.0, 0.0, 0.4),
          opacity: 1.0,
        }),
        stRotation: new Cesium.CallbackProperty(function () {
          _rotation -= 0.1;
          return _rotation;
        }, false),
        classificationType: Cesium.ClassificationType.BOTH,
      };
    }
    setSolutionList(null);
    try {
      tuceng.current.startDraw({
        type: item.typeName === 'circle1' ? 'circle' : item.typeName,
        style: selfstyle,
        drawShowRadius: true,
        pointerEvents: true,
        success: (graphic: any) => {
          if (item.typeName === 'circle1') {
            setSectorflag(false);
            const info = graphic.toGeoJSON();
            const res = info.geometry.coordinates;
            setGeojson(res);
            const radius = info.properties?.style?.radius;
            tuceng.current.removeGraphic(graphic);
            const circlegraphic = addCircleScanPostStage(res, radius, 40, 80);
            setCurrentGraphic(circlegraphic);
            bindContext(circlegraphic);
            tuceng.current.addGraphic(circlegraphic);
            setPointinfo(false);
          } else {
            setCurrentGraphic(graphic);
            bindContext(graphic);
            currentId.current = graphic.id;
            graphic.startEditing(graphic);
            const res = graphic.toGeoJSON();
            setGeojson(
              ['Point', 'Polygon'].includes(res?.geometry?.type)
                ? res.geometry.coordinates
                : [res.geometry.coordinates],
            );
            setPointinfo(false);
            tuceng.current.on(mars3d.EventType.editMovePoint, function (event: any) {
              setCurrentGraphic(event?.graphic);
              updatePoint.current.changeDiffHeight(event?.graphic.options.style.diffHeight);
            });
          }
        },
      });
      const markviewerinfo = map.getCameraView();
      setMarkviewer(markviewerinfo);
    } catch (e) {
      console.log(e);
      message.error('编辑失败');
    }
  };

  const editPointFun = (val: any, lanlat: any) => {
    if (lanlat.length > 0)
      currentGraphic.setOptions(
        lanlat[0] instanceof Array ? { positions: lanlat } : { position: lanlat },
      );
    const selfstyle: any = val.getFieldsValue();
    const type = currentGraphic?.options?.type;
    if (type === 'billboard') setStyle(selfstyle?.billboard);
    if (type === 'polyline') {
      if (selfstyle?.polyline?.materialType === 'LineFlow') {
        selfstyle.polyline.image = selfstyle?.image || '/img/prepar/lineClr2.png';
        selfstyle.polyline.speed = 1;
        setStyle(selfstyle?.polyline);
      } else {
        setStyle(selfstyle?.polyline);
      }
    }
    if (type === 'div') {
      selfstyle.div.html =
        `<div class="yaDiv">
      <div class="title">` +
        selfstyle?.divname +
        `</div>
    </div>`;
      setStyle(selfstyle?.div);
    }
    if (type === 'polygon') setStyle(selfstyle?.polygon);
    if (type === 'label') setStyle(selfstyle?.label);
    if (type === 'wall') {
      const wall: any = {
        ...selfstyle.wall,
      };
      if (selfstyle.wall.materialType === 'Checkerboard') {
        wall.material = mars3d.MaterialUtil.createMaterialProperty(selfstyle.wall.materialType, {
          repeat: new Cesium.Cartesian2(5, 1),
          oddColor: selfstyle.wall.oddColor,
          evenColor: selfstyle.wall.evenColor,
        });
      }
      if (selfstyle.wall.materialType === 'Stripe') {
        wall.material = mars3d.MaterialUtil.createMaterialProperty(selfstyle.wall.materialType, {
          oddColor: selfstyle.wall.oddColor,
          evenColor: selfstyle.wall.evenColor,
        });
      } else {
        wall.material = mars3d.MaterialUtil.createMaterialProperty(
          selfstyle.wall.materialType || 'LineFlow',
          {
            image: '/img/prepar/imgwall.png',
            repeat: new Cesium.Cartesian2(5, 1),
            axisY: true, // 方向，true时上下，false左右
            speed: 10,
            oddColor: 'white',
            ...selfstyle.wall,
          },
        );
      }
      currentGraphic.style = wall;
    }
    if (currentGraphic?.options?.name === '扇形雷达') {
      const { radius, rotationDegree, startAngle, endAngle } = selfstyle?.circle1;
      tuceng.current.removeGraphic(currentGraphic);
      const circlegraphic = addCircleScanPostStage(
        lanlat,
        radius,
        startAngle,
        endAngle,
        rotationDegree,
      );
      setCurrentGraphic(circlegraphic);
      bindContext(circlegraphic);
      tuceng.current.addGraphic(circlegraphic);
    }
  };
  useEffect(() => {
    currentGraphic?.setOptions({ style: stylefill });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stylefill]);
  // 初始化预案管理
  const initFunc = () => {
    //活动列表
    const queryAct = {
      page: 0,
      size: 9999,
    };
    getActList({ queryObject: queryAct }).then((res) => {
      const data = res.result?.page?.content;
      const de =
        data &&
        data.map((item: Record<string, unknown>) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      setActOptions(de);
      setActId(de[0].value);
      // 获取场景视域
      slectPlace({ id: de[0].value })
        .then((content: any) => {
          setCurrentsViews(content.result.detail.views);
        })
        .catch((err: any) => {
          message.error(err.message);
        });

      flyHome(de[0].value);
      setActname(de[0].label);
      getTree(de[0].value, de[0].label);
    });
    // 图标分类
    const queryIcon = {
      page: 0,
      size: 10000000,
      parentId: '13ba9732-5cac-42ee-b1ba-9c8f4f7f34b8',
      propertyName: 'sortIndex',
      ascending: 'true',
    };
    getIconlist({ queryObject: queryIcon })
      .then((res: any) => {
        if (res.code === 200) setIconTitle(res.result.page.content);
      })
      .catch((err) => {
        if (err?.message) {
          message.error(err.message || err);
        }
      });
    // 图标列表
    getIcons({})
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.data.rows.map((item: any) => {
            item.showChildren = false;
            item.childrenList = item?.childrenList?.sort((a: any, b: any) => a.code - b.code);
            return item;
          });
          setIconList(list);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    // 获取类型
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: '66867d78-c4b7-4dd9-a5f8-e3171e620056',
      propertyName: 'sortIndex',
    };
    getType({ queryObject })
      .then((res) => {
        const data = res.result.page.content;
        const de =
          data &&
          data.map((item: Record<string, unknown>) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        setstateList(de);
      })
      .catch((err: any) => {
        message.error(err?.message);
      });
  };
  useEffect(() => {
    initFunc();
    //定义新材质
    const Circle3WaveType = 'Circle3Scan';
    mars3d.MaterialUtil.register(Circle3WaveType, {
      fabric: {
        uniforms: {
          color: new Cesium.Color(0.0, 1.0, 0.0, 0.4),
          startAngle: 0,
          endAngle: 90,
          speed: 10,
          count: 1,
          gradient: 0.01,
        },
        source: `
        #define M_PI 3.1415926535897932384626433832795
        czm_material czm_getMaterial(czm_materialInput materialInput){
         czm_material material = czm_getDefaultMaterial(materialInput);
          material.diffuse = 1.2*color.rgb;
          vec2 st = materialInput.st;
          vec3 str = materialInput.str;
          float dis = distance(st, vec2(0.5, 0.5));
          float per = fract(speed*czm_frameNumber/1000.0);
          float current_radians = atan(st.y-0.5, st.x-0.5);
          float startNum=.0 - startAngle*M_PI/180.0;
          float endNum=.0 - endAngle*M_PI/180.0;
          if (abs(str.z) > 0.001) {
            discard;
          }
           if (dis > 0.5) { 
             discard; 
            } else { 
              float perDis = 0.5 / count;
              float disNum; 
              float bl = .0; 
              for (int i = 0; i <= 999; i++) { 
                if (float(i) <= count) {   
                  disNum = perDis * float(i) - dis + per / count; 
                  if (disNum > 0.0) { 
                    if (disNum < perDis) {  
                      bl = 1.0 - disNum / perDis;
                    }else if (disNum - perDis < perDis) { 
                      bl = 1.0 - abs(1.0 - disNum / perDis); 
                    } 
  
                    if(current_radians >endNum  && current_radians <startNum ){
                      material.alpha = pow(bl, gradient)*0.3; 
                    }else{
                      material.alpha = .0; 
                    }
                   
                     } 
                    } 
                  } 
                  return material; 
                }
             
              }`,
      },
      translucent: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const refresh = (arr: any[], id: string, val?: any, imports?: any) => {
    const queryObject = (arr[0] === '0-0' ? { sceneId: id } : { listId: arr[0] }) as any;
    queryObject.name = val;
    getIcon(queryObject)
      .then((res) => {
        if (res.code == 200) {
          const data = res.data.rows;
          setMarkList(data);
          layerRander(data, imports);
        }
      })
      .catch((err) => {
        if (err?.message) {
          message.error(err.message || err);
        }
      });
  };
  // 删除标点
  const solutionDeleteFun = () => {
    const graphic = deleteGraphic;
    solutionDelete([graphic?.options?.attr?.data?.iconLayerId])
      .then((res) => {
        if (res.code === 200) {
          message.success('删除成功');
          if (currentId.current === graphic.id) {
            currentId.current = '';
            setPointinfo(true);
          }
          setDeleteFlag(false);
          refresh(selectKeys, activityId, undefined, 'import');
          tuceng.current.removeGraphic(graphic);
        }
      })
      .catch((err) => {
        if (err?.message) {
          message.error(err.message || err);
        }
      });
    tuceng.current.removeGraphic(graphic);
  };
  const changeItem = (
    val: any,
    solutionPersonList: any,
    solutionDeviceList: any,
    solutionVedioList: any,
  ) => {
    setSectorflag(true);
    const entity: { GeoJSON?: any; info?: { self: any; name: any; code: any } } = {
      info: { self: null, name: null, code: null },
    };
    if (currentGraphic?.options?.name !== '扇形雷达') {
      currentGraphic?.stopEditing(currentGraphic);
    }
    currentId.current = '';
    entity!.info!.self = val.getFieldValue().self;
    entity!.info!.name = val.getFieldValue().name;
    entity!.info!.code = val.getFieldValue().code;

    currentGraphic.attr.data = { ...currentGraphic.attr.data, info: entity.info };
    entity.GeoJSON = currentGraphic.toGeoJSON();
    if (entity!.GeoJSON!.properties!.type === 'polyline') {
      entity!.GeoJSON!.properties!.style!.color = val.getFieldValue()?.polyline?.color;
    }
    if (entity!.GeoJSON!.properties!.type === 'wall') {
      entity!.GeoJSON!.properties!.style!.diffHeight = val.getFieldValue()?.wall?.diffHeight;
    }
    const DeviceList = solutionDeviceList?.map((item: any) => {
      return { deviceId: item.deviceId ? item.deviceId : item.id };
    });
    const PersonList = solutionPersonList?.map((item: any) => {
      return { personId: item.personId ? item.personId : item.id };
    });
    const VedioList = solutionVedioList?.map((item: any) => {
      return { vedioID: item.vedioID === item.vvideoId ? item.id : item.vedioID };
    });
    if (editFlag) {
      delete entity.GeoJSON.properties.data;
    }

    const str = cJSON.stringify(entity);
    const queryObject = {
      lon:
        entity.GeoJSON.geometry.type !== 'Point'
          ? entity.GeoJSON.geometry.type === 'Polygon'
            ? entity.GeoJSON?.geometry?.coordinates[0][0][0]
            : entity.GeoJSON?.geometry?.coordinates[0][0]
          : entity.GeoJSON?.geometry?.coordinates[0],
      lat:
        entity.GeoJSON.geometry.type !== 'Point'
          ? entity.GeoJSON.geometry.type === 'Polygon'
            ? entity.GeoJSON?.geometry?.coordinates[0][0][1]
            : entity.GeoJSON?.geometry?.coordinates[0][1]
          : entity.GeoJSON?.geometry?.coordinates[1],
      height:
        entity.GeoJSON.geometry.type !== 'Point'
          ? entity.GeoJSON.geometry.type === 'Polygon'
            ? entity.GeoJSON?.geometry?.coordinates[0][0][2]
            : entity.GeoJSON?.geometry?.coordinates[0][2]
          : entity.GeoJSON?.geometry?.coordinates[2],
      iconID: iconID,
      listId: planID,
      planID,
      name: val.getFieldValue().name,
      entity: str,
      solutionDeviceList: DeviceList,
      solutionPersonList: PersonList,
      solutionVedioList: VedioList,
    };

    if (editFlag) {
      editPrepar({ id: planID, geoJSON: cJSON.stringify(tuceng.current.toGeoJSON()) }).catch(
        (err) => {
          message.error(err.message || err);
        },
      );
      const id = currentGraphic?.options?.attr?.data?.id;
      editIcon({ ...queryObject, id })
        .then((res) => {
          if (res.code == 200) {
            setPointinfo(true);
            setEditFlag(false);
            message.success('编辑成功');
            setAddpre(!addpre); //刷新
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      addIcon(queryObject)
        .then((res) => {
          if (res.code == 200) {
            setPointinfo(true);
            editIcon({ ...res.data.arSolution, listId: res.data.listId, planID: res.data.listId });
            const info = JSON.parse(res.data.arSolution.entity).info;
            currentGraphic.attr.data = { ...res.data.arSolution, info };
            const geoJSON = tuceng.current.toGeoJSON();

            geoJSON.features[
              geoJSON.features.length - 1 < 0 ? 0 : geoJSON.features.length - 1
            ].properties.style.color = currentGraphic.options.style.color; //toGeoJSON 有bug最后一个默认是白色
            editPrepar({ id: planID, geoJSON: cJSON.stringify(geoJSON) }).catch((err) => {
              message.error(err.message || err);
            });
            message.success('新增成功');
            setAddpre(!addpre); //刷新
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    map.removeLayer(graphicLayerJK);
  };
  useEffect(() => {
    if (selectKeys.length === 0) return;
    refresh(selectKeys, activityId);
    // refresh(selectKeys, activityId, undefined, 'import');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectKeys, addpre]);
  const getCurrentEye = () => {
    const viewer = map.getCameraView();
    setViewData(viewer);
    if (beforeData) {
      setBeforeData(viewer);
      message.success('视域更新成功');
    }
  };

  const flypositon = () => {
    map.centerAt(markviewer);
  };
  // 弹框
  // 不删除原先预案
  const copyarplanCancle = (msg: boolean) => {
    const query = {
      sceneId: activityId,
      isClear: msg ? 1 : 0,
      targetSceneId: copyactId,
    };
    copyarplan(query)
      .then((res) => {
        if (res.code === 200) {
          message.success('复制成功');
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    setCopyarplanSure(false);
  };
  //删除原先预案
  const copyarplanFun = () => {
    copyarplanCancle(true);
  };
  const copyOk = () => {
    queryPlanTree({ activityId: copyactId })
      .then((res) => {
        if (res?.data?.length > 0) {
          setCopyarplanSure(true);
        } else {
          copyarplanCancle(false);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    setCopyFlag(false);
  };
  const copyCancel = () => {
    setCopyFlag(false);
  };
  return (
    <div className={style.wrap}>
      <Mars3d lnglat={() => {}} />
      {/* 编辑预案内容 */}
      <div className={style.bjyaContent}>
        <div className={style.abfaTitle}>
          <span>图层图元管理</span>
        </div>
        <div className={style.abfaContent}>
          {/* 方案管理 */}
          <div className={style.faglContent}>
            <div className={style.plan_name}>
              <span>*</span> 选择场景
            </div>
            <Select
              showSearch
              optionFilterProp="label"
              className={style.planSelect}
              value={activityId}
              options={actOptions}
              onChange={(val, option) => {
                actChange(val, option);
                // 获取场景视域
                slectPlace({ id: val })
                  .then((res) => {
                    setCurrentsViews(res.result.detail.views);
                  })
                  .catch((err: any) => {
                    message.error(err.message);
                  });
              }}
            />
            <HomeOutlined
              style={{ fontSize: '25px', padding: '5px' }}
              onClick={() => {
                flyHome(activityId);
              }}
            />
            <Button
              style={{
                marginLeft: '5px',
                padding: '0 10px',
                minWidth: '60px',
                borderColor: '#949191',
              }}
              key="show"
              onClick={() => {
                setCopyFlag(true);
              }}
            >
              复制
            </Button>
            {planID !== '' && (
              <Button
                style={{
                  marginLeft: '5px',
                  padding: '0 10px',
                  minWidth: '60px',
                  borderColor: '#949191',
                }}
                onClick={() => {
                  if (!planID) {
                    message.warning('请选择预案');
                  } else {
                    setImportVisible(true);
                  }
                }}
              >
                导入
              </Button>
            )}
            <Button
              style={{
                marginLeft: '5px',
                padding: '0 10px',
                minWidth: '60px',
                borderColor: '#949191',
              }}
              key="show"
              onClick={() => {
                // 停止编辑
                currentId.current = '';
                updatePoint.current?.changes();
                // 初始化
                iter.current = null;
                initFunc();
              }}
            >
              重置
            </Button>
          </div>
          <div className={style.part}>
            {/* 左边的树 */}
            <div className={style.tree}>
              {treeData.length > 0 && (
                <Tree
                  key={treeData.children?.length || '1'}
                  blockNode={true}
                  className={style.treebg}
                  showLine={{
                    showLeafIcon: false,
                  }}
                  onSelect={treeSelect}
                  treeData={treeData}
                  selectedKeys={selectKeys}
                  titleRender={(node) => renderOperate(node)}
                  defaultExpandAll={true}
                />
              )}
            </div>
            {/* 方案详情 */}
            <div className={style.planDetail}>
              <div className={style.planTitle}>
                <div
                  onClick={() => {
                    setTag(true);
                    setTimeout(() => {
                      if (form?.current) form?.current?.setFieldsValue(baseData);
                    });
                  }}
                  className={tag ? style.act : ''}
                >
                  属性及场馆
                </div>
                <div
                  onClick={() => {
                    setTag(false);
                  }}
                  className={!tag ? style.act : ''}
                >
                  标记列表
                </div>
              </div>
              {tag ? (
                <div className={style.tag}>
                  <div style={{ height: 'calc(100vh - 246px)', overflowY: 'auto' }}>
                    <div>
                      <div className={style.homeTitle}>
                        <span style={{ verticalAlign: 'bottom', marginRight: '4px' }}>
                          <img src={imgplace} />
                        </span>
                        属性及场馆
                      </div>
                      <ProForm
                        className="self_style_form"
                        submitter={{
                          resetButtonProps: { style: { display: 'none' } },
                          render: (props) => {
                            return [
                              <Row justify="center">
                                <Col>
                                  <Button
                                    key="submit"
                                    onClick={() => {
                                      if (!pointinfo) {
                                        message.warning('请编辑完图标再提交');
                                      } else {
                                        props.form?.submit?.();
                                      }
                                    }}
                                  >
                                    提交
                                  </Button>
                                </Col>
                              </Row>,
                            ];
                          },
                        }}
                        layout="horizontal" //label和输入框一行
                        labelCol={{ style: { width: 70 } }}
                        onFinish={async (val: any) => {
                          if (!planID) {
                            message.warning('根节点不能保存哦！');
                            return;
                          }
                          if (beforeData !== viewData || !beforeData) {
                            message.warn('请重新更新视域');
                          } else {
                            const type = val?.type;
                            const query = cJSON.stringify({
                              ...val,
                              view: viewData,
                              modelTreeData,
                            });
                            editPrepar({
                              id: planID,
                              entity: query,
                              type,
                              layerId: modelTreeData?.data?.id,
                            })
                              .then((res) => {
                                if (res.code === 200) message.success('提交成功');
                                setTypeLabel(
                                  val.type === '80e521f0-b068-4ce9-b968-76cc8e25d91d'
                                    ? '重点区域'
                                    : '',
                                );
                                getTree(activityId, actName);
                              })
                              .catch((err) => {
                                message.error(err.message || err);
                              });
                          }
                        }}
                        formRef={form}
                        params={{ id: '100' }}
                        style={{ padding: '0 30px', lineHeight: '40px' }}
                      >
                        <ProFormText
                          name="name"
                          label="负责人"
                          getValueFromEvent={(e) => e.target.value.trim()}
                          placeholder="请输入名称"
                        />
                        <ProFormText
                          name="tel"
                          label="联系方式"
                          getValueFromEvent={(e) => e.target.value.trim()}
                          placeholder="请输入联系方式"
                        />
                        <ProFormText
                          name="code"
                          label="编码"
                          getValueFromEvent={(e) => e.target.value.trim()}
                          placeholder="请输入编码"
                        />
                        <ProFormSelect name="type" label="类型" options={stateList} />
                        {/* 编码 */}
                        <Row>
                          <Col span={5}>场馆选择:</Col>
                          <Col span={11}>
                            <Modelload
                              clearSelect={() => {
                                setMOdelTree({});
                              }}
                              ref={updatemodel}
                              map={map}
                              modelTreeData={modelTreeData}
                              setModelTreeData={(data: any) => {
                                setMOdelTree(data);
                              }}
                            />
                          </Col>
                          <Col span={6}>
                            <Button
                              onClick={getCurrentEye}
                              style={{ borderColor: '#949191', padding: '0 22px !important' }}
                            >
                              更新视域
                            </Button>
                          </Col>
                        </Row>
                      </ProForm>
                      <div className={style.homeTitle}>
                        <span style={{ verticalAlign: 'bottom', marginRight: '4px' }}>
                          <img src={imgplace} />
                        </span>
                        添加标记
                      </div>
                      {pointinfo ? (
                        <div className={style.iconImg}>
                          {iconTitle?.map((item: any) => {
                            return (
                              <div key={item.id}>
                                <div>| {item.name}</div>
                                {iconList?.map((items: any) => {
                                  if (items.levelName === item.name) {
                                    return items?.childrenList?.length > 1 ? (
                                      <span
                                        key={items.id}
                                        style={{ position: 'relative' }}
                                        className={style.iconBox}
                                      >
                                        <span className={style.plots}>
                                          <Tooltip
                                            placement="bottom"
                                            color="blue"
                                            title={items.title}
                                          >
                                            <img
                                              onClick={() => {
                                                if (!planID) {
                                                  message.warning('根节点不能添加标记哦！');
                                                  return;
                                                }
                                                setIconID(items.id);
                                                markMap(items);
                                              }}
                                              src={items.minioFileUrl}
                                            />
                                          </Tooltip>
                                          <span
                                            onClick={() => {
                                              const newList = iconList.map((val: any) => {
                                                if (items.id === val.id) {
                                                  val.showChildren = !val.showChildren;
                                                }
                                                return val;
                                              });
                                              setIconList(newList);
                                            }}
                                          >
                                            {!items.showChildren ? (
                                              <DownOutlined />
                                            ) : (
                                              <UpOutlined />
                                            )}
                                          </span>
                                        </span>
                                        {items.showChildren && (
                                          <ul className={style.imgList}>
                                            {items.childrenList.map((imgArray: any) => (
                                              <li
                                                onClick={() => {
                                                  const newList = iconList.map((val: any) => {
                                                    if (items.id === val.id) {
                                                      val.minioFileUrl = imgArray.minioFileUrl;
                                                      val.showChildren = false;
                                                    }
                                                    return val;
                                                  });
                                                  setIconList(newList);
                                                }}
                                              >
                                                <img src={imgArray.minioFileUrl} />
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          width: '62px',
                                          height: '62px',
                                        }}
                                        key={items.id}
                                        onClick={() => {
                                          if (!planID) {
                                            message.warning('根节点不能添加标记哦！');
                                            return;
                                          }
                                          setIconID(items.id);
                                          markMap(items);
                                        }}
                                      >
                                        <Tooltip
                                          placement="bottom"
                                          color="blue"
                                          title={items.title}
                                        >
                                          <img className={style.plot} src={items.minioFileUrl} />
                                        </Tooltip>
                                      </span>
                                    );
                                  } else {
                                    return false;
                                  }
                                })}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Point
                          info="图层图元"
                          currentsViews={currentsViews}
                          typeLabel={typeLabel}
                          icTitle={icTitle}
                          jsonstyle={jsonstyle}
                          ref={updatePoint}
                          solutionList={solutionList}
                          graphic={currentGraphic}
                          msg={geojson}
                          changeItem={changeItem}
                          flypositon={() => {
                            flypositon();
                          }}
                          videoRander={videoRander}
                          editFlag={editFlag}
                          deleteItem={(graphic, edit) => {
                            if (edit) {
                              setDeleteGraphic(graphic);
                              setDeleteFlag(true);
                            } else {
                              setPointinfo(true);
                              tuceng.current.removeGraphic(graphic);
                              currentId.current = '';
                            }
                            map.removeLayer(graphicLayerJK);
                          }}
                          editPoint={(val, lnglatt) => {
                            editPointFun(val, lnglatt);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <SignList
                  copySolutionFun={(value, solutionIdList) => {
                    copySolution({ listId: value, solutionIdList })
                      .then((res) => {
                        if (res.code === 200) message.success('复制成功');
                      })
                      .catch((err) => {
                        message.error(err.message || err);
                      });
                  }}
                  deleteIconFun={(msg: any) => {
                    deleteIcon(msg)
                      .then((res) => {
                        if (res.code == 200) {
                          refresh(selectKeys, activityId, undefined, 'import');
                        }
                      })
                      .catch((err) => {
                        message.error(err.message);
                      });
                  }}
                  map={map}
                  treeData={treeData}
                  planID={planID}
                  activityId={activityId}
                  markList={markList}
                  refresh={(val, imports) => {
                    refresh(selectKeys, activityId, val, imports);
                  }}
                  importUrl={'/api/arIconLayer/importJson'}
                  exportUrl={'/api/arIconLayer/exportJson'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        visible={modalVisible}
        title={titleName}
        onOk={handleOk}
        onCancel={handleCancel}
        className={style.modalself}
        key={titleName}
      >
        <span>
          {labelName} :
          <Input
            onChange={(input) => {
              setInputValue(input.target.value);
            }}
            defaultValue={titleName === '修改方案' ? iter?.current?.name : ''}
          />
        </span>
      </Modal>
      {/* 弹框 */}
      <Modal
        maskClosable={false}
        className={style.copy}
        title="复制场景"
        visible={copyFlag}
        onOk={copyOk}
        onCancel={copyCancel}
      >
        <div>
          复制场景至:
          <Select
            showSearch
            className={style.planSelect}
            style={{ width: '300px' }}
            placeholder={'请选择'}
            value={copyactId}
            options={actOptions}
            onChange={(val) => {
              setCopyactId(val);
            }}
          />
        </div>
      </Modal>
      <Modal
        maskClosable={false}
        title="复制图层图元"
        visible={copyarplanSure}
        onOk={copyarplanFun}
        onCancel={() => {
          copyarplanCancle(false);
        }}
      >
        该活动下存在图层图元，请确定是否删除该活动下的图层图元完成复制？
      </Modal>
      <Modal
        maskClosable={false}
        title="删除标点"
        visible={deleteFlag}
        onOk={() => {
          solutionDeleteFun();
          setPointinfo(true);
          currentId.current = '';
          setEditFlag(false);
        }}
        onCancel={() => {
          currentId.current = '';
          setDeleteFlag(false);
        }}
      >
        确定删除该标点？
      </Modal>
      {/* 海康视频播放 */}
      {videoUrlHK.length > 0 && (
        <VideoPlayer
          // key={videoUrlHK}
          viderUrls={videoUrlHK}
          onCancel={() => {
            setVideoUrlHK([]);
          }}
        />
      )}
      {/* 大华视频播放 */}
      {videoUrlDH.length > 0 && (
        <DahuaVideo
          viderUrls={videoUrlDH}
          onCancel={() => {
            setVideoUrlDH([]);
          }}
        />
      )}
      {/* 导入 */}
      {Boolean(importVisible) && (
        <Import
          importUrl={'/api/arIconLayer/importEntity'}
          planID={planID}
          importVisible={importVisible}
          onSub={() => {
            initFunc();
          }}
          ok={() => {
            setImportVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Layerunit;
