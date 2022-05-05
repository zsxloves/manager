import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Tree, Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { queryOrgTree, deleteOrg } from '@/services/organizationApi';
import Add from './component/add';
import { getAreaTree } from '../../../services/systemManager';
import { setTreeData } from '../../../utils/utilsJS';
import Detail from './component/detail';
import { useAccess, Access } from 'umi';

import styles from './index.less';

const { confirm } = Modal;

let ids: string[] = [];
const Organization: React.FC = () => {
  const [treeData, setTreeDataFun] = useState<any>([]);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [moduleTitle, setModuleTitle] = useState<string>('新增');
  const [rowData, setRowData] = useState<any>(false);
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const access = useAccess();

  // const onSelect = (selectedKeysValue: any) => {
  //   setSelectedKey(selectedKeysValue[0]);
  //   if (actionRef.current) {
  //     actionRef.current.reload();
  //   }
  // };
  const onSelect = (selectedKeysValue: any, e: any) => {
    setSelectedKey([e.node.key]);
    // if (actionRef.current) {
    //   actionRef.current.reload();
    // }
  };
  // 查询树
  const getQueryOrgTree = () => {
    getAreaTree({})
      .then((res) => {
        if (res.code === 200) {
          console.log('tree', setTreeData(res.data || []));
          const treeD = setTreeData(res.data || []);
          if (!selectedKey[0]) {
            console.log(!selectedKey[0], treeD[0].id);
            setSelectedKey([treeD[0].id]);
            setTimeout(() => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }, 100);
          }
          setTreeDataFun(treeD);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  // 新增
  const addFun = () => {
    if (!selectedKey) {
      message.error('请选择所属区域');
      return;
    }
    setAddModalVisible(true);
    setModuleTitle('新增');
    setRowData(false);
  };
  const callbackIds = (data: any) => {
    if (Array.isArray(data)) {
      data.forEach((val) => {
        if (!ids.includes(val.key)) {
          ids.push(val.key);
        }
        if (val.children && val.children.length > 0) {
          callbackIds(val.children);
        }
      });
    } else {
      if (!ids.includes(data.key)) {
        ids.push(data.key);
      }
      if (data.children && data.children.length > 0) {
        callbackIds(data.children);
      }
    }
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '代码',
      dataIndex: 'code',
      tooltip: '派出所代码后面预留两位',
      ellipsis: true,
      render: (text, recard: any) => recard.data.code,
    },
    {
      title: '组织名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (text, recard: any) => recard.data.name,
    },
    // {
    //   title: '组织机构类别',
    //   dataIndex: 'zuzhilb',
    //   search: false,
    //   ellipsis: true,
    //   render: (text, recard: any) => recard.data.zuzhilb,
    // },
    {
      title: '父级组织机构',
      dataIndex: 'parentName',
      search: false,
      ellipsis: true,
      render: (text, recard: any) => recard.data.parentName,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
      render: (text, recard: any) => recard.data.remark,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (text, record: any) => [
        <a
          key="view"
          onClick={() => {
            setDetailModalVisible(true);
            setRowData(record.data);
          }}
        >
          详情
        </a>,

        <Access accessible={access.btnHasAuthority('organizationEdit')} key="organizationEdit">
          <a
            key="editable"
            onClick={() => {
              console.log('recard:', record);
              setAddModalVisible(true);
              setModuleTitle('编辑');
              setRowData(record.data);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('organizationDelete')} key="organizationDelete">
          <a
            key="delete"
            onClick={() => {
              confirm({
                title: '删除',
                icon: <ExclamationCircleOutlined />,
                content: '删除父节点会同时删除父节点下所有子节点，是否确认删除？',
                onOk() {
                  ids = [];
                  callbackIds(record);
                  deleteOrg({ ids })
                    .then((res) => {
                      if (res.code === 200) {
                        message.success('删除成功');
                        setSelectedRows([]);
                        if (actionRef.current) {
                          actionRef.current.reload();
                        }
                      } else {
                        message.error(res.message);
                      }
                    })
                    .catch((err) => {
                      message.error(err.message);
                    });
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];
  useEffect(() => {
    getQueryOrgTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (actionRef.current && selectedKey[0]) {
      actionRef.current.reload();
    }
  }, [selectedKey]);
  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <Row className={styles.overall}>
        <Col span={4} className={styles.colSty}>
          <div className={styles.leftOrganize}>
            {treeData.length > 0 && (
              <Tree
                blockNode
                showLine={{
                  showLeafIcon: false,
                }}
                showIcon={true}
                icon={<DeploymentUnitOutlined />}
                autoExpandParent={true}
                defaultExpandAll={true}
                selectedKeys={selectedKey}
                onSelect={onSelect}
                treeData={treeData}
              />
            )}
          </div>
        </Col>
        <Col span={20} className={styles.colSty}>
          <div className={styles.rightOrganize}>
            <ProTable<TableListItem>
              scroll={{ x: '100%', y: 'auto' }}
              columns={columns}
              actionRef={actionRef}
              tableAlertRender={false}
              options={false}
              request={async (params: any) => {
                if (!selectedKey[0]) {
                  return {
                    data: [],
                  };
                }
                const { data, code } = await queryOrgTree({
                  ...params,
                  page: 0,
                  size: 999,
                  areaId: selectedKey[0],
                });
                if (code === 0) {
                }
                return {
                  data: data || [],
                };
              }}
              onReset={() => {}}
              rowKey="key"
              search={{
                labelWidth: 90,
                span: 8,
                collapsed: false,
                collapseRender: () => false,
                optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
              }}
              pagination={false}
              dateFormatter="string"
              toolBarRender={() => [
                <Access
                  accessible={access.btnHasAuthority('organizationAdd')}
                  key="organizationAdd"
                >
                  <Button key="button" type="primary" onClick={addFun}>
                    新增
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('organizationDelete')}
                  key="organizationDeleteAll"
                >
                  <Button
                    key="button"
                    onClick={() => {
                      if (selectedRows.length === 0) {
                        message.error('请至少选择一条数据');
                        return;
                      }
                      confirm({
                        title: '批量删除',
                        icon: <ExclamationCircleOutlined />,
                        content: '删除父节点会同时删除父节点下所有子节点，是否确认删除？',
                        onOk() {
                          ids = [];
                          callbackIds(selectedRows);
                          deleteOrg({ ids })
                            .then((res) => {
                              if (res.code === 200) {
                                message.success('删除成功');
                                setSelectedRows([]);
                                if (actionRef.current) {
                                  actionRef.current.reload();
                                }
                              } else {
                                message.error(res.message);
                              }
                            })
                            .catch((err) => {
                              message.error(err.message);
                            });
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                      });
                    }}
                  >
                    批量删除
                  </Button>
                </Access>,
              ]}
              rowSelection={{
                selectedRowKeys: selectedRows.map((item: any) => {
                  return item.key;
                }),
                onChange: (keys, item) => {
                  console.log('leys:', keys, item);
                  setSelectedRows(item);
                },
              }}
            />
          </div>
        </Col>
        {addModalVisible && (
          <Add
            title={moduleTitle}
            areaId={selectedKey[0]}
            formData={rowData}
            onSubmit={async () => {
              setAddModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
            onCancel={() => {
              setAddModalVisible(false);
            }}
            addModalVisible={addModalVisible}
          />
        )}
        {/* 详情 */}
        {detailModalVisible && (
          <Detail
            onCancel={() => {
              setDetailModalVisible(false);
            }}
            detailModalVisible={detailModalVisible}
            id={rowData.id}
          />
        )}
      </Row>
    </PageContainer>
  );
};

export default Organization;
