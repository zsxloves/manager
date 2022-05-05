import React, { useEffect, useState, useRef } from 'react';
import style from './style.less';
import { PlusOutlined } from '@ant-design/icons';
import { Select, Button, message, Modal, Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import LeftTreeTc from './components/leftTreeTc';
import Timeline from './components/timeline';
import { removeYa, queryYaty, getPageData, getDictfindAll } from './service';
import { DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { useAccess, Access } from 'umi';
import Prepar from '../prepar/indexYaty';
import { addDetail, changeDetail, yaCopy, queryYaDetail, queryYa, queryRc } from '@/services/yaty';
import Mars3d from '@/components/Mars3d';
import Yatyshow from './components/yaty';
const yatytcObj: any = {}; // 预案推演图层存储
let map: any = null;
let newChangeId = ''; // 判断是新增还是修改
const Yaty: React.FC = () => {
  const { initialState } = useModel('@@initialState'); //引入地图
  map = initialState?.map;
  // 获取预案树
  const [leftShow, setLeftShow] = useState<boolean>(true);
  const access = useAccess();
  const actionRef: any = useRef<ActionType>();
  const [title, setTitle] = useState<string>('');
  const [yaId, setYaId] = useState<string>('');
  const formRef: any = useRef(null);
  const timeRef: any = useRef(null);
  const [obj, setObj] = useState<any>({});
  const [checkKey, setCheckKey] = useState<any>([]);
  const [showTimeLine, setShowTimeLine] = useState<any>(false);
  const [showMap, setShowMap] = useState<any>(false);
  const [yatyObj, setYatyObj] = useState<any>({});
  const [yaDetailList, setYaDetailList] = useState<any>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [showYaManage, setShowYaManage] = useState<boolean>(false);
  const [showAddBtn, setShowAddBtn] = useState<boolean>(false);
  // const [changeId, setChangeId] = useState<boolean>(false); // 判断是新增还是修改
  const handleRemoveOne = async (param: any) => {
    Modal.confirm({
      title: '是否确认删除？',
      onOk: () => {
        removeYa(param).then((res: any) => {
          if (res.success) {
            message.success(res.message);
            actionRef.current.reload();
            setCheckKey([]);
          } else {
            message.warning(res.message);
          }
        });
      },
    });
  };
  const [showList, setShowList] = useState<boolean>(false);
  const yatyRef: any = useRef(null);
  const [showYaty, setShowYaty] = useState<boolean>(false);
  const [yaTableList, setYaTableList] = useState<any>([]);
  const [yatyData, setYatyData] = useState<any>([]);
  const [copyFlag, setCopyFlag] = useState<any>(false);
  const [newOptions, setNewOptions] = useState<any>([]);
  const [copyactId, setCopyactId] = useState<any>('');
  const [zdArr, setZdArr] = useState<any>([]);
  const [colums, setColums] = useState<any>({});
  // 查询字典
  const getDict = () => {
    setColums({});
    getDictfindAll({ parentId: '8b5eb365-44ff-4bce-a835-c2772c22e554' })
      .then((res: any) => {
        const result = res.result.result;
        const newArr: any = [];
        const newClus: any = {
          '0': { text: '全部', value: '0' },
        };
        result.forEach((item: any) => {
          const param = {
            label: item.name,
            value: item.id,
          };
          newClus[item.id] = {
            text: item.name,
            value: item.id,
          };
          newArr.push(param);
        });
        setZdArr(newArr);
        setColums(newClus);
      })
      .catch((err: any) => {
        message.error(err.message);
      });
  };
  const changeYaTable = (id: any) => {
    const param = {
      plandeducingId: id,
    };
    queryYaDetail(param).then((res: any) => {
      const result = res.data;
      if (result.totalCount) {
        setYatyData(result.rows);
      } else {
        setYatyData([]);
      }
      setShowYaty(true);
      setLeftShow(false);
      yatyRef?.current?.handelClick();
      // yatyRef.current.endClick()
    });
  };
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
      width: 50,
      search: false,
      key: 'index',
    },
    {
      title: '任务',
      dataIndex: 'task',
    },
    {
      dataIndex: 'type',
      valueType: 'select',
      title: '类型',
      valueEnum: colums,
      // {
      //   '0': { text: '全部', value: '0' },
      //   '1': { text: '预案推演', value: '1' },
      //   '2': { text: '应急处置', value: '2' },
      //   '3': { text: '车辆冲卡', value: '3' },
      // },
    },
    {
      title: '操作',
      search: false,
      width: 160,
      render: (text, record) => [
        <Access accessible={access.btnHasAuthority('yatyChange')} key="yatyChange">
          <a
            key="edit"
            onClick={() => {
              // setShowYaManage(true)
              formRef.current.setModelShow();
              setObj(record);
              setTitle('修改预案推演');
              setYaId(record.id);
              actionRef.current.reload();
            }}
            style={{ marginRight: '6px' }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('yatyRemove')} key="yatyRemove">
          <a
            key="del"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: '6px' }}
            onClick={() => {
              const param = [record.id];
              handleRemoveOne(param);
            }}
          >
            删除
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('yatyCopy')} key="yatyCopy">
          <a
            key="copy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: '6px' }}
            onClick={() => {
              setYaId(record.id);
              const param = {
                queryObject: {
                  page: 0,
                  size: 9999,
                },
              };
              getPageData(param).then((res: any) => {
                const arr = res.result.page.content.map((item: any) => {
                  const paramNow = {
                    value: item.id,
                    label: item.name,
                  };
                  return paramNow;
                });
                setNewOptions(arr);
                setCopyFlag(true);
              });
            }}
          >
            复制
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('yatySee')} key="yatySee">
          <a
            key="see"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: '6px' }}
            onClick={() => {
              changeYaTable(record.id);
              setYaId(record.id);
            }}
          >
            预览
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('yatyMap')} key="yatyMap">
          {/* {record.type === zdArr[0].value ? ( */}
            <a
              key="map"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: '6px' }}
              onClick={() => {
                setShowAddBtn(true);
                // if (record.type === zdArr[0].value) {
                  setShowTimeLine(true);
                // }
                setYatyObj(record);
                setLeftShow(false);
                setShowMap(true);
              }}
            >
              地图
            </a>
          {/* ) : null} */}
        </Access>,
      ],
    },
  ];
  const cancelModel = () => {
    actionRef.current.reload();
  };
  const yatyDetail: any = useRef(null);
  const setDisableds = (flag: any) => {
    setDisabled(flag);
  };
  const cancelLeft = () => {
    yatyDetail?.current?.clearModelForm();
    yatyDetail?.current?.queryYaAll(yatyObj.id);
    timeRef?.current?.changeNowClick(false);
    setShowYaManage(false);
    setDisableds(true);
    setShowAddBtn(true);
  };
  const pdTime = () => {
    const time = timeRef.current.timeValue;
    if (time[0] === time[1]) {
      message.error('请选择一个时间段');
      return true;
    }
    let flag = false;
    if (yaDetailList.rows && yaDetailList.rows.length) {
      yaDetailList.rows.some((item: any) => {
        if (
          (Number(item.endTimeNumber) > time[0] && Number(item.endTimeNumber) < time[1]) ||
          (time[0] < Number(item.startTimeNumber) && Number(item.startTimeNumber) < time[1]) ||
          (Number(item.endTimeNumber) === time[1] && Number(item.startTimeNumber) === time[0])
        ) {
          message.error('时间段冲突');
          flag = true;
          return true;
        } else {
          return false;
        }
      });
      if (flag) {
        return true;
      }
    }
    return false;
  };
  const addYaDetail = (planID: any, entity: any) => {
    const time = timeRef.current.timeValue;
    const param = {
      endTimeNumber: time[1],
      plandeducingId: yatyObj?.id,
      startTimeNumber: time[0],
      planId: planID,
      id: '',
      entity: entity
    };
    if (newChangeId) {
      param.id = newChangeId;
      changeDetail(param)
        .then((res) => {
          if (res.success) {
            message.success(res.message);
            cancelLeft();
          }
        })
        .catch((e) => {
          message.error(e.message);
        });
    } else {
      addDetail(param)
        .then((res) => {
          if (res.success) {
            message.success(res.message);
            cancelLeft();
          }
        })
        .catch((e) => {
          message.error(e.message);
        });
    }
  };
  useEffect(() => {
    getDict();
  }, []);
  const setList = (data: any) => {
    setYaDetailList(data);
  };
  const setLi = (arr: any) => {
    timeRef.current.setLi(arr);
  };
  const showPlanYa = (item: any) => {
    yatyDetail.current.showPlanYa(item);
  };
  const changeYa = (item: any, newArr: any) => {
    const newsArr = newArr.filter((items: any) => {
      return items.planId !== item.planId;
    });
    setList(newsArr);
    setLi(newsArr);
    setDisableds(false);
    setShowYaManage(true);
    setShowAddBtn(false);
    // setChangeId(true);
  };
  // 日程表格
  const columnsYa: any = [
    {
      title: '序号',
      width: 100,
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '开始时间',
      width: 100,
      dataIndex: 'startTime',
      key: 'startTime',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '工作任务',
      dataIndex: 'work',
      key: 'work',
      width: 150,
      align: 'center',
    },
    {
      title: '运行地点',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      align: 'center',
    },
    {
      title: '责任人',
      dataIndex: 'people',
      key: 'people',
      width: 150,
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      align: 'center',
    },
    {
      title: '执行流程',
      dataIndex: 'lc',
      key: 'lc',
      width: 150,
      align: 'center',
    },
  ];
  // 时间格式转换
  const getTime = (number: any) => {
    const second = number * 30;
    const hour = Math.floor(second / 60);
    const minutes = second % 60;
    const time = (hour > 10 ? hour : '0' + hour) + ':' + (minutes > 10 ? minutes : '0' + minutes);
    return time;
  };
  const showTables = () => {
    const params = {
      id: yaId,
      pageNumber: 1,
      pageSize: 99,
    };
    queryRc(params).then((res: any) => {
      const arr: any = [];
      const result = res.data.rows;
      result.forEach((items: any, index: number) => {
        const newParam: any = {};
        newParam.index = index + 1;
        newParam.startTime = getTime(Number(items.startTimeNumber));
        newParam.endTime = getTime(Number(items.endTimeNumber));
        const data = JSON.parse(items.entity);
        newParam.people = data?.name || '';
        newParam.lc = data?.dolist || '';
        newParam.work = data?.keytask || '';
        newParam.phone = data?.tel || '';
        newParam.address = data?.modelTreeData?.title || '';
        newParam.key = index;
        arr.push(newParam);
      });
      setYaTableList(arr);
      setShowList(true);
    });
  };
  const closeTable = () => {
    setShowList(false);
  };

  // 加载3d模型
  const loadModel = (entity: any) => {
    let rotax = 0;
    let rotay = 0;
    let rotaz = 0;
    if (entity.offset && entity.offset.pitch) {
      rotax = parseInt(entity.offset.pitch);
    } else {
      rotax = 0;
    }
    if (entity.offset && entity.offset.roll) {
      rotay = parseInt(entity.offset.roll);
    } else {
      rotay = 0;
    }
    if (entity.offset && entity.offset.heading) {
      rotaz = parseInt(entity.offset.heading);
    } else {
      rotaz = 0;
    }
    entity.show = true;
    let layer = '';
    try {
      layer = new mars3d.layer.TilesetLayer({
        ...entity,
        center: map.getCameraView(),
        position: entity.position
          ? entity.position
          : entity.offset
          ? { lng: entity?.offset?.x, lat: entity?.offset?.y, alt: entity?.offset?.z }
          : {},
        rotation: entity.rotation ? entity.rotation : { x: rotax, y: rotay, z: rotaz },
        show: true,
      });
    } catch (e) {
      message.error('后台数据错误');
    }
    return layer;
  };
  // 加载预案推演的预案详情
  const addYa = (id: any) => {
    const param = {
      id: id,
    };
    queryYa(param).then((res: any) => {
      const result = res.data.rows;
      if (result.length) {
        const json = result[0].geoJson;
        yatytcObj[id] = new mars3d.layer.GraphicLayer({
          name: result[0].name,
        });
        yatytcObj[id + '3dTiles'] = '';
        map.addLayer(yatytcObj[id]);
        try {
          const new3dLayer = JSON.parse(JSON.parse(result[0]?.entity)?.modelTreeData?.data?.entity);
          yatytcObj[id + '3dTiles'] = loadModel(new3dLayer);
          if (yatytcObj[id + '3dTiles']) {
            map.addLayer(yatytcObj[id + '3dTiles']);
          }
        } catch (error) {
          console.log(error);
        }
        const options = {
          clear: true,
          // flyTo: true
        };
        if (json) {
          yatytcObj[id].loadGeoJSON(json, options);
        }
      }
    });
  };
  const setYatyDetail = (arr: any) => {
    // console.log(arr)

    const objKeys = Object.keys(yatytcObj);
    for (const keys in yatytcObj) {
      if (keys.indexOf('3dTiles') === -1) {
        if (arr.indexOf(keys) > -1) {
          if (!yatytcObj[keys]) {
            // 调用预案
            addYa(keys);
          }
        } else {
          // 删除预案
          map.removeLayer(yatytcObj[keys]);
          yatytcObj[keys] = '';
          map.removeLayer(yatytcObj[keys + '3dTiles']);
          yatytcObj[keys + '3dTiles'] = '';
        }
      }
    }
    arr.forEach((item: any) => {
      if (objKeys.indexOf(item) === -1) {
        // 调用预案
        addYa(item);
      }
    });
  };
  // 清除所有预案
  const clearAllya = () => {
    for (const key in yatytcObj) {
      if (key.indexOf('3dTiles') === -1) {
        map.removeLayer(yatytcObj[key]);
        yatytcObj[key] = '';
        map.removeLayer(yatytcObj[key + '3dTiles']);
        yatytcObj[key + '3dTiles'] = '';
      }
    }
  };
  const goBackLeft = () => {
    clearAllya();
    setShowYaty(false);
    setLeftShow(true);
  };
  const copyOk = () => {
    const param = {
      id: yaId,
      activityId: copyactId,
    };
    yaCopy(param).then((res: any) => {
      if (res.success) {
        message.success(res.message);
        actionRef.current.reload();
      }
      setCopyFlag(false);
    });
  };
  const copyCancel = () => {
    setCopyFlag(false);
    setCopyactId('');
  };
  const setChangeId = (val: any) => {
    newChangeId = val;
  };
  return (
    <PageContainer className={style.yaAll} title={false} breadcrumb={undefined}>
      <Mars3d lnglat={() => {}} />
      {leftShow && (
        <ProTable
          scroll={{ y: 'auto', x: '100%' }}
          className={style.leftTable}
          actionRef={actionRef}
          columns={columns}
          request={async (params = {}, sort, filter) => {
            console.log(params, sort, filter);
            let type = '';
            if (params.type && params.type !== '0') {
              type = params.type;
            }
            const param = {
              pageSize: params.pageSize,
              pageNumber: params.current,
              task: params?.task || '',
              type: type,
            };
            const result = await queryYaty(param).then((res) => {
              // console.log(res);
              return {
                data: res.data.rows,
                total: res.data.totalCount,
              };
            });
            return {
              data: result.data,
              total: result.total,
            };
          }}
          rowKey={'id'}
          search={{
            labelWidth: 50,
            span: 12,
            collapseRender: () => false,
            collapsed: false,
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
          }}
          dateFormatter="string"
          options={false}
          headerTitle=""
          toolBarRender={() => [
            <Access accessible={access.btnHasAuthority('yatyAdd')} key="yatyAdd">
              <Button
                key="xjbtn"
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  // setChangeId(false);
                  newChangeId = '';
                  formRef.current.setModelShow();
                  setTitle('新建预案推演');
                  setYaId('');
                }}
              >
                新增
              </Button>
            </Access>,
            <Access accessible={access.btnHasAuthority('yatyRemove')} key="yatyRemove">
              <Button
                key="pldel"
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (checkKey.length === 0) {
                    message.error('请至少选择一条数据');
                    return;
                  }
                  const param = checkKey;
                  handleRemoveOne(param);
                }}
              >
                批量删除
              </Button>
            </Access>,
          ]}
          tableAlertRender={false}
          rowSelection={{
            fixed: true,
            onChange: (keys) => {
              setCheckKey(keys);
            },
          }}
        />
      )}
      <LeftTreeTc
        title={title}
        yaId={yaId}
        cancelModel={cancelModel}
        ref={formRef}
        obj={obj}
        zdArr={zdArr}
      />
      {showTimeLine && (
        <Timeline
          changeYa={changeYa}
          setChangeId={setChangeId}
          ref={timeRef}
          disabled={disabled}
          showPlanYa={showPlanYa}
        />
      )}
      {showAddBtn && (
        <Button
          key="addNew"
          type="primary"
          onClick={() => {
            timeRef.current.changeNowClick(true);
            setShowAddBtn(false);
            setShowYaManage(true);
            setDisableds(false);
            yatyDetail?.current?.clearModelForm(true);
            newChangeId = '';
          }}
          style={{ position: 'absolute', bottom: '102px', left: '1000px', zIndex: '999' }}
        >
          新增
        </Button>
      )}
      {showTimeLine && (
        <Button
          key="retL"
          type="primary"
          onClick={() => {
            timeRef.current.changeNowClick(false);
            setShowTimeLine(false);
            yatyDetail?.current?.clearModelForm();
            setLeftShow(true);
            setShowAddBtn(false);
            setShowYaManage(false);
          }}
          style={{ position: 'absolute', bottom: '102px', left: '1090px', zIndex: '999' }}
        >
          返回左侧列表
        </Button>
      )}
      {showMap && (
        <Prepar
          yatyObj={yatyObj}
          ref={yatyDetail}
          cancelLeft={cancelLeft}
          addYaDetail={addYaDetail}
          setList={setList}
          setLi={setLi}
          setDisableds={setDisableds}
          showYaManage={showYaManage}
          pdTime={pdTime}
        />
      )}
      <Yatyshow
        yatyData={yatyData}
        showYaty={showYaty}
        goBackLeft={goBackLeft}
        ref={yatyRef}
        showTables={showTables}
        setYatyDetail={setYatyDetail}
      />
      {/* 预案推演弹窗 */}
      {showList && (
        <div className={style.yaTable}>
          <div className={style.titles}>日程</div>
          <div className={style.closeBtn} onClick={closeTable}>
            <span className="iconfont icon-guanbi" />
          </div>
          <Table
            columns={columnsYa}
            dataSource={yaTableList}
            bordered
            size="middle"
            className={style.yaListTable}
            scroll={{ x: 'calc(700px + 50%)', y: 450 }}
          />
        </div>
      )}
      {/* 弹框 */}
      <Modal
        className={style.copy}
        title="复制预案推演"
        visible={copyFlag}
        onOk={copyOk}
        onCancel={copyCancel}
      >
        <div>
          复制预案推演至至:
          <Select
            style={{ width: '300px' }}
            className={style.planSelect}
            placeholder={'请选择'}
            value={copyactId}
            options={newOptions}
            onChange={(val) => {
              setCopyactId(val);
            }}
          />
        </div>
      </Modal>
    </PageContainer>
  );
};
export default Yaty;
