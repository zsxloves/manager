import React, { useEffect } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import { saveClassificationData, editClassificationData } from '@/services/systemManager';
import TextArea from 'antd/lib/input/TextArea';
import styles from './index.less';

export interface IClassification {
  addInfo: Record<string, unknown>;
  visibleClass: boolean;
  updateType: string;
  editInfo: any;
  addhandleCancel: () => void;
  leftTree: () => void;
}

const AddClassification: React.FC<IClassification> = ({
  addInfo,
  visibleClass,
  updateType,
  editInfo,
  addhandleCancel,
  leftTree,
}) => {
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    if (updateType === 'edit') {
      form.setFieldsValue(editInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editInfo]);

  const add = (values: any) => {
    saveClassificationData({
      ...values,
      parentId: addInfo.id,
    })
      .then((res) => {
        if (res.success) {
          message.success(res.message);
          addhandleCancel();
          leftTree();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const edit = (values: any) => {
    editClassificationData({
      ...values,
      parentId: editInfo.parentId,
      id: editInfo.id,
    })
      .then((res) => {
        if (res.success) {
          message.success(res.message);
          addhandleCancel();
          leftTree();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  //新增分类--弹框
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (updateType === 'add') {
        add(values);
      } else {
        edit(values);
      }
    });
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            addhandleCancel();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleOk()}>
          保存
        </Button>
      </>
    );
  };
  return (
    <div>
      <Modal
        width={1000}
        title={updateType === 'add' ? '新建分类' : '编辑分类'}
        visible={visibleClass}
        maskClosable={false}
        onCancel={addhandleCancel}
        footer={renderFooter()}
      >
        <Form
          form={form}
          name="control-hooks"
          className={styles.formStyle}
          layout="horizontal"
          labelCol={{ style: { width: 140 } }}
        >
          <Row>
            <Col span={11}>
              <Form.Item
                name="name"
                label="分类名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[{ required: true }]}
              >
                <Input autoComplete="off" placeholder="请输入" maxLength={20} allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="code"
                label="分类编码"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  { required: true, message: '请输入编码' },
                  {
                    pattern: /^[A-Za-z0-9]{1,36}$/,
                    message: '编码由1-36个英文或数字组成',
                  },
                ]}
              >
                <Input autoComplete="off" placeholder="请输入" maxLength={36} allowClear={true} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="status"
                label="启用状态"
                rules={[{ required: true, message: '请选择启用状态' }]}
              >
                <Select placeholder="请选择" allowClear>
                  <Option value="1">启用</Option>
                  <Option value="0">未启用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <Form.Item name="description" label="备注">
                <TextArea
                  maxLength={400}
                  placeholder="请输入"
                  autoSize={{ minRows: 3, maxRows: 2 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddClassification;
