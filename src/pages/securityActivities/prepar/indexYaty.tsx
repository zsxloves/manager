// import type { Key } from 'react';
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import imgplace from '@/assets/img/prepar/编组备份.png';
import { useModel } from 'umi';
import style from './style.less';
import './common.less';
import { Select, Modal, message, Tooltip, Row, Col, Button } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import {
  getIcons,
  editPrepar,
  getIconlist,
  addIcon,
  getIcon,
  editIcon,
  solutionDetail,
  solutionDelete,
  slectPlace,
  slectBaseMap,
  deleteIcon,
  // copySolution,
} from '../../../services/prepar';
import Point from './components/point';
import SignList from './components/signList';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import imgsrc from '@/assets/img/prepar/lineClr2.png';
import Modelload from './components/modelload';
import jsonloop from 'jsonloop';
import { queryYaDetail, addYa, deleteYa, queryYa } from '@/services/yaty';
// import { removeYa } from '../yaty/service';
const defaultSeperator = '.';
const cJSON = jsonloop(defaultSeperator);
let map: any = null;
//定义props的类型
interface Props {
  yatyObj: object;
  cancelLeft: Function;
  addYaDetail: Function;
  setList: Function;
  setLi: Function;
  setDisableds: Function;
  showYaManage: boolean;
  pdTime: Function;
  // map: any
}
interface RefTypes {
  clearModelForm: Function;
  showPlanYa: Function;
  queryYaAll: Function;
}
const Prepar = React.forwardRef<RefTypes, Props>((props, ref) => {
  const [activityId, setActId] = useState<any>(''); //活动id
  // const activityId: any = ''
  // const iter = useRef<any>({}); //子节点
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
  map = initialState?.map;
  const tuceng = useRef<any>();
  const [geojson, setGeojson] = useState<any>(); //坐标
  const [pointinfo, setPointinfo] = useState<boolean>(false); //坐标列表
  const [tag, setTag] = useState<boolean>(true); //坐标列表伸展
  const [iconList, setIconList] = useState<any[]>([]); //图标列表
  const [iconTitle, setIconTitle] = useState<any[]>([]); //图标列表
  const [planID, setPlanId] = useState<string>(''); //预案id
  const [iconID, setIconID] = useState<string>(); //图标id

  const [modelTreeData, setMOdelTree] = useState<any>({});
  const [stylefill, setStyle] = useState<{ type?: any; billboard?: any; material?: any }>({});
  const [currentGraphic, setCurrentGraphic] = useState<any>(null);
  // const [selectKeys, setSeletedKeys] = useState<Key[]>([]);
  const [markList, setMarkList] = useState<any[]>([]); //标记列表
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [deleteGraphic, setDeleteGraphic] = useState<{ options: any }>();
  const [addpre, setAddpre] = useState<boolean>(false);
  const [jsonstyle, setSelfstyle] = useState<string>(); //后台存入json样式

  const [solutionList, setSolutionList] = useState(null); //预案点位表详情
  const [markviewer, setMarkviewer] = useState(null); //预案点位表视角
  const flyHome = (id: any) => {
    slectPlace({ id })
      .then((res) => {
        const data = res?.data?.rows[0];
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
  const typeClear = () => {
    setFlag1(false);
    setFlag2(false);
    setFlag3(false);
    setFlag4(false);
    setFlag5(false);
  };
  const solutionDeleteFun = () => {
    const graphic = deleteGraphic;
    solutionDelete([graphic?.options?.attr?.data?.id])
      .then((res) => {
        if (res.code === 200) {
          message.success('删除成功');
          tuceng.current.removeGraphic(graphic);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    tuceng.current.removeGraphic(graphic);
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
            setGeojson(graphic?.options?.position);
            setCurrentGraphic(graphic);
            setEditFlag(true);
            setPointinfo(!pointinfo);
            const markviewerinfo = map.getCameraView();
            setMarkviewer(markviewerinfo);
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
          if (!graphic) {
            return;
          }
          setDeleteGraphic(graphic);
          setDeleteFlag(true);
        },
      },
    ]);
  };
  const layerRander = (data: any) => {
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
        // message.error(err.message||err)
      }
    });
    graphics.map((item) => {
      tuceng.current.addGraphic(item);
    });
    tuceng.current.eachGraphic((e: any) => {
      bindContext(e);
    });
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
    let name = '';
    setGeojson([]);
    if (!tuceng.current) {
      tuceng.current = new mars3d.layer.GraphicLayer();
      map.addLayer(tuceng.current);
    }
    let selfstyle: any = cJSON.parse(item.style || '{}');
    setSelfstyle(selfstyle);
    if (item.typeName === 'billboard') {
      selfstyle.image = item?.minioFileUrl;
    }
    if (item.typeName === 'polyline') {
      selfstyle.width = 10;
      selfstyle.material = mars3d.MaterialUtil.createMaterialProperty(
        mars3d.MaterialType.LineFlow,
        {
          image: imgsrc,
          color: '#fff',
          // repeat: new Cesium.Cartesian2(5, 1),
          speed: 1,
          // hasImage2: true,
          // image2: xz,
          // color2: "#fff"
        },
      );
    }
    if (item.typeName === 'divBillboard') {
      name = '早上赛事';
      selfstyle = {
        html: `<div style="color:red;">
        ${name}
          </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      };
    }
    try {
      if (item.typeName === 'divBillboard') {
        const graphicLayer = new mars3d.layer.GraphicLayer();
        map.addLayer(graphicLayer);
        graphicLayer.startDraw({
          type: 'divBillboard',
          style: {
            html: `<div class="marsImgPanel2">
                          <div class="title">测试DIV点</div>
                          <div class="content">此处可以绑定任意Html代码和css效果</div>
                      </div >`,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
          success: function (e: any) {
            console.log(e);
          },
        });
      } else {
        tuceng.current.startDraw({
          type: item.typeName,
          style: selfstyle,
          success: (graphic: any) => {
            setCurrentGraphic(graphic);
            bindContext(graphic);
            graphic.startEditing(graphic);
            const res = graphic.toGeoJSON();
            setGeojson(res.geometry.coordinates);
            setPointinfo(!pointinfo);
          },
        });
      }
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
    const selfstyle = val.getFieldsValue();
    const type = currentGraphic?.options?.type;
    if (type === 'billboard') setStyle(selfstyle?.billboard);
    if (type === 'polyline') {
      if (selfstyle?.polyline?.materialType === 'LineFlow') {
        selfstyle.polyline.image = imgsrc;
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
  };
  useEffect(() => {
    currentGraphic?.setOptions({ style: stylefill });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stylefill]);
  const getIconlistFun = () => {
    // 图标分类
    const queryIcon = { page: 0, size: 10000000, parentId: '5c539b71-8803-47b8-a3bf-751818e9ff73' };
    getIconlist({ queryObject: queryIcon })
      .then((res: any) => {
        if (res.code === 200) setIconTitle(res.result.page.content.reverse());
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const queryYaAll = (id: any) => {
    const param = {
      plandeducingId: id,
    };
    queryYaDetail(param).then((res: any) => {
      const result = res.data;
      props.setList(result);
      if (result.totalCount) {
        props.setDisableds(true);
        const yaDatas = result.rows;
        props.setLi(yaDatas);
      } else {
        props.setDisableds(false);
      }
    });
  };
  // 初始化预案推演管理
  const initFunc = (obj: any) => {
    //活动列表
    setActId(obj.id);
    flyHome(obj.id);
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
    queryYaAll(obj.id);
  };
  const goback = () => {
    props.cancelLeft();
  };
  const removeYas = () => {
    // 删除预案
    const param = [planID];
    deleteYa(param).then((res: any) => {
      if (res.success) {
        message.success(res.message);
      }
      props.cancelLeft();
    });
  };
  useEffect(() => {
    initFunc(props.yatyObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.yatyObj]);
  const refresh = (arr: any[], id: string, val?: any) => {
    const queryObject = (arr[0] === '0-0' ? { activityId: id } : { planID: arr[0] }) as any;
    queryObject.nameOrTitle = val;
    getIcon(queryObject)
      .then((res) => {
        if (res.code == 200) {
          const data = res.data.rows;
          setMarkList(data);
          layerRander(data);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  // 展示当前预案信息
  const showPlanYa = (item: any) => {
    // 回显预案
    const yaParam = {
      id: item.planId,
    };
    queryYa(yaParam).then((res) => {
      const resultData = res.data.rows[0];
      setTag(true);
      updatemodel.current?.clear();
      setPlanId(resultData.id);
      if (resultData?.entity) {
        try {
          const data = cJSON.parse(resultData?.entity || '{}');
          if (form?.current) form.current.setFieldsValue(data);
          setMOdelTree(data?.modelTreeData);
          setBeforeData(data?.view);
          setTag(true);
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
      refresh([item.planId], '');
    });
  };
  const changeItem = (
    val: any,
    solutionPersonList: any,
    solutionDeviceList: any,
    solutionVedioList: any,
  ) => {
    const entity: { GeoJSON?: any; info?: { self: any; name: any; code: any } } = {
      info: { self: null, name: null, code: null },
    };

    currentGraphic.stopEditing(currentGraphic);
    entity!.info!.self = val.getFieldValue().self;
    entity!.info!.code = val.getFieldValue()?.code;
    currentGraphic.attr.data = { ...currentGraphic.attr.data, info: entity.info };
    entity.GeoJSON = currentGraphic.toGeoJSON();
    if (entity!.GeoJSON!.properties?.type === 'polyline') {
      entity!.GeoJSON!.properties!.style!.color = val.getFieldValue()?.polyline?.color;
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
    console.log('coordinates', entity.GeoJSON?.geometry?.coordinates);
    const queryObject = {
      lat:
        entity.GeoJSON.geometry.type !== 'Point' ? '1' : entity.GeoJSON?.geometry?.coordinates[0],
      lon:
        entity.GeoJSON.geometry.type !== 'Point' ? '1' : entity.GeoJSON?.geometry?.coordinates[1],
      height:
        entity.GeoJSON.geometry.type !== 'Point' ? '1' : entity.GeoJSON?.geometry?.coordinates[2],
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
            setPointinfo(!pointinfo);
            editIcon(res.data);
            currentGraphic.attr.data = res.data;
            editPrepar({ id: planID, geoJson: cJSON.stringify(tuceng.current.toGeoJSON()) }).catch(
              (err) => {
                message.error(err.message || err);
              },
            );
            message.success('新增成功');
            setAddpre(!addpre);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  // useEffect(() => {
  //   if (selectKeys.length === 0) return;
  //   refresh(selectKeys, activityId);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectKeys, addpre]);
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
  const clearModelForm = (flag: any) => {
    updatemodel?.current?.clear();
    tuceng?.current?.clear();
    if (form?.current) form.current.resetFields();
    setMOdelTree({});
    if (flag) {
      addYa({}).then((rest: any) => {
        setPlanId(rest.data.id);
      });
    }
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    clearModelForm,
    showPlanYa,
    queryYaAll,
  }));
  // 弹框
  return (
    <div>
      {/* 编辑预案内容 */}
      {props.showYaManage && (
        <div className={style.bjyaContent} style={{ width: '450px' }}>
          <div className={style.abfaTitle}>
            <span>预案管理</span>{' '}
          </div>
          <div className={style.abfaContent}>
            <div className={style.part}>
              {/* 方案详情 */}
              <div className={style.planDetail}>
                <div className={style.planTitle}>
                  <div
                    onClick={() => {
                      setTag(true);
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
                    <div style={{ height: '690px', overflowY: 'auto' }}>
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
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            render: (props) => {
                              return [
                                <Row justify="center">
                                  <Col>
                                    <Button key="submit" onClick={() => props.form?.submit?.()}>
                                      提交
                                    </Button>
                                    <Button
                                      key="remove"
                                      style={{ marginLeft: '8px' }}
                                      onClick={() => {
                                        removeYas();
                                      }}
                                    >
                                      删除
                                    </Button>
                                    <Button
                                      key="goback"
                                      style={{ marginLeft: '8px' }}
                                      onClick={() => {
                                        goback();
                                      }}
                                    >
                                      返回
                                    </Button>
                                  </Col>
                                </Row>,
                              ];
                            },
                          }}
                          layout="horizontal" //label和输入框一行
                          labelCol={{ style: { width: 100 } }}
                          onFinish={async (val) => {
                            if (beforeData !== viewData || !beforeData) {
                              message.warn('请重新更新视域');
                            } else {
                              const flag = props.pdTime();
                              if (flag) return;
                              const query = cJSON.stringify({
                                ...val,
                                view: viewData,
                                modelTreeData,
                              });
                              editPrepar({ id: planID, entity: query })
                                .then((res) => {
                                  if (res.code === 200) message.success('提交成功');
                                  // 调用新增
                                  props.addYaDetail(planID, query);
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
                            placeholder="请输入名称"
                            // rules={[{ required: true, message: '请输入负责人名称' }]}
                          />
                          <ProFormText
                            name="tel"
                            label="联系方式"
                            placeholder="请输入联系方式"
                            // rules={[{ required: true, message: '请输入联系方式' }]}
                          />
                          <div style={{ marginBottom: '20px' }}>
                            <span className={style.typestyle}>
                              <span style={{ color: 'red' }}>*</span>类型:
                            </span>
                            <Select
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
                              <ProFormTextArea
                                label="主要任务"
                                name="keytask"
                                // rules={[{ required: true, message: '请输入主要任务' }]}
                              />
                              <ProFormTextArea
                                className={style.keyTask}
                                label="应急处置人员"
                                name="doperson"
                                // rules={[{ required: true, message: '请输入应急处置人员' }]}
                              />
                              <ProFormTextArea
                                className={style.keyTask}
                                label="处置流程"
                                name="dolist"
                                // rules={[{ required: true, message: '请输入处置流程' }]}
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
                                ref={updatemodel}
                                map={map}
                                modelTreeData={modelTreeData}
                                setModelTreeData={(data: any) => {
                                  setMOdelTree(data);
                                }}
                              />
                            </Col>
                            <Col span={6}>
                              <Button onClick={getCurrentEye}>更新视域</Button>
                            </Col>
                          </Row>
                        </ProForm>
                        <div className={style.homeTitle} style={{ marginTop: '24px' }}>
                          <span style={{ verticalAlign: 'bottom', marginRight: '4px' }}>
                            <img src={imgplace} />
                          </span>
                          添加标记
                        </div>
                        {!pointinfo ? (
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
                                            width: '62px',
                                            display: 'inline-block',
                                            height: '62px',
                                          }}
                                          key={items.id}
                                          onClick={() => {
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
                            jsonstyle={jsonstyle}
                            ref={updatePoint}
                            solutionList={solutionList}
                            graphic={currentGraphic}
                            msg={geojson}
                            changeItem={changeItem}
                            flypositon={() => {
                              flypositon();
                            }}
                            videoRander={() => {}}
                            icTitle={''}
                            editFlag={editFlag}
                            deleteItem={(graphic, edit) => {
                              if (edit) {
                                setDeleteGraphic(graphic);
                                setDeleteFlag(true);
                              } else {
                                setPointinfo(!pointinfo);
                                tuceng.current.removeGraphic(graphic);
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
                      console.log(value, solutionIdList);
                      return;
                    }}
                    deleteIconFun={(msg: any) => {
                      deleteIcon(msg)
                        .then((res) => {
                          if (res.code == 200) {
                            // refresh(selectKeys, activityId);
                          }
                        })
                        .catch((err) => {
                          message.error(err.message);
                        });
                    }}
                    treeData={[]}
                    copyFlag={true}
                    planID={planID}
                    activityId={activityId}
                    markList={markList}
                    refresh={(val) => {
                      console.log(val);
                      return;
                      // refresh(selectKeys, activityId, val);
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
        title="删除标点"
        visible={deleteFlag}
        onOk={() => {
          solutionDeleteFun();
          setPointinfo(!pointinfo);
          setDeleteFlag(false);
        }}
        onCancel={() => {
          setDeleteFlag(false);
        }}
      >
        确定删除该标点？
      </Modal>
    </div>
  );
});

export default Prepar;
