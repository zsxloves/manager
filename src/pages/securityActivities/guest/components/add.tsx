import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Select, Button, message, DatePicker } from 'antd';
import { addGuest } from '../../../../services/guestManager/index';
import { formatDate } from '@/utils/utilsJS';
import { getDictfindAll } from '@/services/systemManager';
import useActIds from '../../../../hooks/useActIds';
import moment from 'moment';
import styles from './index.less';

interface Props {
  show: boolean;
  id?: string;
  onConfirm: any;
  onCancel: any;
  item: any;
  guestType?: string;
}
const AddVenue: React.FC<Props> = (props) => {
  const { show, onCancel, onConfirm, item, guestType } = props;
  const [form] = Form.useForm();
  const useActIdsRes = useActIds();

  const [JBType, setJBType] = useState<{ label: string; value: string }[]>([]); //嘉宾类型

  const filters = (data: any) => {
    const info = data.result.result;
    if (info.length > 0) {
      for (let i = 0; i < info.length; i++) {
        info[i].label = info[i].name;
        info[i].value = info[i].id;
      }
    }
    return info;
  };
  //初始化
  const initFun = () => {
    //字典库--嘉宾类型查询
    getDictfindAll({ parentId: 'bfa81723-6be0-4838-9aaa-e86ae463f7d8' })
      .then((res) => {
        const data = filters(res);
        setJBType(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  async function submit() {
    const data = await form.validateFields();
    const time = formatDate(data?.enterTime);
    if (guestType === 'edit') {
      data.id = item.id;
    }
    addGuest({ data: { ...data, sortIndex: item.sortIndex, enterTime: time } })
      .then((res) => {
        if (res.code === 200) {
          message.success('操作成功');
          onConfirm();
          form.resetFields();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }
  useEffect(() => {
    initFun();
    if (guestType === 'edit') {
      // if (item.lon && item.lat) {
      //   item.lonLat = `${item.lon},${item.lat}`;
      // }
      item.actIds = item?.arActivityVOS?.map((v: any) => v.id);
      if (item.enterTime) {
        item.enterTime = moment(item.enterTime);
      }
      form.setFieldsValue({ ...item });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            onCancel();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            submit();
          }}
        >
          保存
        </Button>
      </>
    );
  };
  const { Option } = Select;
  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 0' }}
      destroyOnClose
      title={guestType === 'add' ? '嘉宾新增' : '嘉宾编辑'}
      maskClosable={false}
      visible={show}
      footer={renderFooter()}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form form={form} style={{ paddingRight: 60 }} labelCol={{ style: { width: 140 } }}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              label="嘉宾姓名"
              rules={[{ required: true, message: '请输入嘉宾姓名' }]}
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input maxLength={40} placeholder="请输入" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="actIds"
              label="所属活动"
              rules={[{ required: true, message: '请选择所属活动' }]}
            >
              <Select
                showSearch
                mode="multiple"
                placeholder="请选择"
                allowClear
                maxTagCount={2}
                maxTagTextLength={3}
                optionFilterProp="label"
                loading={useActIdsRes.loading}
              >
                {useActIdsRes.list.map((v: any) => {
                  return (
                    <Option key={v.id} value={v.id} label={v.name}>
                      {v.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="code"
              label="代码"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                // { required: true, message: '请输入代码' },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '代码由1-36位字母、数字组成',
                },
              ]}
            >
              <Input maxLength={36} placeholder="请输入" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="job"
              label="职业"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入职业' }]}
            >
              <Input placeholder="请输入" autoComplete="off" maxLength={40} allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="type"
              label="嘉宾类型"
              rules={[{ required: true, message: '请选择嘉宾类型' }]}
            >
              <Select options={JBType} placeholder="请选择" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input maxLength={40} placeholder="请输入" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles.date}>
            <Form.Item
              name="enterTime"
              label="日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
AddVenue.defaultProps = {
  id: '',
};

export default AddVenue;
