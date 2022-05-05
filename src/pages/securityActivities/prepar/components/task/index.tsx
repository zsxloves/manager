import React, { useState, useRef, useEffect } from 'react';
import ProForm, { ProFormText, ProFormDateTimeRangePicker } from '@ant-design/pro-form';
import { Row, Col, Modal, Button, Form, TreeSelect, message } from 'antd';
import { org, taskadd } from '../../../../../services/prepar';
import { formatDate } from '@/utils/utilsJS';
interface Props {
  solutionId: string;
  activityId: string;
  taskName: string;
  cancle: () => void;
}
let range: any[];
const Task: React.FC<Props> = (props) => {
  const { taskName, cancle, solutionId, activityId } = props;
  const [orgList, setorgList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //组织机构
  useEffect(() => {
    org({}).then((res) => {
      setorgList(res.data);
    });
  }, []);
  const formRef: any = useRef(null);
  // 取消
  const cancelFun = (): void => {
    cancle();
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancle();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            formRef.current.validateFields().then((val: any) => {
              const mange = { ...val };
              mange.startTime = formatDate(range[0]);
              mange.endTime = formatDate(range[1]);
              mange.status = 0;
              taskadd({ ...mange, activityId, solutionId })
                .then((res: any) => {
                  if (res.code === 200) {
                    message.success('任务增加成功');
                  }
                })
                .catch((err: any) => {
                  console.log(err);
                });
              cancle();
            });
          }}
        >
          保存
        </Button>
      </>
    );
  };
  return (
    <>
      <Modal
        maskClosable={false}
        visible={true}
        width={500}
        onCancel={cancelFun}
        footer={renderFooter()}
        title={'派发任务'}
      >
        <ProForm
          formRef={formRef}
          layout="horizontal" //label和输入框一行
          labelCol={{ style: { width: 140 } }}
          submitter={false}
        >
          <Row>
            {/* 任务名称 */}
            <Col span={24}>
              <ProFormText name="name" label="任务名称" initialValue={taskName} disabled />
            </Col>
            {/* 所属组织 */}
            <Col span={24}>
              <Form.Item
                label="关联组织机构"
                name="organizationIdList"
                rules={[{ required: true, message: '请选择组织机构' }]}
              >
                <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  maxTagCount={1}
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  treeData={orgList}
                  treeNodeFilterProp="title"
                  showSearch
                />
              </Form.Item>
            </Col>
            {/* 开始时间 */}
            <Col span={24}>
              <ProFormDateTimeRangePicker
                label="起始时间"
                name="range"
                fieldProps={{
                  showTime: { format: 'HH:mm' },
                  format: 'YYYY-MM-DD HH:mm',
                  onOk: (e: any) => {
                    range = e;
                  },
                }}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  );
};
export default Task;
