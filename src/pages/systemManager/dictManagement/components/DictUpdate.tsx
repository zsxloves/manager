import React from 'react';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { saveDictData, editDictData } from '../../../../services/systemManager';

export interface TableListItem {
  dictType: string;
  dictAdd: boolean;
  dictInfo: Record<string, unknown>;
  cancelModal: () => void;
  heavyLoad: () => void;
}

const AddDictionary: React.FC<TableListItem> = ({
  dictType,
  dictAdd,
  dictInfo,
  cancelModal,
  heavyLoad,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const add = (data: Record<string, unknown>) => {
    saveDictData(data)
      .then((res) => {
        if (res.code === 200) {
          message.success('新增成功！');
          cancelModal();
          heavyLoad();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const edit = (data: Record<string, unknown>) => {
    editDictData({ data: data })
      .then((res) => {
        if (res.code === 200) {
          message.success('编辑成功！');
          cancelModal();
          heavyLoad();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  // 确定
  const hideModal = () => {
    form.validateFields().then((values) => {
      if (dictType == 'add') {
        add(values);
      } else {
        values.id = dictInfo.id;
        values.sortIndex = dictInfo.sortIndex;
        edit(values);
      }
    });
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancelModal();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => hideModal()}>
          保存
        </Button>
      </>
    );
  };
  return (
    <Modal
      title={dictType == 'add' ? '新增字典' : dictType == 'edit' ? '编辑字典' : ''}
      visible={dictAdd}
      okText="确认"
      cancelText="取消"
      centered={true}
      width={1000}
      onCancel={cancelModal}
      footer={renderFooter()}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form labelCol={{ style: { width: 140 } }} layout="horizontal" requiredMark form={form}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              label="字典名称"
              initialValue={dictType == 'edit' ? dictInfo.name : ''}
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                autoComplete="off"
                maxLength={20}
                allowClear={true}
                placeholder={dictType == 'add' ? '请输入' : ''}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="code"
              label="编码"
              initialValue={dictType == 'edit' ? dictInfo.code : ''}
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '编码由1-36个数字或英文组成',
                },
              ]}
            >
              <Input
                autoComplete="off"
                maxLength={20}
                allowClear={true}
                placeholder={dictType == 'add' ? '请输入' : ''}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item
              name="remark"
              label="备注"
              initialValue={dictType == 'edit' ? dictInfo.remark : ''}
            >
              <TextArea
                maxLength={400}
                autoSize={{ minRows: 3, maxRows: 2 }}
                placeholder={dictType == 'add' ? '请输入' : ''}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddDictionary;
