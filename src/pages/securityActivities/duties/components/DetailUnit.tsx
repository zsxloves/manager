import React from 'react';
import { Descriptions, Tabs } from 'antd';
import type { TableListItem, FormValueType } from '../data.d';
import { DrawerForm } from '@ant-design/pro-form';
import styles from './index.less';
export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  modalVisible: boolean;
  title: string;
  info: any;
}
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onCancel: handleModalVisible, modalVisible, title, info } = props;
  return (
    <DrawerForm<TableListItem>
      title={title}
      visible={modalVisible}
      drawerProps={{
        footerStyle: {
          display: 'none',
        },
        bodyStyle: {
          padding: '0 28px 24px',
        },
        footer: false,
        forceRender: true,
        destroyOnClose: true,
        maskClosable: true,
        onClose: () => {
          handleModalVisible();
        },
      }}
      submitter={false}
      className={styles.layout}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          <Descriptions
            column={2}
            labelStyle={{
              width: '140px',
              marginRight: '16px',
              color: '#666666',
              justifyContent: 'right',
            }}
            contentStyle={{ fontWeight: 'bold', color: '#000000' }}
          >
            <Descriptions.Item label="任务名称">{info.name}</Descriptions.Item>
            <Descriptions.Item label="任务类型">{info.typeName}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{info.startTime}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{info.endTime}</Descriptions.Item>
            <Descriptions.Item label="父级任务">{info.parentName}</Descriptions.Item>
            <Descriptions.Item label="责任人">{info.user}</Descriptions.Item>
            <Descriptions.Item label="关联活动">{info.activityName}</Descriptions.Item>
            <Descriptions.Item label="关联场馆">{info.gymName}</Descriptions.Item>
            <Descriptions.Item label="范围" span={2}>
              {info.limits}
            </Descriptions.Item>
            <Descriptions.Item label="责任单位" span={2}>
              {info.dutyUnit}
            </Descriptions.Item>
            <Descriptions.Item label="关联图层图元" span={2}>
              {info.metaIdsName}
            </Descriptions.Item>
            <Descriptions.Item label="关联预案" span={2}>
              {info.planIdsName}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {info.remark}
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
      </Tabs>
    </DrawerForm>
  );
};

export default UpdateForm;
