import React from 'react';
import { Descriptions, Drawer, Tabs } from 'antd';
import styles from './index.less';

export interface FormValueType {
  name?: string;
  code?: string;
  categoryName?: string;
  lat?: number;
  lon?: number;
  height?: number;
  insertTime?: string;
  inserterId?: string;
  inserterName?: string;
  updateTime?: string;
  updaterId?: string;
  updaterName?: string;
}

export interface UpdateFormProps {
  onCancel: () => void;
  checkEquip: boolean;
  equipInfo: FormValueType;
}

const DetailEquip: React.FC<UpdateFormProps> = ({ onCancel, checkEquip, equipInfo }) => {
  return (
    <Drawer
      width={1000}
      title="设备详情"
      visible={checkEquip}
      onClose={() => {
        onCancel();
      }}
      closable={true}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          {checkEquip && (
            <Descriptions
              column={2}
              labelStyle={{
                width: '100px',
                justifyContent: 'right',
                marginRight: '16px',
                alignItems: 'center',
                color: '#666666',
              }}
              contentStyle={{ fontWeight: 'bold', color: '#000000' }}
              className={styles.layout}
            >
              <Descriptions.Item label="设备名称">{equipInfo.name}</Descriptions.Item>
              <Descriptions.Item label="设备编码">{equipInfo.code}</Descriptions.Item>
              <Descriptions.Item label="设备分类">{equipInfo.categoryName}</Descriptions.Item>
              <Descriptions.Item label="经度">{equipInfo.lon}</Descriptions.Item>
              <Descriptions.Item label="纬度">{equipInfo.lat}</Descriptions.Item>
              <Descriptions.Item label="高度">{equipInfo.height}</Descriptions.Item>
              <Descriptions.Item label="插入人">{equipInfo.inserterName}</Descriptions.Item>
              <Descriptions.Item label="插入时间">{equipInfo.insertTime}</Descriptions.Item>
              <Descriptions.Item label="更新人">{equipInfo.updaterName}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{equipInfo.updateTime}</Descriptions.Item>
            </Descriptions>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default DetailEquip;
