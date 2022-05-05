import React, { useState } from 'react';
import { Descriptions, Tabs, message } from 'antd';
import type { TableListItem, FormValueType } from '../data';
import { DrawerForm } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import styles from './index.less';
import { giveTime } from '../../../../services/task';
export interface UpdateFormProps {
  giveData: any;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  modalVisible: boolean;
  title: string;
  info: any;
  recordself: any;
}
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onCancel: handleModalVisible, modalVisible, title, info, giveData, recordself } = props;
  const [self] = useState<any[]>(JSON.parse(giveData?.entity || '{}')?.info?.self || []);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'personName',
      hideInSearch: false,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'posTypeName',
      hideInSearch: false,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      hideInSearch: false,
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      hideInSearch: false,
      ellipsis: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      hideInSearch: false,
      ellipsis: true,
    },
  ];
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
            <Descriptions.Item label="任务名称">{info.name}</Descriptions.Item>
            <Descriptions.Item label="所属组织">{info.orgName}</Descriptions.Item>
            <Descriptions.Item label="关联活动">{info.activityName}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{info.startTime}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{info.endTime}</Descriptions.Item>
            <Descriptions.Item label="经度">{giveData.lat}</Descriptions.Item>
            <Descriptions.Item label="纬度">{giveData.lon}</Descriptions.Item>
            <Descriptions.Item label="高度">{giveData.height}</Descriptions.Item>
            <Descriptions.Item label="所属预案">{giveData.planName}</Descriptions.Item>
            {self.length > 0 &&
              self.map((item) => {
                return (
                  <Descriptions.Item key={item.first} label={item.first}>
                    {item.last}
                  </Descriptions.Item>
                );
              })}
          </Descriptions>
        </Tabs.TabPane>
        <Tabs.TabPane tab="派发人员" key="2">
          <ProTable<TableListItem>
            scroll={{ x: '100%', y: 'auto' }}
            columns={columns}
            request={async () => {
              const res = await giveTime({
                type: 2,
                taskId: recordself?.id,
              });
              if (res.code === 200) {
              } else {
                message.error(res.message);
              }
              return {
                data: res.data.rows,
                success: res.code === 200 ? true : false,
              };
            }}
            search={false}
            options={{
              density: false,
              fullScreen: undefined,
              reload: undefined,
              setting: false,
            }}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </DrawerForm>
  );
};

export default UpdateForm;
