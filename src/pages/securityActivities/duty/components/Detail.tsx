/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Descriptions, Tabs } from 'antd';
import type { TableListItem, FormValueType, UpdateFormProps } from '../data.d';
import { DrawerForm } from '@ant-design/pro-form';
import styles from './index.less';

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [baseInfo, setBaseInfo] = useState<FormValueType>({});
  const { onCancel: handleModalVisible, modalVisible, title, userInfo } = props;

  useEffect(() => {
    setBaseInfo(userInfo);
  }, [userInfo]);

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
              justifyContent: 'right',
              marginRight: '16px',
              // alignItems: 'center',
              color: '#666666',
            }}
            contentStyle={{ fontWeight: 'bold', color: '#000000' }}
          >
            {/* <Descriptions.Item label="编码">{baseInfo.code}</Descriptions.Item> */}
            <Descriptions.Item label="插入时间">{baseInfo.insertTime}</Descriptions.Item>
            <Descriptions.Item label="插入人名称">{baseInfo.inserterName}</Descriptions.Item>
            {/* <Descriptions.Item label="插入人主键">{baseInfo.inserterId}</Descriptions.Item> */}
            <Descriptions.Item label="更新时间">{baseInfo.updateTime}</Descriptions.Item>
            <Descriptions.Item label="更新人名称">{baseInfo.updaterName}</Descriptions.Item>
            {/* <Descriptions.Item label="更新人主键">{baseInfo.updaterId}</Descriptions.Item> */}
            <Descriptions.Item label="值班名称">{baseInfo.name}</Descriptions.Item>
            <Descriptions.Item label="所属活动">{baseInfo.actName}</Descriptions.Item>
            <Descriptions.Item label="职务">{baseInfo.job}</Descriptions.Item>
            <Descriptions.Item label="所属部门">{baseInfo.dept}</Descriptions.Item>
            <Descriptions.Item label="开始时间">
              {baseInfo.startTime?.slice(0, 10)}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">{baseInfo.endTime?.slice(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="联系人">{baseInfo.user}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{baseInfo.phone}</Descriptions.Item>
            <Descriptions.Item label="数量" span={2}>
              {baseInfo.num}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {baseInfo.remark}
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>
      </Tabs>
    </DrawerForm>
  );
};

export default UpdateForm;
