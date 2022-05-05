import React, { useEffect, useState, useRef } from 'react';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormDateTimeRangePicker,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Row, Col, message, Modal } from 'antd';
import { save, getState, getchangguan, editmatch } from '../../../../services/match';
import moment from 'moment';
import { chinese } from '@/utils/utilsJS';
import styles from './index.less';
declare interface Props {
  edit?: any;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
import { formatDate } from '@/utils/utilsJS';
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, edit, reload } = props;
  const formRef: any = useRef(null);
  const [stateList, setstateList] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const [changguanList, setchangguanList] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const [flag, setFlag] = useState<boolean>(showAdd); //所属活动列表
  const [editId] = useState<string>(edit?.id);
  const initFunc = () => {
    // 获取赛事类型
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: '2b36e222-500e-4839-bfca-71b4d29b4bb4',
    };
    getState({ queryObject }).then((res) => {
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
    });
    // 获取场馆
    const query = {
      page: 0,
      size: 9999,
    };
    getchangguan({ queryObject: query }).then((res) => {
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
  //判断新增删除
  const isEdit = !!edit;
  useEffect(() => {
    initFunc();
    if (isEdit) {
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      edit.timeRange = [];
      edit.timeRange[0] = moment(edit.startTime);
      edit.timeRange[1] = moment(edit.endTime);
      formRef.current.setFieldsValue(edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFun = (params: any) => {
    if (editId) {
      params.id = editId;
      const mange = { ...edit, ...params };
      const startTime = mange.timeRange[0];
      const endTime = mange.timeRange[1];
      mange.startTime = formatDate(startTime);
      mange.endTime = formatDate(endTime);
      if (new Date(mange.startTime) > new Date(mange.endTime)) {
        message.error('开始时间需早于结束时间');
        return;
      }
      editmatch(mange)
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
      const startTime = mange.timeRange[0];
      const endTime = mange.timeRange[1];
      mange.startTime = formatDate(startTime);
      mange.endTime = formatDate(endTime);
      if (new Date(mange.startTime) > new Date(mange.endTime)) {
        message.error('开始时间需早于结束时间');
        return;
      }
      save(mange)
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
      title={editId ? '编辑赛事' : '新增赛事'}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal" //label和输入框一行
        labelCol={{ style: { width: 140 } }}
        submitter={false}
      >
        <Row>
          {/* 赛事名称 */}
          <Col span={11}>
            <ProFormText
              name="name"
              label="赛事名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              // placeholder={'请输入赛事名称'}
              rules={[
                { required: true, message: '请输入赛事名称' },
                {
                  min: 1,
                  max: 40,
                  message: '赛事名称长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 赛事类型 */}
          <Col span={11} offset={1}>
            <ProFormSelect
              showSearch
              // placeholder={'请选择赛事类型'}
              name="compType"
              label="赛事类型"
              options={stateList}
              rules={[{ required: true, message: '请选择赛事类型' }]}
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
          {/* 组别信息 */}
          <Col span={11} offset={1}>
            <ProFormText
              // placeholder={'请输入组别信息'}
              name="teamType"
              label="组别信息"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                // { required: true, message: '请输入组别信息' },
                {
                  min: 1,
                  max: 40,
                  message: '组别信息长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 比赛队伍 */}
          <Col span={11}>
            <ProFormText
              // placeholder={'请输入比赛队伍'}
              name="playerTeam"
              label="比赛队伍"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                // { required: true, message: '请输入比赛队伍' },
                {
                  min: 1,
                  max: 40,
                  message: '比赛队伍长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 赛事结果 */}
          <Col span={11} offset={1}>
            <ProFormText
              // placeholder={'请输入赛事结果'}
              name="compResult"
              label="赛事结果"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                // { required: true, message: '请输入赛事结果' },
                {
                  min: 1,
                  max: 40,
                  message: '赛事结果长度在1~40之间',
                },
                { pattern: chinese, message: '请输入中文' },
              ]}
            />
          </Col>
          {/* 关联活动 */}
          <Col span={11}>
            <ProFormSelect
              showSearch
              // placeholder={'请选择关联活动'}
              name="activityId"
              label="关联活动"
              options={changguanList}
              rules={[{ required: true, message: '请选择关联活动' }]}
            />
          </Col>
          {/* 备注 */}
          <Col span={23}>
            <ProFormTextArea
              // placeholder={'请输入备注'}
              wrapperCol={{ span: 23 }}
              // getValueFromEvent={(e) => e.target.value.trim()}
              name="remark"
              label="备注"
              fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 5 } }}
              rules={[
                {
                  min: 1,
                  max: 400,
                  message: '备注长度在1~400之间',
                },
              ]}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};
export default AddUnit;
