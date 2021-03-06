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
          ??????
        </Button>
        <Button type="primary" onClick={() => handleEnsure()}>
          ??????
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
            <Form.Item name="name" label="??????" rules={[{ required: true, message: '???????????????' }]}>
              <Input maxLength={32} placeholder="?????????" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="code"
              label="?????????"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '??????????????????' },
                {
                  pattern: /(^[a-zA-Z][a-zA-Z0-9]{0,}$)/g,
                  message: '?????????????????????????????????????????????????????????',
                },
              ]}
            >
              <Input maxLength={32} placeholder="?????????" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="type"
              label="????????????"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Select
                placeholder={'?????????'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    parentId: key,
                  });
                }}
              >
                <Option key="menu" value="menu">
                  ??????
                </Option>
                <Option key="fun" value="fun">
                  ??????
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="redirectUrl"
              label="????????????"
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input maxLength={200} placeholder="?????????" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="remark" label="??????">
              <Input.TextArea
                rows={2}
                maxLength={400}
                placeholder="?????????"
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
