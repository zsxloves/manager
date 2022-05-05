import React, { useEffect, useState, useRef } from 'react';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import { Modal, Row, Col, message, Form, Button } from 'antd';
import { getDutyInfo, saveDuty, ActList } from '../../../../services/duty';
import styles from './index.less';
import moment from 'moment';
import { formatDate } from '@/utils/utilsJS';

declare interface Props {
  editId?: string;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, editId, reload } = props;
  const formRef: any = useRef(null);
  const [userId] = useState<string>(editId);
  const [actList, setactList] = useState<any[]>([]); //所属活动列表
  const [flag, setFlag] = useState<boolean>(showAdd); //所属活动列表
  //初始化
  const initFun = () => {
    // 获取所属活动列表
    const queryObject = { page: 0, size: 10000000 };
    ActList({ queryObject })
      .then((res) => {
        if (res.code === 200) {
          const data = res.result.page.content;
          const de =
            data &&
            data.map((item: Record<string, unknown>) => {
              return {
                value: item.id,
                label: item.name,
              };
            });
          setactList(de);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
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
  const isEdit = !!userId;
  useEffect(() => {
    initFun();
    if (isEdit) {
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      getDutyInfo({ id: userId, page: 0, size: 1 })
        .then((res) => {
          const data = res.result.detail;
          data.timeRange = [];
          data.timeRange[0] = moment(data.startTime?.slice(0, 10), 'YYYY-MM-DD');
          data.timeRange[1] = moment(data.endTime?.slice(0, 10), 'YYYY-MM-DD');
          formRef.current.setFieldsValue(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateDuty = (params: any) => {
    if (userId) {
      params.id = userId;
    }
    const mange = { ...params };
    const [startTime, endTime] = mange.timeRange;
    mange.startTime = formatDate(startTime);
    mange.endTime = formatDate(endTime);
    if (new Date(mange.startTime) > new Date(mange.endTime)) {
      message.error('开始时间需早于结束时间');
      return;
    }
    saveDuty({ data: mange })
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
  };
  // 取消
  const cancelFun = (): void => {
    change();
    setFlag(false);
    // history.push('/securityActivities/duty');
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
              updateDuty(val);
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
      footer={renderFooter()}
      visible={flag}
      width={1000}
      onCancel={cancelFun}
      title={userId ? '编辑值班' : '新增值班'}
    >
      <ProForm
        formRef={formRef}
        labelCol={{ style: { width: 110 } }}
        className={styles.addmodel}
        layout="horizontal" //label和输入框一行c
        submitter={false}
      >
        <Row>
          {/* 值班名称 */}
          <Col span={11}>
            <ProFormText
              name="name"
              label="值班名称"
              // placeholder="请输入值班名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入值班名称' },
                {
                  min: 1,
                  max: 40,
                  message: '值班名称长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 职务 */}
          <Col span={11} offset={1}>
            <ProFormText
              name="job"
              label="职务"
              // placeholder="请输入职务"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入职务' },
                { min: 1, max: 40, message: '职务长度在1~40之间' },
              ]}
            />
          </Col>
          {/* 所属活动 */}
          <Col span={11}>
            <ProFormSelect
              showSearch
              name="act"
              label="所属活动"
              options={actList}
              rules={[{ required: true, message: '请选择状态' }]}
            />
          </Col>
          {/* 所属部门 */}
          <Col span={11} offset={1}>
            <ProFormText
              name="dept"
              label="所属部门"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入所属部门' },
                { min: 1, max: 40, message: '所属部门长度在1~40之间' },
              ]}
            />
          </Col>
          {/* 联系人 */}
          <Col span={11}>
            <ProFormText
              name="user"
              // placeholder="请输入联系人"
              label="联系人"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入联系人' },
                {
                  min: 1,
                  max: 40,
                  message: '联系人长度在1~40之间',
                },
                { pattern: /^[\u4E00-\u9FA5]*$/, message: '请输入中文' },
              ]}
            />
          </Col>
          {/* 联系方式 */}
          <Col span={11} offset={1}>
            <ProFormText
              name="phone"
              // placeholder="请输入联系方式"
              label="联系方式"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 100, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入联系方式' },
                // {
                //   pattern: /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/,
                //   message: '请输入正确的联系方式',
                // },
              ]}
            />
          </Col>
          {/* 起始时间 */}
          <Col span={11}>
            <Form.Item
              name="timeRange"
              label="起始时间"
              rules={[{ required: true, message: '请选择起始时间' }]}
            >
              <ProFormDateRangePicker
                fieldProps={{
                  disabledDate: disableStart,
                }}
              />
            </Form.Item>
          </Col>
          {/* 数量 */}
          <Col span={11} offset={1}>
            <ProFormText
              name="num"
              // placeholder="请输入数量"
              label="数量"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 9, autoComplete: 'off' }}
              rules={[
                {
                  pattern: /^\d+$/,
                  message: '请输入整数',
                },
              ]}
            />
          </Col>
          {/* 备注 */}
          <Col span={23}>
            <ProFormTextArea
              wrapperCol={{ span: 23 }}
              name="remark"
              label="备注"
              // getValueFromEvent={(e) => e.target.value.trim()}
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
