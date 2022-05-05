import React from 'react';
import { Descriptions, Drawer, Tabs } from 'antd';
import styles from './index.less';

export interface FormValueType {
  name?: string;
  title?: string;
  userName?: string;
  type?: string;
  organizationName?: string;
  insertTime?: string;
  inserterName?: string;
  inserterId?: string;
  updateTime?: string;
  updaterName?: string;
  updaterId?: string;
  remark?: string;
}

export interface UpdateFormProps {
  onCancel: () => void;
  detailVs: boolean;
  detailIn: FormValueType;
}

const DetailEquip: React.FC<UpdateFormProps> = ({ onCancel, detailVs, detailIn }) => {
  return (
    <Drawer
      width={1000}
      title="附件详情"
      visible={detailVs}
      onClose={() => {
        onCancel();
      }}
      closable={true}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          {detailVs && (
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
              <Descriptions.Item label="附件名称">{detailIn.name}</Descriptions.Item>
              <Descriptions.Item label="文件">{detailIn.title}</Descriptions.Item>
              <Descriptions.Item label="关联组织机构">
                {detailIn.organizationName}
              </Descriptions.Item>
              <Descriptions.Item label="关联用户">{detailIn.userName}</Descriptions.Item>
              <Descriptions.Item label="附件类别">
                {detailIn.type === '0' ? '文件' : detailIn.type === '1' ? '目录' : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="插入时间">{detailIn.insertTime}</Descriptions.Item>
              <Descriptions.Item label="插入人">{detailIn.inserterName}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{detailIn.updateTime}</Descriptions.Item>
              <Descriptions.Item label="更新人" span={2}>
                {detailIn.updaterName}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {detailIn.remark}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default DetailEquip;
