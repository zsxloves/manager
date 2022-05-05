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
              alignItems: 'center',
              color: '#666666',
              justifyContent: 'right',
            }}
            contentStyle={{ fontWeight: 'bold', color: '#000000' }}
          >
            <Descriptions.Item label="班车名称">{info.name}</Descriptions.Item>
            <Descriptions.Item label="到达场馆">{info.tame}</Descriptions.Item>
            <Descriptions.Item label="所属活动">{info.activityName}</Descriptions.Item>
            <Descriptions.Item label="发车时间">{info.startTime}</Descriptions.Item>
            <Descriptions.Item label="预计到达时间">{info.startTime}</Descriptions.Item>
            <Descriptions.Item label="预计到达时间">{info.startTime}</Descriptions.Item>
            <Descriptions.Item label="GPS编码">{info.deviceId}</Descriptions.Item>
            <Descriptions.Item label="视频编码">{info.videoId}</Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
      </Tabs>
    </DrawerForm>
  );
};

export default UpdateForm;
