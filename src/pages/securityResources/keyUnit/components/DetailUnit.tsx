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
    if (userInfo) {
      setBaseInfo(userInfo);
    }
  }, [userInfo]);

  return (
    <DrawerForm<TableListItem>
      className={styles.layout}
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
            <Descriptions.Item label="单位名称">{baseInfo.name}</Descriptions.Item>
            <Descriptions.Item label="标准地址">{baseInfo.standardAddress}</Descriptions.Item>
            <Descriptions.Item label="经度">{baseInfo.lon}</Descriptions.Item>
            <Descriptions.Item label="纬度">{baseInfo.lat}</Descriptions.Item>
            <Descriptions.Item label="高度">{baseInfo.height}</Descriptions.Item>
            <Descriptions.Item label="简称">{baseInfo.abbreviation}</Descriptions.Item>
            <Descriptions.Item label="公司状态">{baseInfo.statusName}</Descriptions.Item>
            <Descriptions.Item label="法人">{baseInfo.corporation}</Descriptions.Item>
            <Descriptions.Item label="社会统一信用编码">{baseInfo.uscc}</Descriptions.Item>
            <Descriptions.Item label="联系人" span={2}>
              {baseInfo.contacts}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">{baseInfo.contactNo}</Descriptions.Item>
            <Descriptions.Item label="组织机构" span={2}>
              {baseInfo.orgName}
            </Descriptions.Item>
            <Descriptions.Item label="安保联系人">{baseInfo.securityContacts}</Descriptions.Item>
            <Descriptions.Item label="安保联系电话">{baseInfo.securityContactno}</Descriptions.Item>
            <Descriptions.Item label="单位类型">{baseInfo.unitTypeName}</Descriptions.Item>
            <Descriptions.Item label="存放危险物品名称">{baseInfo.dangerName}</Descriptions.Item>
            <Descriptions.Item label="类别">{baseInfo.type}</Descriptions.Item>
            <Descriptions.Item label="数量">{baseInfo.num}</Descriptions.Item>
            <Descriptions.Item label="控制措施">{baseInfo.measures}</Descriptions.Item>
            <Descriptions.Item label="涉及路名">{baseInfo.road}</Descriptions.Item>
            <Descriptions.Item label="片区">{baseInfo.area}</Descriptions.Item>
            <Descriptions.Item label="道路出入口数">{baseInfo.roadNum}</Descriptions.Item>
            <Descriptions.Item label="出入口排查道路数">{baseInfo.checkNum}</Descriptions.Item>
            <Descriptions.Item label="隶属单位">{baseInfo.unit}</Descriptions.Item>
            <Descriptions.Item label="是否有红绿灯">{baseInfo.isLight}</Descriptions.Item>
            <Descriptions.Item label="道路中是否有隔离">{baseInfo.isLimit}</Descriptions.Item>
            <Descriptions.Item label="与非机动车是否隔离">{baseInfo.isCarLimit}</Descriptions.Item>
            <Descriptions.Item label="是否有斑马线">{baseInfo.isLine}</Descriptions.Item>
            <Descriptions.Item label="位置方向">{baseInfo.storeAddress}</Descriptions.Item>
            <Descriptions.Item label="具体线路">{baseInfo.line}</Descriptions.Item>
            <Descriptions.Item label="长度">{baseInfo.length}</Descriptions.Item>
            <Descriptions.Item label="宽度">{baseInfo.width}</Descriptions.Item>
            <Descriptions.Item label="插入时间">{baseInfo.insertTime}</Descriptions.Item>
            <Descriptions.Item label="插入人名称">{baseInfo.inserterName}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{baseInfo.updateTime}</Descriptions.Item>
            <Descriptions.Item label="更新人名称" span={2}>
              {baseInfo.updaterName}
            </Descriptions.Item>
            <Descriptions.Item label="距离" span={2}>
              {baseInfo.distence}
            </Descriptions.Item>
            <Descriptions.Item label="距离类型" span={2}>
              {baseInfo.distenceType}
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
