/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Descriptions, message, Image, Drawer, Tabs } from 'antd';
import { getUserInfo, getAttachmentList } from '@/services/systemManager';
import styles from './index.less';

export interface FormValueType {
  name?: string;
  remark?: string;
  password?: string;
  idCardCode?: string;
  mobilePhone?: string;
  code?: string;
  insertTime?: string;
  updaterId?: string;
  updateTime?: string;
  roleId?: string;
  updaterName?: string;
  inserterName?: string;
  enable?: string;
  roleName?: string;
  organizationName?: string;
  minioFileUrl?: string;
  regionName?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  modalVisible: boolean;
  title: string;
  userId: string;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onCancel: handleModalVisible, modalVisible, title, userId } = props;
  const [baseInfo, setBaseInfo] = useState<FormValueType>({});

  const getAttachId = (data: any) => {
    if (data.avatarId) {
      getAttachmentList({ id: data.avatarId })
        .then((res) => {
          const info = res.data.rows[0];
          if (info.minioFileUrl) {
            data.minioFileUrl = info.minioFileUrl;
          }
          setBaseInfo(data);
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      setBaseInfo(data);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserInfo({ id: userId, page: 0, size: 1 })
        .then((res) => {
          if (res.code === 200) {
            const data = res.result.detail;
            // if (data?.sysRegions?.length > 0) {
            //   data.regionName = data?.sysRegions[0].name;
            // }
            if (data?.sysRegions?.length > 0) {
              data.regionName = '';
              for (let i = 0; i < data.sysRegions.length; i++) {
                data.regionName += data.sysRegions[i].name;
                if (i < data.sysRegions.length - 1) {
                  data.regionName += ' | ';
                }
              }
            }
            getAttachId(data);
          }
        })
        .catch((err) => {
          message.error(err.message || err);
        });
    }
  }, [userId]);

  return (
    <Drawer
      width={1000}
      title={title}
      visible={modalVisible}
      onClose={() => {
        handleModalVisible();
        setBaseInfo({});
      }}
      closable={true}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          {modalVisible && (
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
              <Descriptions.Item label="用户名称">{baseInfo.name}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{baseInfo.idCardCode}</Descriptions.Item>
              <Descriptions.Item label="手机号">{baseInfo.mobilePhone}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {baseInfo.enable === '0' ? '禁用' : baseInfo.enable === '1' ? '启用' : ''}
              </Descriptions.Item>
              <Descriptions.Item label="编码">{baseInfo.code}</Descriptions.Item>
              <Descriptions.Item label="所属角色">{baseInfo.roleName}</Descriptions.Item>
              <Descriptions.Item label="所属组织机构" span={2}>
                {baseInfo.organizationName}
              </Descriptions.Item>
              <Descriptions.Item label="关联数据域" span={2}>
                {baseInfo.regionName}
              </Descriptions.Item>
              <Descriptions.Item label="插入人">{baseInfo.inserterName}</Descriptions.Item>
              <Descriptions.Item label="插入时间">{baseInfo.insertTime}</Descriptions.Item>
              <Descriptions.Item label="更新人">{baseInfo.updaterName}</Descriptions.Item>
              <Descriptions.Item span={2} label="更新时间">
                {baseInfo.updateTime}
              </Descriptions.Item>
              <Descriptions.Item span={2} label="描述">
                {baseInfo.remark}
              </Descriptions.Item>
              <Descriptions.Item label="用户头像" span={2}>
                <Image
                  src={baseInfo.minioFileUrl}
                  width="100px"
                  height={baseInfo?.minioFileUrl ? '100px' : 'auto'}
                />
              </Descriptions.Item>
            </Descriptions>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default UpdateForm;
