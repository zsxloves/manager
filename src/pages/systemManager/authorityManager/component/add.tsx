import React, { useEffect } from 'react';
import { Modal, Button, message, Form, Row, Col, Input, Select } from 'antd';
// import type { TableListItem } from '../data.d';
import { powerAdd, powerUpdate } from '@/services/authorityManager';
export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (list?: any) => void;
  addModalVisible: boolean;
  title: string;
  formData: any;
  parentId?: string;
}

const { Option } = Select;

const Add: React.FC<BaseConfirmProps> = (props) => {
  // const [parentList, setParentList] = useState<TableListItem[]>([]);
  const {
    onSubmit: handleConfirm,
    onCancel: handleCancel,
    addModalVisible,
    title,
    formData,
    parentId,
  } = props;
  const [form] = Form.useForm();
  const handleEnsure = async () => {
    const fieldsValue = await form.validateFields();
    console.log('fieldsValue:', fieldsValue);
    if (formData) {
      powerUpdate({ data: { ...formData, ...fieldsValue } })
        .then((res) => {
          if (res.code === 200) {
            message.success(res.message);
            handleConfirm();
          } else {
            message.error(res.message);
          }
        })
        .catch((err) => {
          message.error(err.message || err);
        });
    } else {
      const pid = parentId === '0' ? null : parentId;
      powerAdd({ ...fieldsValue, parentId: pid })
        .then((res) => {
          if (res.code === 200) {
            message.success(res.message);
            handleConfirm();
          } else {
            message.error(res.message);
          }
        })
        .catch((err) => {
          message.error(err.message || err);
        });
    }
  };
  // const getParentList = () => {
  //   powerPage({
  //     queryObject: {
  //       page: 0,
  //       size: 999,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.code === 200) {
  //         const list = res.result.page?.content || [];
  //         setParentList(list);
  //       }
  //     })
  //     .catch((err) => {
  //       message.error(err.message);
  //     });
  // };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            handleCancel(false);
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleEnsure()}>
          保存
        </Button>
      </>
    );
  };

  useEffect(() => {
    // getParentList();
    if (formData) {
      console.log(formData);
      form.setFieldsValue(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 0' }}
      destroyOnClose
      title={title}
      maskClosable={false}
      visible={addModalVisible}
      footer={renderFooter()}
      onCancel={() => {
        handleCancel(false);
      }}
    >
      <Form form={form} style={{ paddingRight: 60 }} labelCol={{ style: { width: 140 } }}>
        <Row>
          <Col span={11}>
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input maxLength={32} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="code"
              label="权限值"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入权限值' },
                {
                  pattern: /(^[a-zA-Z][a-zA-Z0-9]{0,}$)/g,
                  message: '请输入字母开头的字母或数字组成的字符串',
                },
              ]}
            >
              <Input maxLength={32} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="type"
              label="权限分类"
              rules={[{ required: true, message: '请选择权限分类' }]}
            >
              <Select
                placeholder={'请选择'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    parentId: key,
                  });
                }}
              >
                <Option key="menu" value="menu">
                  菜单
                </Option>
                <Option key="fun" value="fun">
                  功能
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="redirectUrl"
              label="权限地址"
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input maxLength={200} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="remark" label="备注">
              <Input.TextArea
                rows={2}
                maxLength={400}
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 2 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Add;
