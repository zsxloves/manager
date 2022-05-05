import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Row, Col, Tree } from 'antd';
import { ExclamationCircleOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { setTreeData } from '@/utils/utilsJS';
import { queryByParentId, queryAllRegion, delRegion } from '@/services/dataFileManager';
import AddRegion from './component/add';
import Detail from './component/detail';
import styles from './index.less';
import { useAccess, Access } from 'umi';

const { confirm } = Modal;
const Organization: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [moduleTitle, setModuleTitle] = useState<string>('新增');
  const [rowData, setRowData] = useState<any>(false); //选中行数据
  const [currentNode, setCurrentNode] = useState<any>(); //当前树节点
  const [treeData, setTreeDataFun] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  // 新增派出所
  const addFun = () => {
    if (selectedKey && selectedKey[0]) {
      setAddModalVisible(true);
      setModuleTitle('新增');
      setRowData(false);
    } else {
      message.error('请选择父节点');
    }
  };
  const onSelect = (selectedKeysValue: any, e: any) => {
    // const pos = e.node?.pos?.split('-')
    // console.log("pos：",pos)
    console.log(e.node);
    setCurrentNode(e.node);
    setSelectedKey([e.node.id]);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  // 查询树
  const getTree = () => {
    queryAllRegion({})
      .then((res) => {
        if (res.code === 200) {
          const treeD: any = setTreeData(res.data || []);
          setTreeDataFun(treeD);
          if (!selectedKey[0]) {
            const regionId = treeD[0]?.id || '';
            setCurrentNode(treeD[0]);
            setSelectedKey([regionId]);
            setTimeout(() => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }, 100);
          } else {
            const obj = res.data.filter((item: any) => {
              return item.id === selectedKey[0];
            })[0];
            setCurrentNode({ ...currentNode, ...obj });
          }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const editCurrentRegin = () => {
    setAddModalVisible(true);
    setModuleTitle('编辑');
    setRowData(currentNode);
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      width: 50,
      render: (_, record, index) => index + 1,
    },
    {
      title: '编码',
      dataIndex: 'code',
      ellipsis: true,
      search: false,
    },
    {
      title: '数据域名称',
      dataIndex: 'name',
      ellipsis: true,
      search: false,
    },
    {
      title: '数据域名称',
      dataIndex: 'regionName',
      hideInTable: true,
    },
    {
      title: '备注',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (text, record) => [
        <Access accessible={access.btnHasAuthority('dataFieldEdit')} key="dataFieldEdit1">
          <a
            key="editable"
            onClick={() => {
              setAddModalVisible(true);
              setModuleTitle('编辑');
              setRowData(record);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('dataFieldDelete')} key="dataFieldDelete">
          <a
            key="view"
            onClick={() => {
              confirm({
                title: '删除',
                icon: <ExclamationCircleOutlined />,
                content: '是否确认删除？',
                onOk() {
                  delRegion({
                    regionIdList: [record.id],
                  })
                    .then((res) => {
                      if (res.code === 200) {
                        message.success('删除成功');
                        setSelectedRowKeys([]);
                        if (actionRef.current) {
                          actionRef.current.reload();
                        }
                        getTree();
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
    getTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div className={styles.editCurrent}>
              <Access accessible={access.btnHasAuthority('dataFieldEdit')} key="dataFieldEdit">
                <Button
                  key="button"
                  type="primary"
                  ghost
                  className={styles.curr}
                  onClick={editCurrentRegin}
                >
                  编辑当前数据域
                </Button>
              </Access>
            </div>
            <ProTable<TableListItem>
              scroll={{ x: '100%', y: 'auto' }}
              columns={columns}
              actionRef={actionRef}
              tableAlertRender={false}
              options={false}
              request={async (params: any) => {
                const { data, code } = await queryByParentId({
                  ...params,
                  sortColumn: 'code',
                  sortOrder: 'desc',
                  pageNumber: params.current,
                  regionId: selectedKey[0] || '19b45bbebbc646c2846e71aaf5e4c58f',
                });
                if (code === 0) {
                }
                return {
                  data: data?.list || [],
                  total: Number(data?.total || 0),
                };
              }}
              onReset={() => {}}
              rowKey="id"
              search={{
                labelWidth: 90,
                span: 8,
                collapsed: false,
                collapseRender: () => false,
                optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
              }}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条`,
              }}
              dateFormatter="string"
              toolBarRender={() => [
                <Access accessible={access.btnHasAuthority('dataFieldAdd')} key="dataFieldAdd">
                  <Button key="button" type="primary" onClick={addFun}>
                    新增
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('dataFieldDelete')}
                  key="dataFieldDeleteAll"
                >
                  <Button
                    key="button"
                    onClick={() => {
                      if (selectedRowKeys.length === 0) {
                        message.error('请至少选择一条数据');
                        return;
                      }
                      confirm({
                        title: '批量删除',
                        icon: <ExclamationCircleOutlined />,
                        content: '是否确认删除？',
                        onOk() {
                          delRegion({ regionIdList: selectedRowKeys })
                            .then((res: any) => {
                              if (res.code === 200) {
                                message.success('删除成功');
                                setSelectedRowKeys([]);
                                if (actionRef.current) {
                                  actionRef.current.reload();
                                  getTree();
                                }
                              }
                            })
                            .catch((err: any) => {
                              if (err.message.indexOf('该数据域有引用的人员') !== -1) {
                                message.error('所选据域有引用的人员，无法删除');
                              } else {
                                message.error(err.message);
                              }
                            });
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                      });
                    }}
                    style={{ float: 'left' }}
                  >
                    批量删除
                  </Button>
                </Access>,
              ]}
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => {
                  setSelectedRowKeys(keys);
                },
              }}
            />
          </div>
        </Col>
      </Row>
      {/* 新增、编辑 */}
      {addModalVisible && (
        <AddRegion
          title={moduleTitle}
          rowData={rowData}
          parentId={selectedKey[0]}
          onSubmit={async () => {
            setAddModalVisible(false);
          }}
          onUpdate={() => {
            if (actionRef.current) {
              actionRef.current.reload();
              getTree();
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
    </PageContainer>
  );
};

export default Organization;
