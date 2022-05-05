import React from 'react';
import { Descriptions, Tabs } from 'antd';
import type { TableListItem, FormValueType } from '../../duties/data';
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
            <Descriptions.Item label="上报区域">{info?.reportAreaName}</Descriptions.Item>
            <Descriptions.Item label="上报时间">{info?.reportTime}</Descriptions.Item>
            <Descriptions.Item label="已售门票">{info?.num}</Descriptions.Item>
            <Descriptions.Item label="入园人数">{info?.addNum}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {info?.remark}
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
      </Tabs>
    </DrawerForm>
  );
};

export default UpdateForm;
