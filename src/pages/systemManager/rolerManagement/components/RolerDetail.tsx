/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Col, Descriptions, Drawer, message, Row, Tabs, Tree } from 'antd';
import { getRolerInfo, getPowerTree, getRolePower } from '@/services/systemManager';
import styles from './index.less';
import { DeploymentUnitOutlined } from '@ant-design/icons';

export interface FormValueType {
  name?: string;
  remark?: string;
  qx?: string;
  code?: string;
  insertTime?: string;
  updaterId?: string;
  updateTime?: string;
  updaterName?: string;
  inserterName?: string;
}
export interface ProjectDepartList {
  value: string;
  label: string;
}

export interface UpdateFormProps {
  showDetail: boolean;
  details: string;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { details, showDetail, onCancel } = props;
  const [baseInfo, setBaseInfo] = useState<FormValueType>({});
  const [powerTree, setPowerTree] = useState<any>([]); //所有权限树
  const [havePower, setHavePower] = useState<any>(); //拥有权限

  const allPower = (roleId: string) => {
    // 查询权限表
    getPowerTree({})
      .then((res) => {
        setPowerTree(res.result.result);
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    //查询角色关联权限
    getRolePower({
      queryObject: {
        page: 0,
        size: 10000,
        roleId,
      },
    })
      .then((res) => {
        const ids = res.result?.page?.content.map((item: any) => {
          return item.powerId;
        });
        setHavePower(ids);
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };

  useEffect(() => {
    if (showDetail) {
      //角色详情
      getRolerInfo({
        id: details,
        page: 0,
        size: 1,
      })
        .then((res) => {
          const info = res.result.detail;
          setBaseInfo(info);
          allPower(info.id);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  return (
    <Drawer
      width={1000}
      title="角色详情"
      visible={showDetail}
      onClose={() => {
        onCancel();
        setHavePower('');
        setBaseInfo({});
      }}
      closable={true}
    >
      {showDetail && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基础信息" key="1">
            {showDetail && (
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
                <Descriptions.Item label="角色名称">{baseInfo.name}</Descriptions.Item>
                <Descriptions.Item label="角色编码">{baseInfo.code}</Descriptions.Item>
                <Descriptions.Item label="插入人">{baseInfo.inserterName}</Descriptions.Item>
                <Descriptions.Item label="插入时间">{baseInfo.insertTime}</Descriptions.Item>
                <Descriptions.Item label="更新人">{baseInfo.updaterName}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{baseInfo.updateTime}</Descriptions.Item>
                <Descriptions.Item span={2} label="备注">
                  {baseInfo.remark}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="拥有权限" key="2">
            {powerTree?.length > 0 && havePower?.length > 0 && (
              <Row>
                <Col offset={2}>
                  <Tree
                    blockNode
                    checkable
                    disabled={true}
                    showLine={{
                      showLeafIcon: false,
                    }}
                    showIcon={true}
                    icon={<DeploymentUnitOutlined />}
                    defaultExpandAll={true}
                    defaultCheckedKeys={havePower}
                    treeData={powerTree}
                  />
                </Col>
              </Row>
            )}
          </Tabs.TabPane>
        </Tabs>
      )}
    </Drawer>
  );
};

export default UpdateForm;
