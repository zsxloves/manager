import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Row, Col, Tree } from 'antd';
import {
  ExclamationCircleOutlined,
  // ArrowDownOutlined,
  // ArrowUpOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { powerPage, powerDelete, powerBatchDelete, powerTree } from '@/services/authorityManager';
import Add from './component/add';
import Detail from './component/detail';
import styles from './index.less';
import { useAccess, Access } from 'umi';

// import {setTreeData} from '@/utils/utilsJS'

const { confirm } = Modal;
const Organization: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [moduleTitle, setModuleTitle] = useState<string>('新增');
  const [rowData, setRowData] = useState<any>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string[]>(['0']);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 表格选中行

  const [currentNode, setCurrentNode] = useState<any>();
  const actionRef = useRef<ActionType>();
  const access = useAccess();

  // 新增
  const addFun = () => {
    if (!currentNode) {
      message.error('请选择父级权限');
    }
    if (currentNode?.type === 'fun') {
      message.error('按钮类型无法作为父级权限');
    }
    setAddModalVisible(true);
    setModuleTitle('新增');
    setRowData(false);
  };
  const onSelect = (selectedKeysValue: any, e: any) => {
    if (e.node?.data?.type === 'fun') {
      return;
    }
    setCurrentNode(e.node);
    setSelectedKey([e.node.key]);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  // 查询树
  const getTree = () => {
    powerTree({})
      .then((res) => {
        if (res.code === 200) {
          const tree = [
            {
              key: '0',
              title: '系统权限',
              type: 'menu',
              children: res.result?.result || [],
            },
          ];
          if (!currentNode) {
            setCurrentNode(tree[0]);
          }
          setTreeData(tree);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
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
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '父级权限',
      dataIndex: 'parentName',
      ellipsis: true,
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 140,
      render: (text, record) => [
        <a
          key="view"
          onClick={() => {
            setDetailModalVisible(true);
            setRowData(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('authorityEdit')} key="authorityEdit">
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
        <Access accessible={access.btnHasAuthority('authorityDelete')} key="authorityDelete">
          <a
            key="view"
            onClick={() => {
              confirm({
                title: '删除',
                icon: <ExclamationCircleOutlined />,
                content: '是否确认删除？',
                onOk() {
                  powerDelete({
                    id: record.id,
                  })
                    .then((res) => {
                      if (res.code === 200) {
                        message.success('删除成功');
                        setSelectedRowKeys([]);
                        if (actionRef.current) {
                          actionRef.current.reload();
                          getTree();
                        }
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
            <ProTable<TableListItem>
              scroll={{ x: '100%', y: 'auto' }}
              columns={columns}
              actionRef={actionRef}
              tableAlertRender={false}
              options={false}
              request={async (params: any) => {
                const { result, code } = await powerPage({
                  queryObject: {
                    ...params,
                    page: params.current - 1,
                    size: params.pageSize,
                    parentId: selectedKey[0] === '0' ? null : selectedKey[0],
                  },
                });
                if (code === 200) {
                }
                return {
                  data: result.page?.content || [],
                  total: Number(result.page?.totalElements || 0),
                };
              }}
              onReset={() => {}}
              rowKey="id"
              search={{
                labelWidth: 60,
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
                <Access accessible={access.btnHasAuthority('authorityAdd')} key="authorityAdd">
                  <Button key="button" type="primary" onClick={addFun}>
                    新增
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('authorityDelete')}
                  key="authorityDeleteAll"
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
                          powerBatchDelete(selectedRowKeys)
                            .then((res) => {
                              if (res.code === 200) {
                                message.success('删除成功');
                                setSelectedRowKeys([]);
                                if (actionRef.current) {
                                  actionRef.current.reload();
                                  getTree();
                                }
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
                    style={{ float: 'left' }}
                  >
                    批量删除
                  </Button>
                </Access>,
              ]}
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => {
                  console.log('leys:', keys);
                  setSelectedRowKeys(keys);
                },
              }}
            />
          </div>
        </Col>
      </Row>
      {/* 新增、编辑 */}
      {addModalVisible && (
        <Add
          title={moduleTitle}
          formData={rowData}
          parentId={selectedKey[0]}
          onSubmit={async () => {
            setAddModalVisible(false);
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
