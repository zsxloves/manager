import React from 'react';
import { Descriptions, Drawer, Tabs } from 'antd';
import styles from './index.less';

export interface FormValueType {
  name?: string;
  typeName?: string;
  relatedPersonName?: string;
  company?: string;
  vedioId?: string;
  organizationName?: string;
  deviceId?: string;
  remark?: string;
  inserterName?: string;
  insertTime?: string;
  updaterName?: string;
  updateTime?: string;
}

export interface UpdateFormProps {
  onCancel: () => void;
  checkEquip: boolean;
  title: string;
  equipInfo: FormValueType;
}

const DetailEquip: React.FC<UpdateFormProps> = ({ onCancel, checkEquip, title, equipInfo }) => {
  return (
    <Drawer
      width={1000}
      title={title}
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
                color: '#666666',
              }}
              contentStyle={{ fontWeight: 'bold', color: '#000000' }}
              className={styles.layout}
            >
              <Descriptions.Item label="装备名称">{equipInfo.name}</Descriptions.Item>
              <Descriptions.Item label="装备类别">{equipInfo.typeName}</Descriptions.Item>
              <Descriptions.Item label="所属组织">{equipInfo.organizationName}</Descriptions.Item>
              <Descriptions.Item label="关联人员">{equipInfo.relatedPersonName}</Descriptions.Item>
              <Descriptions.Item label="品牌单位" span={2}>
                {equipInfo.company}
              </Descriptions.Item>
              <Descriptions.Item label="视频ID" span={2}>
                {equipInfo.vedioId}
              </Descriptions.Item>
              <Descriptions.Item label="GPSID" span={2}>
                {equipInfo.deviceId}
              </Descriptions.Item>
              <Descriptions.Item label="插入人">{equipInfo.inserterName}</Descriptions.Item>
              <Descriptions.Item label="插入人时间">{equipInfo.insertTime}</Descriptions.Item>
              <Descriptions.Item label="更新人">{equipInfo.updaterName}</Descriptions.Item>
              <Descriptions.Item label="更新时间" span={2}>
                {equipInfo.updateTime}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {equipInfo.remark}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default DetailEquip;
