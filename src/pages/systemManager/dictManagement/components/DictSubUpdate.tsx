import React, { useEffect } from 'react';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { saveDictData, editDictData } from '../../../../services/systemManager';

export interface TableListItem {
  subType: string;
  dictSubVisible: boolean;
  subInfo: Record<string, unknown>; //子字典信息
  dictSubInfo: Record<string, unknown>; //父字典信息
  cancelModal: () => void;
  Heavy: () => void;
}

const DictSubUpdate: React.FC<TableListItem> = ({
  subType,
  dictSubVisible,
  subInfo,
  dictSubInfo,
  cancelModal,
  Heavy,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  useEffect(() => {
    if (subType === 'subEdit') {
      form.setFieldsValue(subInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (data: Record<string, unknown>) => {
    saveDictData(data)
      .then((res) => {
        if (res.code === 200) {
          message.success('新增成功！');
          cancelModal();
          Heavy();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };

  const edit = (data: Record<string, unknown>) => {
    editDictData({ data: data })
      .then((res) => {
        if (res.code === 200) {
          message.success('编辑成功！');
          cancelModal();
          Heavy();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };

  // 确定
  const hideModal = () => {
    form.validateFields().then((values) => {
      values.parentId = dictSubInfo.id;
      if (subType == 'subAdd') {
        add(values);
      } else {
        values.id = subInfo.id;
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
      title={subType == 'subAdd' ? '新增字典子项' : subType == 'subEdit' ? '编辑字典子项' : ''}
      visible={dictSubVisible}
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
              label="子项名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true }]}
            >
              <Input
                autoComplete="off"
                maxLength={20}
                allowClear={true}
                placeholder={subType == 'subAdd' ? '请输入' : ''}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="code"
              label="子项编码"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '子项编码由1-36个数字或英文组成',
                },
              ]}
            >
              <Input
                autoComplete="off"
                allowClear={true}
                placeholder={subType == 'subAdd' ? '请输入' : ''}
                maxLength={36}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="sortIndex"
              label="显示顺序"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true },
                {
                  pattern: /(^[0-9]{1,9}$)/,
                  message: '显示顺序由1-9位正整数组成',
                },
              ]}
            >
              <Input
                autoComplete="off"
                allowClear={true}
                placeholder={subType == 'subAdd' ? '请输入' : ''}
                maxLength={9}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item name="remark" label="备注">
              <TextArea
                maxLength={400}
                autoSize={{ minRows: 3, maxRows: 2 }}
                placeholder={subType == 'subAdd' ? '请输入' : ''}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DictSubUpdate;
