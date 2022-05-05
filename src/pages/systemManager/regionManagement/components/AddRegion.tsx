import React, { useEffect } from 'react';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { saveRegionData, editAreaData } from '@/services/systemManager';
import styles from '../index.less';
import TextArea from 'antd/lib/input/TextArea';

export interface IRegion {
  addInfo: Record<string, unknown>;
  regionType: string;
  regionData: any;
  visibleClass: boolean;
  addhandleCancel: () => void;
  leftTree: () => void;
}

const AddRegion: React.FC<IRegion> = ({
  addInfo,
  regionType,
  regionData,
  visibleClass,
  addhandleCancel,
  leftTree,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (regionType === 'edit') {
      form.setFieldsValue(regionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionData]);

  const add = (data: any) => {
    saveRegionData({
      ...data,
      parentId: addInfo.id || null,
    })
      .then((res) => {
        if (res.success) {
          addhandleCancel();
          leftTree();
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const edit = (data: any) => {
    editAreaData({
      ...data,
      parentId: regionData.parentId,
      id: regionData.id,
      sortColumn: 'sa.create_time',
      sortOrder: 'desc',
    })
      .then((res) => {
        if (res.success) {
          addhandleCancel();
          leftTree();
          message.success(res.message);
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
      if (regionType === 'add') {
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
    <Modal
      width={1000}
      title={regionType === 'add' ? '新建区域' : '编辑区域'}
      visible={visibleClass}
      maskClosable={false}
      onCancel={addhandleCancel}
      footer={renderFooter()}
    >
      <Form
        form={form}
        className={styles.formStyle}
        name="control-hooks"
        layout="horizontal"
        labelCol={{ style: { width: 140 } }}
      >
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              label="区域名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入区域名称' }]}
            >
              <Input autoComplete="off" placeholder="请输入" maxLength={20} allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="code"
              label="区域编码"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入区域编码' },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '区域编码由1-36个英文或数字构成',
                },
              ]}
            >
              <Input autoComplete="off" placeholder="请输入" maxLength={36} allowClear={true} />
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
  );
};

export default AddRegion;
