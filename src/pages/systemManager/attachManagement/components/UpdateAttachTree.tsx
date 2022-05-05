import React, { useEffect } from 'react';
import { Form, Modal, Input, Col, message, Button } from 'antd';
import { getAttachmentTreeAdd, getAttachmentTreeEdit } from '@/services/systemManager';

export interface ITable {
  showbg: boolean;
  treeId: string;
  attachTreeType: string;
  treeDetail: Record<string, unknown>;
  onCancel: () => void;
  getAllTree: (data?: any) => void;
}
export interface TableListItem {
  id: string;
  name?: string;
  description?: string;
}

const AttachOpera: React.FC<ITable> = ({
  showbg,
  treeId,
  attachTreeType,
  treeDetail,
  onCancel,
  getAllTree,
}) => {
  const [form] = Form.useForm();
  //const [userInfo, _setUserInfo] = useState<Record<string, unknown>>({}); //用户查询数据
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    if (attachTreeType === 'edit') {
      form.setFieldsValue(treeDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (params: any) => {
    params.parentId = treeId;
    getAttachmentTreeAdd(params)
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          getAllTree(res.data);
          onCancel();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const edit = (params: any) => {
    params.id = treeId;
    getAttachmentTreeEdit(params)
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          getAllTree(res.data);
          onCancel();
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  //修改附件树--弹框
  const handleOk = () => {
    form.validateFields().then((updateClassification) => {
      if (attachTreeType === 'add') {
        add(updateClassification);
      } else {
        edit(updateClassification);
      }
    });
  };

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
        <Button type="primary" onClick={() => handleOk()}>
          保存
        </Button>
      </>
    );
  };
  return (
    <>
      {showbg && (
        <Modal
          title={attachTreeType === 'add' ? '新增附件节点' : '编辑附件节点'}
          visible={showbg}
          maskClosable={false}
          onCancel={onCancel}
          footer={renderFooter()}
        >
          <Form
            form={form}
            // className={styles.formStyle}
            name="control-hooks"
            {...layout}
            labelCol={{ style: { width: 100 } }}
          >
            <Col span={24}>
              <Form.Item
                name="name"
                label="名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[{ required: true }]}
              >
                <Input autoComplete="off" maxLength={40} allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea
                  style={{ width: '100%' }}
                  showCount
                  maxLength={200}
                  autoSize={{ minRows: 3, maxRows: 2 }}
                />
              </Form.Item>
            </Col>
          </Form>
        </Modal>
      )}
    </>
  );
};
export default AttachOpera;
