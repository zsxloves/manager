import React, { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormDateTimePicker } from '@ant-design/pro-form';
import { Modal, Row, Col, message, Button } from 'antd';
import { editTask } from '../../../../services/task';
import styles from './index.less';
import { formatDate } from '@/utils/utilsJS';
declare interface Props {
  editData?: any;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, editData, reload } = props;
  const formRef: any = useRef(null);
  const [flag, setFlag] = useState<boolean>(showAdd); //所属活动列表
  useEffect(() => {
    const data = editData;
    formRef.current.setFieldsValue(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateDuty = (params: any) => {
    params.id = editData.id;
    const mange = { ...params };
    mange.startTime = formatDate(mange.startTime);
    mange.endTime = formatDate(mange.endTime);
    editTask(mange)
      .then((res: any) => {
        if (res.code === 200) {
          message.success(res.message);
          reload();
          change();
          setFlag(false);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 取消
  const cancelFun = (): void => {
    change();
    setFlag(false);
    // history.push('/securityActivities/duty');
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancelFun();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            formRef.current.validateFields().then((val: any) => {
              updateDuty(val);
            });
          }}
        >
          保存
        </Button>
      </>
    );
  };
  return (
    <Modal
      footer={renderFooter()}
      visible={flag}
      width={500}
      onCancel={cancelFun}
      title={'编辑岗位'}
      maskClosable={false}
    >
      <ProForm
        formRef={formRef}
        labelCol={{ style: { width: 110 } }}
        className={styles.addmodel}
        layout="horizontal" //label和输入框一行c
        submitter={false}
      >
        <Row>
          {/* 岗位名称 */}
          <Col span={22}>
            <ProFormText
              name="name"
              label="岗位名称"
              placeholder="请输入岗位名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 200, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入岗位名称' },
                {
                  min: 1,
                  max: 200,
                  message: '岗位名称长度在1~200之间',
                },
              ]}
            />
          </Col>
          {/* 开始时间 */}
          <Col span={24}>
            <ProFormDateTimePicker
              placeholder={'请选择开始时间'}
              name="startTime"
              label="开始时间"
              rules={[{ required: true, message: '请选择开始时间' }]}
            />
          </Col>
          {/* 结束时间 */}
          <Col span={24}>
            <ProFormDateTimePicker
              placeholder={'请选择结束时间'}
              name="endTime"
              label="结束时间"
              rules={[{ required: true, message: '请选择结束时间' }]}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};
export default AddUnit;
