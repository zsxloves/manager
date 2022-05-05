import React, { useEffect, useState, useRef } from 'react';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormDateTimeRangePicker,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Row, Col, message, Modal, TreeSelect, Form } from 'antd';
import { getState, getchangguan } from '../../../../services/match';
import { queryPlanTree } from '@/services/prepar'; //预案树
import { queryPlanTree as layerTree } from '@/services/layerunit'; //图层图元树
import { dutiesAdd, dutiesEdit, queryGymId, dutiesQuery } from '@/services/duties';
import moment from 'moment';
import { chinese, chinese_Figure_English, formatDate } from '@/utils/utilsJS';
import styles from './index.less';
declare interface Props {
  edit?: any;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, edit, reload } = props;
  const formRef: any = useRef(null);
  const [stateList, setstateList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //任务类型
  const [changguanList, setchangguanList] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const [parentDutie, setParentDutie] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //父级任务
  const [flag, setFlag] = useState<boolean>(showAdd); //弹框展示隐藏
  const [editId] = useState<string>(edit?.id);
  const [orgT, setOrgT] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [planTree, setPlanTree] = useState<any>([]); //预案
  const [planLoad, setPlanLoad] = useState<boolean>(false);
  const [layerTrees, setLayerTrees] = useState<any>([]); //图层图元
  const [layerLoad, setLayerLoad] = useState<boolean>(false);
  const [cgData, setCgData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  //判断新增删除
  const isEdit = !!edit;

  const fil = (children: any) => {
    if (children && Array.isArray(children)) {
      children.filter((info: any) => {
        info.value = info.key;
        if (info.children && Array.isArray(info.children)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          fil(info.children);
        }
      });
    }
  };

  const initFunc = () => {
    // 获取任务类型
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: 'b4add123-366f-47b5-b64c-cd7fa1eaaf95',
    };
    getState({ queryObject })
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
      .catch((err) => {
        message.error(err || err.message);
      });
    // 获取活动
    const query = {
      page: 0,
      size: 9999,
    };
    getchangguan({ queryObject: query })
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
        setchangguanList(de);
      })
      .catch((err) => {
        message.error(err || err.message);
      });
    //获取预案树
    queryPlanTree({})
      .then((res) => {
        if (res.data?.length > 0) {
          res.data.filter((item: any) => {
            item.value = item.key;
            if (item.children) {
              fil(item.children);
            }
          });
          setPlanTree(res.data);
          setPlanLoad(false);
        }
      })
      .catch((err) => {
        message.error(err || err.message);
        setPlanLoad(false);
      });
    //获取图层图元树
    layerTree({})
      .then((res) => {
        if (res.data?.length > 0) {
          res.data.filter((item: any) => {
            item.value = item.key;
            if (item.children) {
              fil(item.children);
            }
          });
          setLayerTrees(res.data);
          setLayerLoad(false);
        }
      })
      .catch((err) => {
        message.error(err || err.message);
        setLayerLoad(false);
      });
  };
  function disableStart(current: any) {
    const endTime = formRef.current.getFieldsValue().endTime;
    if (endTime) {
      return !(current.unix() < endTime.unix());
    } else {
      return false;
    }
  }

  const initGym = (orgid?: string) => {
    //根据活动查场馆
    queryGymId({ id: orgid })
      .then((res) => {
        if (res.data?.length > 0) {
          const de =
            res.data &&
            res.data.map((item: Record<string, unknown>) => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          setCgData(de);
        } else {
          message.warning('该活动未关联场馆');
          formRef.current.setFieldsValue({ gymId: null });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err || err.message);
      });
  };

  const queryRW = (id?: string) => {
    //查询任务
    dutiesQuery({
      pageNumber: 1,
      pageSize: 9999,
      isEdit: id ? 1 : undefined,
      id: id ? id : undefined,
      sortColumn: 'sortIndex',
      sortOrder: 'desc',
    })
      .then((res) => {
        const data = res.data?.rows;
        if (data?.length > 0) {
          data.filter((item: any) => {
            item.value = item.id;
            item.label = item.name;
          });
          setParentDutie(data);
        }
      })
      .catch((err) => {
        message.error(err || err.message);
      });
  };

  useEffect(() => {
    setPlanLoad(true);
    setLayerLoad(true);
    initFunc();
    if (isEdit) {
      queryRW(editId);
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      edit.timeRange = [];
      edit.timeRange[0] = moment(edit.startTime);
      edit.timeRange[1] = moment(edit.endTime);
      if (edit?.activityId) {
        initGym(edit?.activityId);
        setOrgT(true);
        if (!edit?.gymId) edit.gymId = undefined;
      } else {
        edit.activityId = undefined;
      }
      if (!edit?.parentId) {
        edit.parentId = undefined;
        edit.parentName = undefined;
      }
      if (edit?.arPlanVOS?.length > 0) {
        edit.planIds = [];
        edit?.arPlanVOS.filter((item: any) => {
          edit.planIds.push(item.id);
        });
      } else {
        delete edit?.planIds;
      }
      if (edit?.arLayericonlistVOS?.length > 0) {
        edit.metaIds = [];
        edit?.arLayericonlistVOS.filter((item: any) => {
          edit.metaIds.push(item.id);
        });
      } else {
        delete edit?.metaIds;
      }
      formRef.current.setFieldsValue(edit);
    } else {
      queryRW();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFun = (params: any) => {
    if (editId) {
      params.id = editId;
      const mange = { ...edit, ...params };
      if (mange?.timeRange?.length > 0) {
        const startTime = mange?.timeRange[0];
        const endTime = mange?.timeRange[1];
        mange.startTime = formatDate(startTime);
        mange.endTime = formatDate(endTime);
      }
      if (new Date(mange.startTime) > new Date(mange.endTime)) {
        message.error('开始时间需早于结束时间');
        return;
      }
      if (!mange?.activityId) {
        mange.activityId = '';
        mange.gymId = '';
      } else if (!mange?.gymId) {
        mange.gymId = '';
      }
      if (!mange?.parentId) {
        mange.parentId = '';
        mange.parentName = '';
      }
      dutiesEdit(mange)
        .then((res: any) => {
          if (res.code === 200) {
            message.success(res.message);
            reload();
            change();
            setFlag(false);
          } else {
            message.error(res.message || res);
          }
        })
        .catch((err: any) => {
          message.error(err.message || err);
        });
    } else {
      const mange = { ...params };
      if (mange?.timeRange?.length > 0) {
        const startTime = mange?.timeRange[0];
        const endTime = mange?.timeRange[1];
        mange.startTime = formatDate(startTime);
        mange.endTime = formatDate(endTime);
      }
      if (new Date(mange.startTime) > new Date(mange.endTime)) {
        message.error('开始时间需早于结束时间');
        return;
      }
      dutiesAdd(mange)
        .then((res: any) => {
          if (res.code === 200) {
            message.success(res.message);
            reload();
            change();
            setFlag(false);
          } else {
            message.error(res.message || res);
          }
        })
        .catch((err: any) => {
          message.error(err.message || err);
        });
    }
  };
  // 取消
  const cancelFun = (): void => {
    setFlag(false);
    change();
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancelFun();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            formRef.current.validateFields().then((val: any) => {
              saveFun(val);
            });
          }}
        >
          保存
        </Button>
      </>
    );
  };
  return (
    <Modal
      maskClosable={false}
      visible={flag}
      width={1000}
      onCancel={cancelFun}
      footer={renderFooter()}
      className={styles.addmodel}
      title={editId ? '编辑任务' : '新增任务'}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal" //label和输入框一行
        labelCol={{ style: { width: 140 } }}
        submitter={false}
      >
        <Row>
          {/* 任务名称 */}
          <Col span={11}>
            <ProFormText
              name="name"
              label="任务名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入任务名称' },
                { pattern: chinese_Figure_English, message: '任务名称支持中英数类型字符' },
              ]}
            />
          </Col>
          {/* 任务类型 */}
          <Col span={11} offset={1}>
            <ProFormSelect
              showSearch
              name="type"
              label="任务类型"
              options={stateList}
              rules={[{ required: true, message: '请选择任务类型' }]}
            />
          </Col>
          {/* 起始时间 */}
          <Col span={11}>
            <ProFormDateTimeRangePicker
              name="timeRange"
              label="起始时间"
              rules={[{ required: true, message: '请选择起始时间' }]}
              fieldProps={{
                disabledDate: disableStart,
              }}
            />
          </Col>
          {/* 父级任务 */}
          <Col span={11} offset={1}>
            <ProFormSelect showSearch name="parentId" label="父级任务" options={parentDutie} />
          </Col>
          {/* 责任人 */}
          <Col span={11}>
            <ProFormText
              name="user"
              label="责任人"
              fieldProps={{ maxLength: 10, autoComplete: 'off' }}
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ pattern: chinese, message: '请输入中文' }]}
            />
          </Col>
          {/* 范围 */}
          <Col span={11} offset={1}>
            <ProFormText
              name="limits"
              label="范围"
              fieldProps={{ maxLength: 255, autoComplete: 'off' }}
              getValueFromEvent={(e) => e.target.value.trim()}
            />
          </Col>
          {/* 责任单位 */}
          <Col span={11}>
            <ProFormText
              name="dutyUnit"
              label="责任单位"
              fieldProps={{ maxLength: 255, autoComplete: 'off' }}
              getValueFromEvent={(e) => e.target.value.trim()}
            />
          </Col>
          {/* 关联活动 */}
          <Col span={11} offset={1}>
            <ProFormSelect
              showSearch
              name="activityId"
              label="关联活动"
              options={changguanList}
              fieldProps={{
                onSelect: (a: any) => {
                  setCgData([]);
                  formRef.current.setFieldsValue({ gymId: null });
                  initGym(a);
                  setOrgT(true);
                  setLoading(true);
                },
                onClear: () => {
                  setOrgT(false);
                  setLoading(false);
                  formRef.current.setFieldsValue({ gymId: null });
                },
              }}
            />
          </Col>
          {/* 关联图层图元 */}
          <Col span={11}>
            <Form.Item label="关联图层图元" name="metaIds">
              <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                showSearch
                multiple={true}
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                treeDefaultExpandAll
                treeNodeFilterProp="title"
                maxTagCount={2}
                treeData={layerTrees}
                loading={layerLoad}
              />
            </Form.Item>
          </Col>
          {/* 关联预案 */}
          <Col span={11} offset={1}>
            <Form.Item label="关联预案" name="planIds">
              <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                showSearch
                multiple={true}
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                treeDefaultExpandAll
                treeNodeFilterProp="title"
                maxTagCount={2}
                treeData={planTree}
                loading={planLoad}
              />
            </Form.Item>
          </Col>
          {orgT && (
            //关联场馆
            <Col span={11}>
              <ProFormSelect
                showSearch
                name="gymId"
                label="关联场馆"
                fieldProps={{ loading: loading }}
                options={cgData}
              />
            </Col>
          )}

          {/* 备注 */}
          <Col span={23}>
            <ProFormTextArea
              wrapperCol={{ span: 23 }}
              name="remark"
              label="备注"
              fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};
export default AddUnit;
