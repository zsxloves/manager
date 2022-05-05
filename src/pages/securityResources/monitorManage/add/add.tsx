import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, Select, Button, message } from 'antd';
import { getTList, addVenue } from '../../../../services/venue/index';

interface Props {
  show: boolean;
  id?: string;
  onConfirm: any;
  onCancel: any;
  item: any;
}
type TTpye = {
  value: string;
  label: string;
}[];
const AddVenue: React.FC<Props> = (props) => {
  const [modelList, setModelList] = useState<TTpye>();
  const [TList, setTList] = useState<TTpye>();
  const { show, onCancel, onConfirm, item } = props;
  const [form] = Form.useForm();
  function setList(res: any, cb: any) {
    const list = res?.result?.page?.content;
    cb(
      list.map((v: any) => {
        return {
          label: v.name,
          value: v.id,
        };
      }),
    );
  }
  async function submit() {
    const data = await form.validateFields();
    const lonLat = data.lonLat.split(',');
    addVenue({ data: { ...data, id: item.id, lon: lonLat[0], lat: lonLat[1] } }).then((res) => {
      if (res.code === 200) {
        message.success('操作成功');
        onConfirm();
        form.resetFields();
      } else {
        message.error(res.message);
      }
    });
  }
  useEffect(() => {
    // 关联图层
    getTList().then((res) => {
      setList(res, setTList);
    });
    // 关联模型
    setModelList([
      {
        label: '模型1',
        value: 'm1',
      },
      {
        label: '模型2',
        value: 'm2',
      },
      {
        label: '模型3',
        value: 'm3',
      },
    ]);
    if (item.lon && item.lat) {
      item.lonLat = `${item.lon},${item.lat}`;
    }
    item.layerIds = item?.arLayermanagerVOS?.map((v: any) => v.id);
    form.setFieldsValue({ ...item });
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
          确定
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
      title="停车场新增"
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
              name="code"
              label="代码"
              rules={[
                { required: true, message: '请输入代码' },
                {
                  pattern: /^[0-9A-Za-z]{1,40}$/,
                  message: '字母、数字组成的1-40位字符',
                },
              ]}
            >
              <Input maxLength={100} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="name"
              label="停车场名称"
              rules={[{ required: true, message: '请输入停车场名称' }]}
            >
              <Input maxLength={40} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="type"
              label="停车场类别"
              rules={[{ required: true, message: '请选择停车场类别' }]}
            >
              <Input maxLength={40} placeholder="请选择" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="gymId"
              label="所属场馆"
              rules={[{ required: true, message: '请选择所属场馆' }]}
            >
              <Input placeholder="请选择" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="gymPerson"
              label="场馆负责人"
              rules={[{ required: true, message: '请输入场馆负责人' }]}
            >
              <Input maxLength={40} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="phoneNumber"
              label="联系方式"
              rules={[
                { required: true, message: '请输入联系方式' },
                {
                  pattern:
                    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
                  message: '联系方为固话或手机号',
                },
              ]}
            >
              <Input maxLength={100} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="layerIds"
              label="关联图层"
              rules={[{ required: true, message: '请选择关联图层' }]}
            >
              <Select placeholder={'请选择'} mode="multiple">
                {TList?.map((item1: any) => (
                  <Option key={item1.value} value={item1.value}>
                    {item1.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="modelId"
              label="关联模型"
              rules={[{ required: true, message: '请选择关联模型' }]}
            >
              <Select placeholder={'请选择'}>
                {modelList?.map((v: any) => {
                  return (
                    <Option key={v.value} value={v.value}>
                      {v.label}
                    </Option>
                  );
                })}
              </Select>
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
