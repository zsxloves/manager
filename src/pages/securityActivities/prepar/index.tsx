import type { Key } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import Mars3d from '../../../components/Mars3d';
import imgplace from '@/assets/img/prepar/编组备份.png';
import { useModel } from 'umi';
import style from './style.less';
import './common.less';
import { Select, Modal, Tree, Input, message, Tooltip, Row, Col, Button, Space } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
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
  slectPlace,
  slectBaseMap,
  deleteIcon,
  copySolution,
} from '../../../services/prepar';
import Point from './components/point';
import SignList from './components/signList';
import Task from './components/task';
import {
  UpOutlined,
  DownOutlined,
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
} from '@ant-design/icons';
// import imgsrc from '@/assets/img/prepar/lineClr2.png';
// import imgwall from '@/assets/img/prepar/imgwall.png';
// import imgcircle from '@/assets/img/prepar/imgcircle.png';
import Modelload from './components/modelload';
import jsonloop from 'jsonloop';
const defaultSeperator = '.';
const cJSON = jsonloop(defaultSeperator);
let map: any = null;
let status: any = null;
const treeinfo = {};
let jsonstyle: any = null;
import addCircleScanPostStage from '@/utils/glsl';
import Import from './components/Importinfo'; //导入
let iconLevel = '';
const Prepar: React.FC = () => {
  const [actOptions, setActOptions] = useState<{ value: string; label: string }[]>(); //活动列表
  const [secor, setSecor] = useState<any>(); //扇形雷达
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
  const [flag1, setFlag1] = useState<boolean>(true); //默认
  const [flag2, setFlag2] = useState<boolean>(false); //分段属性
  const [flag3, setFlag3] = useState<boolean>(false); //分级属性
  const [flag4, setFlag4] = useState<boolean>(false); //表格
  const [flag5, setFlag5] = useState<boolean>(false); //自定义
  const [viewData, setViewData] = useState({}); //视域
  const [beforeData, setBeforeData] = useState({}); //视域
  const [editFlag, setEditFlag] = useState<boolean>(false); //编辑标记
  const updatePoint: any = useRef();
  const updatemodel: any = useRef();
  const { initialState } = useModel('@@initialState'); //引入地图
  const tuceng = useRef<any>();
  map = initialState?.map;
  const [geojson, setGeojson] = useState<any>([]); //坐标
  const [pointinfo, setPointinfo] = useState<boolean>(true); //坐标列表
  const [tag, setTag] = useState<boolean>(true); //坐标列表伸展
  const [iconList, setIconList] = useState<any[]>([]); //图标列表
  const [iconTitle, setIconTitle] = useState<any[]>([]); //图标列表
  const [planID, setPlanId] = useState<string>(''); //预案id
  const [iconID, setIconID] = useState<string>(); //图标id

  const [modelTreeData, setMOdelTree] = useState<any>({});
  const [stylefill, setStyle] = useState<{ type?: any; billboard?: any; material?: any }>({});
  const [currentGraphic, setCurrentGraphic] = useState<any>(null);
  const [selectKeys, setSeletedKeys] = useState<Key[]>([]);
  const [markList, setMarkList] = useState<any[]>([]); //标记列表
  const [copyFlag, setCopyFlag] = useState<boolean>(false);
  const [copyarplanSure, setCopyarplanSure] = useState<boolean>(false);
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [deleteGraphic, setDeleteGraphic] = useState<any>();
  const [addpre, setAddpre] = useState<boolean>(false);

  const [solutionList, setSolutionList] = useState(null); //预案点位表详情
  const [markviewer, setMarkviewer] = useState(null); //预案点位表视角
  const [policeFlag, setPoliceFlag] = useState<boolean>(false); //标点是否为警务
  const [giveTask, setGiveTask] = useState<boolean>(false); //是否派发任务
  const [taskName, setTaskName] = useState<string>(''); //任务名称
  const [solutionId, setSolutionId] = useState<string>(''); //任务名称
  const [icTitle, setIctitle] = useState<string>('');
  const currentId = useRef<string>('');
  const [treeshow, setTreeshow] = useState<boolean>(false); //预览树
  const [baseData, setBaseData] = useState<any>(); //属性及场馆
  const [importVisible, setImportVisible] = useState<boolean>(false); //导入状态

  const flyHome = (id: any, type?: any) => {
    slectPlace({ id })
      .then((res) => {
        const data = res?.data?.rows[0];
        const position = JSON.parse(data?.centerPosition || '{}');
        if (type === '预览') {
          if (!Boolean(Object.keys(position || {}).length == 0)) map.centerAt(position);
        } else {
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
        }
      })
      .catch((err) => {
        if (err?.message) {
          message.error(err || err?.message);
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
    queryPlanTree({ activityId: val }).then((res) => {
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
  // 切换活动
  const actChange = (val: any, options: any) => {
    setActId(val);
    setActname(options.label);
    getTree(val, options.label);
    flyHome(val);
  };

  const typeClear = () => {
    setFlag1(false);
    setFlag2(false);
    setFlag3(false);
    setFlag4(false);
    setFlag5(false);
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
      activityId,
      name: inputValue,
    };
    addPlanTree({ ...query })
      .then(() => {
        getTree(activityId, actName);
      })
      .catch((err: any) => {
        message.error(err.message);
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
    editPlanTree({ ...query })
      .then(() => {
        getTree(activityId, actName);
      })
      .catch((err: any) => {
        message.error(err.message);
      });
  };
  const treeDel = () => {
    delPlanTree([iter.current.id])
      .then((res) => {
        if (res.code == 200) {
          getTree(activityId, actName);
        }
      })
      .catch((err: any) => {
        message.error(err.message);
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
    graphics?.bindContextMenu([
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
            if (status !== 'yulan') {
              if (!planID) {
                message.warning('根节点不能修改标记哦！');
                return;
              }
            }
            if (!currentId.current) {
              currentId.current = graphic.id;
            } else {
              if (currentId.current !== graphic.id) {
                message.warning('请编辑完图标再编辑！');
                return false;
              }
            }
            // if (!planID) {
            //   message.warning('根节点不能修改标记哦！');
            //   return;
            // }
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
            updatePoint.current?.changes();
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
    ]);
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
      editPrepar({ id: planID, geoJson: cJSON.stringify(tuceng.current.toGeoJSON()) }).catch(
        (err) => {
          message.error(err.message || err);
        },
      );
      updatePoint.current?.changes();
    }
    // if (imports !== '预览') {
    tuceng.current.eachGraphic((e: any) => {
      bindContext(e);
    });
    // }
  };
  const treeSelect = (msg: any, e: any) => {
    if (!pointinfo) {
      message.warning('请编辑完图标再切换图层');
      return;
    }
    if (form.current) form.current.resetFields();
    setTag(true);
    updatemodel.current?.clear();
    iter.current = e.node?.data;
    setPlanId(e.node?.data?.id);
    setSeletedKeys([e.node?.data?.id || e.node?.key]);
    if (e.node?.data?.entity) {
      try {
        const data = cJSON.parse(e.node?.data?.entity || '{}');
        setBaseData(data);
        if (form?.current) form.current.setFieldsValue(data);
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
      if (form.current) form.current.resetFields();
      setMOdelTree({});
    }
  };
  //弹框结果
  const handleOk = () => {
    setModalVisible(false);
    if (titleName === '新增方案') treeAdd();
    if (titleName === '修改方案') treeEdit();
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const typeChange = (val: any) => {
    typeClear();
    if (val === '默认') {
      setFlag1(true);
    }
    if (val === '分段属性') {
      setFlag2(true);
    }
    if (val === '分级属性') {
      setFlag3(true);
    }
    if (val === '表格') {
      setFlag4(true);
    }
    if (val === '自定义') {
      setFlag5(true);
    }
  };
  const markMap = (item: any) => {
    iconLevel = item?.level;
    if (currentId.current) message.warn('请编辑完图标再新增！');
    setSolutionList(null);
    setGeojson([]);
    if (!tuceng.current) {
      tuceng.current = new mars3d.layer.GraphicLayer();
      map.addLayer(tuceng.current);
    }
    let selfstyle: any = JSON.parse(item.style || '{}');
    setIctitle(item.title);
    jsonstyle = selfstyle;
    if (item.typeName === 'billboard') {
      selfstyle.image = item?.minioFileUrl;
    }
    if (item.typeName === 'polyline') {
      selfstyle.width = 10;
      selfstyle.zIndex = jsonstyle?.zIndex || 1;
      selfstyle.color = jsonstyle?.color || '#ff8833';
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
      // 开始绘制
      selfstyle = {
        clampToGround: false,
        // 扫描材质
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
        pointerEvents: true,
        drawShowRadius: true,
        success: (graphic: any) => {
          if (item.typeName === 'circle1') {
            const info = graphic.toGeoJSON();
            setSecor(info);
            const res = info.geometry.coordinates;
            setGeojson(res);
            const radius = info.properties?.style?.radius;
            tuceng.current.removeGraphic(graphic);
            const circlegraphic = addCircleScanPostStage(res, radius);
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
              updatePoint.current.changeMsg(event?.graphic.toGeoJSON()?.geometry?.coordinates);
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
      const {
        diffHeight,
        closure,
        outline,
        outlineColor,
        distanceDisplayCondition,
        distanceDisplayCondition_far,
        distanceDisplayCondition_near,
      } = selfstyle.wall;
      const wall: any = {
        diffHeight,
        closure,
        outline,
        outlineColor,
        distanceDisplayCondition,
        distanceDisplayCondition_far,
        distanceDisplayCondition_near,
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
      const radius = Number(
        selfstyle?.radius === undefined ? secor.properties?.style?.radius : selfstyle?.radius,
      );
      const rotation = Number(selfstyle?.rotation === undefined ? 0 : selfstyle?.rotation);
      const startAngle = Number(selfstyle?.startAngle === undefined ? 40 : selfstyle?.startAngle);
      const endAngle = Number(selfstyle?.endAngle === undefined ? 80 : selfstyle?.endAngle);
      tuceng.current.removeGraphic(currentGraphic);
      const circlegraphic = addCircleScanPostStage(lanlat, radius, startAngle, endAngle, rotation);
      setCurrentGraphic(circlegraphic);
      bindContext(circlegraphic);
      tuceng.current.addGraphic(circlegraphic);
    }
  };
  useEffect(() => {
    currentGraphic?.setOptions({ style: stylefill });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stylefill]);
  const getIconlistFun = () => {
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
        message.error(err.message || err);
      });
  };
  // 初始化预案管理
  const initFunc = () => {
    //活动列表
    const queryAct = {
      page: 0,
      size: 9999,
    };
    getActList({ queryObject: queryAct }).then((res) => {
      const data = res.result?.page.content;
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
      flyHome(de[0].value);
      setActname(de[0].label);
      getTree(de[0].value, de[0].label);
    });
    getIconlistFun();
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
  const refresh = (arr: any[], id: string, val?: any, imports?: string) => {
    const queryObject = (arr[0] === '0-0' ? { activityId: id } : { planID: arr[0] }) as any;
    queryObject.nameOrTitle = val;
    getIcon(queryObject)
      .then((res) => {
        if (res.code == 200) {
          const data = res.data.rows;
          setMarkList(data);
          layerRander(data, imports);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const solutionDeleteFun = () => {
    const graphic = deleteGraphic;
    solutionDelete([graphic?.options?.attr?.data?.id])
      .then((res) => {
        if (res.code === 200) {
          message.success('删除成功');
          refresh(selectKeys, activityId, undefined, 'import');
          if (currentId.current === graphic.id) {
            currentId.current = '';
            setPointinfo(true);
          }
          setDeleteFlag(false);
          tuceng.current.removeGraphic(graphic);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    tuceng.current.removeGraphic(graphic);
  };
  const changeItem = (
    val: any,
    solutionPersonList: any,
    solutionDeviceList: any,
    solutionVedioList: any,
  ) => {
    const entity: {
      GeoJSON?: any;
      info?: {
        self: any;
        name: any;
        code: any;
        mjNum: any;
        fjNum: any;
        baNum: any;
        jjNum: any;
        xfNum: any;
        iconLevel: any;
      };
    } = {
      info: {
        self: null,
        name: null,
        code: null,
        mjNum: null,
        fjNum: null,
        baNum: null,
        jjNum: null,
        xfNum: null,
        iconLevel: null,
      },
    };
    if (currentGraphic?.options?.name !== '扇形雷达') {
      currentGraphic?.stopEditing(currentGraphic);
    }
    currentId.current = '';
    entity!.info!.self = val.getFieldValue().self;
    entity!.info!.code = val.getFieldValue()?.code;
    entity!.info!.mjNum = val.getFieldValue()?.mjNum;
    entity!.info!.fjNum = val.getFieldValue()?.fjNum;
    entity!.info!.baNum = val.getFieldValue()?.baNum;
    entity!.info!.jjNum = val.getFieldValue()?.jjNum;
    entity!.info!.xfNum = val.getFieldValue()?.xfNum;
    if (val.getFieldValue()?.name) {
      setTaskName(val.getFieldValue()?.name);
      entity!.info!.name = val.getFieldValue()?.name;
      entity!.info!.iconLevel = iconLevel;
    }
    currentGraphic.attr.data = { ...currentGraphic?.attr?.data, info: entity?.info };
    entity.GeoJSON = currentGraphic.toGeoJSON();
    if (entity!.GeoJSON!.properties?.type === 'polyline') {
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
      return { vedioID: item.vedioID ? item.vedioID : item.id };
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
      iconID,
      planID,
      name: val.getFieldValue().name,
      entity: str,
      solutionDeviceList: DeviceList,
      solutionPersonList: PersonList,
      solutionVedioList: VedioList,
    };
    if (editFlag) {
      editPrepar({ id: planID, geoJson: cJSON.stringify(tuceng.current.toGeoJSON()) }).catch(
        (err) => {
          message.error(err.message || err);
        },
      );
      const id = currentGraphic?.options?.attr?.data?.id;
      editIcon({ ...queryObject, id })
        .then((res) => {
          if (res.code == 200) {
            setPointinfo(true);
            message.success('编辑成功');
            setAddpre(!addpre); //刷新
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
      setEditFlag(false);
    } else {
      addIcon(queryObject)
        .then((res) => {
          if (res.code == 200) {
            setPointinfo(true);
            editIcon(res.data);
            const info = JSON.parse(res.data.entity).info;
            currentGraphic.attr.data = { ...res.data, info };
            const geoJSON = tuceng.current.toGeoJSON();
            geoJSON.features[
              geoJSON.features.length - 1 < 0 ? 0 : geoJSON.features.length - 1
            ].properties.style.color = currentGraphic.options.style.color; //toGeoJSON 有bug最后一个默认是白色
            currentGraphic.attr.data = res.data;

            editPrepar({ id: planID, geoJson: cJSON.stringify(geoJSON) }).catch((err) => {
              message.error(err.message || err);
            });
            message.success('新增成功');
            setAddpre(!addpre);
            if (policeFlag && Boolean(PersonList)) {
              Modal.confirm({
                title: '派发任务',
                content: '该任务未选择人员，是否派发任务',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  setSolutionId(res?.data?.id);
                  setGiveTask(true);
                },
              });
            }
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  useEffect(() => {
    if (selectKeys.length === 0) return;
    refresh(selectKeys, activityId);
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
      activityId,
      isClear: msg ? 1 : 0,
      targetActivityId: copyactId,
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
  // 预览
  const clickLeftTree = () => {
    if (treeshow) {
      status = '';
    } else {
      status = 'yulan';
    }
    updatemodel.current?.clear();
    if (tuceng.current) {
      tuceng.current.clear();
      map.removeLayer(tuceng.current);
    }
    flyHome(activityId, '预览');
    setSeletedKeys([]);
    // 存储每个节点的数据
    const tree = (data: any) => {
      data?.map((item: any) => {
        if (item?.children?.length > 0) {
          tree(item.children);
        }
        getIcon({ planID: item.key })
          .then((res) => {
            if (res.code == 200) {
              treeinfo[item.key] = res.data.rows;
            }
          })
          .catch((err) => {
            message.error(err.message || err);
          });
      });
    };
    tree(treeData[0]?.children);
    setTreeshow(!treeshow);
  };
  const checkLeftTree = (list: any) => {
    if (tuceng.current) {
      tuceng.current.clear();
      map.removeLayer(tuceng.current);
    }
    if (list.length === 0) {
      return;
    }
    const queryObject: any = {};
    if (list?.length === Object.keys(treeinfo)?.length + 1) {
      queryObject.activityId = activityId;
      getIcon(queryObject)
        .then((res) => {
          if (res.code == 200) {
            const data = res.data.rows;
            layerRander(data, '预览');
          }
        })
        .catch((err) => {
          message.error(err.message || err);
        });
    } else {
      let rrr: any[] = [];
      list?.map((item: any) => {
        rrr = [...rrr, ...treeinfo[item]];
      });
      layerRander(rrr, '预览');
    }
  };
  return (
    <div className={style.wrap}>
      <Mars3d lnglat={() => {}} />
      {/* 资源树 */}
      <div className="leftTree" onClick={clickLeftTree}>
        <span className="iconfont icon-shuxuanze" />
      </div>
      {treeshow && (
        <div className="leftTreeShow">
          <Tree checkable defaultExpandAll={true} onCheck={checkLeftTree} treeData={treeData} />
        </div>
      )}
      {/* 编辑预案内容 */}
      {!false && (
        <div className={style.bjyaContent}>
          <div className={style.abfaTitle}>
            <span>预案管理</span>{' '}
          </div>
          <div className={style.abfaContent}>
            {/* 方案管理 */}
            <div className={style.faglContent}>
              <div className={style.plan_name}>
                <span>*</span> 选择活动
              </div>
              <Select
                showSearch
                optionFilterProp="label"
                className={style.planSelect}
                value={activityId}
                options={actOptions}
                onChange={(val, option) => {
                  actChange(val, option);
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
                  key="show"
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
                    showLine={{
                      showLeafIcon: false,
                    }}
                    blockNode={true}
                    className={style.treebg}
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
                          submitter={{
                            resetButtonProps: { style: { display: 'none' } },
                            render: (props) => {
                              return [
                                // eslint-disable-next-line react/jsx-key
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
                          labelCol={{ style: { width: 100 } }}
                          onFinish={async (val) => {
                            if (!planID) {
                              message.warning('根节点不能保存哦！');
                              return;
                            }
                            if (beforeData !== viewData || !beforeData) {
                              message.warn('请重新更新视域');
                            } else {
                              const query = cJSON.stringify({
                                ...val,
                                view: viewData,
                                modelTreeData,
                              });
                              editPrepar({
                                id: planID,
                                entity: query,
                                layerId: modelTreeData?.data?.id,
                              })
                                .then((res) => {
                                  if (res.code === 200) message.success('提交成功');
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
                          <div style={{ marginBottom: '20px' }}>
                            <span className={style.typestyle}>
                              <span style={{ color: 'red' }}>*</span>类型:
                            </span>
                            <Select
                              showSearch
                              placeholder="默认"
                              className={style.planSelect}
                              options={[
                                { value: '默认' },
                                { value: '分段属性' },
                                { value: '分级属性' },
                                { value: '表格' },
                                { value: '自定义' },
                              ]}
                              onChange={typeChange}
                            />
                          </div>
                          {/* 默认 */}
                          {flag1 && (
                            <>
                              <ProFormTextArea label="主要任务" name="keytask" />
                              <ProFormTextArea
                                className={style.keyTask}
                                label="应急处置人员"
                                name="doperson"
                              />
                              <ProFormTextArea
                                className={style.keyTask}
                                label="处置流程"
                                name="dolist"
                              />
                            </>
                          )}
                          {/* 分段属性 */}
                          {flag2 && (
                            <>
                              <div>| 岗位设置</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                全段设置执勤岗位
                                <ProFormDigit name="countStation" />
                                个，共有执勤哨
                                <ProFormDigit name="countUnit" />
                                个，治安哨
                                <ProFormDigit name="countPerson" />
                                个。
                              </div>
                              <div>| 警力配置</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                共<ProFormDigit name="countSum" />
                                名，其中制服警
                                <ProFormDigit name="countSuit" />
                                名，便服警
                                <ProFormDigit name="countClothes" />
                                名。
                              </div>
                              <div>| 路段负责人</div>
                              <div>
                                <ProFormText
                                  name="stationA"
                                  label="A岗："
                                  placeholder="请输入名称"
                                />
                                <ProFormText
                                  name="stationAtel"
                                  label="联系电话："
                                  placeholder="请输入名称"
                                />
                                <ProFormText
                                  name="stationB"
                                  label="B岗："
                                  placeholder="请输入名称"
                                />
                                <ProFormText
                                  name="stationBtel"
                                  label="联系电话："
                                  placeholder="请输入名称"
                                />
                              </div>
                            </>
                          )}
                          {/* 分级属性 */}
                          {flag3 && (
                            <>
                              <div>| 总指挥</div>
                              <ProFormText name="name" label="姓名：" />
                              <ProFormText name="name" label="联系电话：" />
                              <div>| 执行指挥</div>
                              <ProFormText name="name" label="姓名：" />
                              <ProFormText name="name" label="联系电话：" />
                              <div>| 岗位设置</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                全段设置执勤岗位 <ProFormDigit name="countStation" />
                                个，共有执勤哨 <ProFormDigit name="countUnit" />
                                个，治安哨
                                <ProFormDigit name="countPerson" />
                                个。
                              </div>
                              <div>| 警力配置</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                共<ProFormDigit name="countSum" />
                                名，其中制服警
                                <ProFormDigit name="countSuit" />
                                名，便服警
                                <ProFormDigit name="countClothes" />
                                名。
                              </div>
                            </>
                          )}
                          {/* 表格 */}
                          {flag4 && (
                            <>
                              <table className={style.table}>
                                <tr>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                  <td>
                                    <ProFormText name="company" />
                                  </td>
                                </tr>
                              </table>
                            </>
                          )}
                          {/* 自定义 */}
                          {flag5 && <></>}
                          <Row>
                            <Col span={5} offset={2}>
                              场馆选择:
                            </Col>
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
                                style={{ borderColor: '#949191', padding: '0 10px !important' }}
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
                                                  if (items.levelName === '警务标记') {
                                                    setPoliceFlag(true);
                                                  } else {
                                                    setPoliceFlag(false);
                                                  }
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
                                                // eslint-disable-next-line react/jsx-key
                                                <li
                                                  key={imgArray.minioFileUrl}
                                                  onClick={() => {
                                                    if (items.levelName === '警务标记') {
                                                      setPoliceFlag(true);
                                                    } else {
                                                      setPoliceFlag(false);
                                                    }
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
                                            if (items.levelName === '警务标记') {
                                              setPoliceFlag(true);
                                            } else {
                                              setPoliceFlag(false);
                                            }
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
                            policeFlag={policeFlag}
                            videoRander={() => {}}
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
                      copySolution({ id: value, solutionIdList })
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
                    treeData={treeData}
                    planID={planID}
                    activityId={activityId}
                    markList={markList}
                    refresh={(val, imports) => {
                      refresh(selectKeys, activityId, val, imports);
                    }}
                    map={map}
                    importUrl={'/api/arSolution/importJson'}
                    exportUrl={'/api/arSolution/exportJson'}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        destroyOnClose={true}
        key={titleName}
        maskClosable={false}
        visible={modalVisible}
        title={titleName}
        onOk={handleOk}
        onCancel={handleCancel}
        className={style.modalself}
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
        className={style.copy}
        title="复制活动"
        visible={copyFlag}
        onOk={copyOk}
        onCancel={copyCancel}
        maskClosable={false}
      >
        <div>
          复制活动至:
          <Select
            showSearch
            style={{ width: '300px' }}
            className={style.planSelect}
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
        title="复制预案"
        visible={copyarplanSure}
        onOk={copyarplanFun}
        onCancel={() => {
          copyarplanCancle(false);
        }}
      >
        该活动下存在预案，请确定是否删除该活动下的预案完成复制？
      </Modal>
      <Modal
        maskClosable={false}
        className={style.deleteModel}
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
      {giveTask && (
        <Task
          solutionId={solutionId}
          activityId={activityId}
          taskName={taskName}
          cancle={() => {
            setGiveTask(false);
          }}
        />
      )}
      {/* 导入 */}
      {importVisible && (
        <Import
          importUrl={'/api/arSolution/importEntity'}
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

export default Prepar;
