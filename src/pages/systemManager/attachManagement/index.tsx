import React, { useState, useRef, useEffect } from 'react';
import { Button, Col, message, Modal, Row, Tree } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import {
  getAttachmentTree,
  getAttachmentTreeDelete,
  getAttachmentDelete,
} from '@/services/systemManager';
import { getToken } from '@/utils/auth';
import { ArrowDownOutlined, ArrowUpOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { getAttachmentList, moveAttach } from '@/services/systemManager';
import { calcPageNo } from '@/utils/utilsJS';
import UpdateAttach from './components/UpdateAttach';
import UpdateAttachTree from './components/UpdateAttachTree';
import Detail from './components/Detail';
import { useAccess, Access } from 'umi';
import styles from './index.less';

type TableListItem = {
  name: string;
  code: string;
  id?: string;
  remark: string;
  bt: string;
};
type TreeDatas = {
  key: string;
  code: string;
  id: string;
  title: string;
  parentId: string;
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // eslint-disable-next-line @typescript-eslint/type-annotation-spacing
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(); //树节点
  const [treeId, setTreeId] = useState<string>(); //树节点id
  const [treeDetail, setTreeDetail] = useState<Record<string, unknown>>({}); //树节点详情
  const [attachTree, setAttachTree] = useState<TreeDatas[]>([]); //整个树
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRowsState, setSelectedRows] = useState<any>(); //多选
  const [showbg, setTc] = useState<boolean>(false); //更新附件树
  const [attachTreeType, setAttachTreeType] = useState<string>(); //更新附件状态
  const [updateVisble, setUpdateVisble] = useState<boolean>(false); //新增-编辑弹框
  const [detailVs, setDetailVs] = useState<boolean>(false);
  const [detailIn, setDetailIn] = useState<any>(); //详情所有信息
  const [downLoadInfo, setDownLoadInfo] = useState<any>(); //下载数据
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const access = useAccess();
  const params = { type };

  //表格重载
  const heavyLoad = () => {
    setType(!type);
  };
  //获取左侧树
  const getAllTree = (data?: any) => {
    if (attachTreeType === 'edit') {
      setTreeDetail(data);
    }
    getAttachmentTree({})
      .then((res) => {
        setAttachTree(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };

  const exportFile = (url: any, param: any, name: any) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken(),
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.blob())
      .then((data) => {
        const href = window.URL.createObjectURL(data);
        download(href, name);
      });
  };
  //下载
  const downLoads = (data: any) => {
    if (data != undefined && data?.length > 0) {
      for (let i = 0; i < data?.length; i++) {
        exportFile(
          '/api/systemAttachment/downloadFile',
          { id: data[i].id },
          data[i].name + data[i].extension,
        );
      }
    } else {
      message.warning('请选择下载文件！');
    }
  };

  const handleRemove = async (ids: any) => {
    if (!ids) return true;
    try {
      const deleteInfo = await getAttachmentTreeDelete(ids);

      if (deleteInfo.code === 200) {
        getAttachmentTree({})
          .then((res) => {
            message.success('删除成功！');
            setAttachTree(res.data);
            setTreeDetail(res.data[0].data);
            setTreeId(res.data[0].data.id);
            setSelectedRows([]);
            heavyLoad();
          })
          .catch((err) => {
            message.error(err.message);
          });
      }
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  };

  const handleRemoveOne = async (id: any) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        handleRemove(id);
      },
    });
  };
  const handleListRemove = async (ids: any) => {
    if (!ids) return true;
    try {
      const deleteInfo = await getAttachmentDelete(ids);
      if (deleteInfo.code === 200) {
        message.success('删除成功！');
        getAllTree();
        setSelectedRows([]);
        heavyLoad();
        const delPage = calcPageNo(totle, current, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
      }
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  };

  const handleRemoveList = async (id: any) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        handleListRemove(id);
      },
    });
  };

  useEffect(() => {
    getAttachmentTree({})
      .then((res) => {
        setAttachTree(res.data);
        setTreeDetail(res.data[0].data);
        setTreeId(res.data[0].data.id);
        heavyLoad();
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);

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
      title: '附件名称',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 260,
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      render: (_, record) => [
        <a
          key="up"
          onClick={() => {
            const datas = {
              queryObject: {
                parentId: treeId,
                pageNumber: current,
                pageSize: pageSize,
                sortColumn: 'sortIndex',
                sortOrder: 'desc',
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: true,
                },
              },
            };
            moveAttach(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          key="low"
          onClick={() => {
            const datas = {
              queryObject: {
                parentId: treeId,
                pageNumber: current,
                pageSize: pageSize,
                sortColumn: 'sortIndex',
                sortOrder: 'desc',
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: false,
                },
              },
            };
            moveAttach(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setDetailIn(record);
            setDetailVs(true);
          }}
        >
          详情
        </a>,
        <Access
          accessible={access.btnHasAuthority('attachManagementDel')}
          key="attachManagementDel"
        >
          <a
            key="del"
            onClick={() => {
              const id = record.id;
              handleRemoveList([id]);
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];

  //点击单个节点
  const onSelect = (selectedKeysValue: React.Key[], a: any) => {
    if (selectedKeysValue[0]) {
      setSelectedKeys(selectedKeysValue);
      setTreeId(selectedKeysValue[0] as string);
      heavyLoad();
    }
    setTreeDetail(a.node.data);
  };
  //弹框取消
  const cancelModal = () => {
    setUpdateVisble(false);
    // setUpdate('');
  };

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <Row className={styles.overall}>
        <Col span={4} className={styles.colSty}>
          <div className={styles.leftOrganize}>
            {attachTree.length > 0 && (
              <Tree
                blockNode
                showLine={{
                  showLeafIcon: false,
                }}
                showIcon={true}
                icon={<DeploymentUnitOutlined />}
                autoExpandParent={true}
                defaultExpandAll={true}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={attachTree}
              />
            )}
          </div>
        </Col>
        <Col span={20} className={styles.colSty}>
          <div className={styles.rightOrganize}>
            <Row className={styles.poRight}>
              <Col>
                <Access
                  accessible={access.btnHasAuthority('attachManagementDelTree')}
                  key="attachManagementDelTree"
                >
                  <Button
                    key="buttono"
                    type="primary"
                    ghost
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      if (treeId) {
                        handleRemoveOne(treeId as string);
                      } else {
                        message.warning('请选择树节点');
                      }
                    }}
                  >
                    删除
                  </Button>
                </Access>
                <Access
                  accessible={access.btnHasAuthority('attachManagementEditTree')}
                  key="attachManagementEditTree"
                >
                  <Button
                    key="buttont"
                    type="primary"
                    ghost
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      setTc(true);
                      setAttachTreeType('edit');
                    }}
                  >
                    编辑附件树
                  </Button>
                </Access>
                <Access
                  accessible={access.btnHasAuthority('attachManagementAddTree')}
                  key="attachManagementAddTree"
                >
                  <Button
                    key="buttons"
                    type="primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      setTc(true);
                      setAttachTreeType('add');
                    }}
                  >
                    新增附件树
                  </Button>
                </Access>
              </Col>
            </Row>
            <ProTable<TableListItem>
              params={params}
              form={{ ignoreRules: false }}
              scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
              className={styles.tables}
              columns={columns}
              actionRef={actionRef}
              rowSelection={{
                onChange: (selectId, info) => {
                  setSelectedRows(selectId);
                  setDownLoadInfo(info);
                },
              }}
              tableAlertRender={false}
              options={false}
              search={{
                labelWidth: 100,
                span: 5,
                searchText: '查询',
                optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
              }}
              request={async (paramss) => {
                const data = await getAttachmentList({
                  name: paramss.name,
                  pageNumber: paramss.current,
                  pageSize: paramss.pageSize,
                  parentId: treeId || '4aaabef7-daa7-463e-abab-450f436d6be3',
                  sortColumn: 'sortIndex',
                  sortOrder: 'desc',
                });
                setCurrent(paramss.current);
                setPageSize(paramss.pageSize);
                setTotle(data.data.totalCount);
                return {
                  data: data.data.rows,
                  success: data.success,
                  total: data.data.totalCount,
                };
              }}
              rowKey="id"
              pagination={{
                pageSize: 10,
              }}
              dateFormatter="string"
              toolBarRender={() => [
                <Access
                  accessible={access.btnHasAuthority('attachManagementDownLoad')}
                  key="attachManagementDownLoad"
                >
                  <Button
                    key="sex"
                    onClick={() => {
                      downLoads(downLoadInfo);
                      // setVisibleClass(true);
                    }}
                  >
                    下载
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('attachManagementAdd')}
                  key="attachManagementAdd"
                >
                  <Button
                    key="buttonf"
                    onClick={() => {
                      setUpdateVisble(true);
                    }}
                  >
                    上传
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('attachManagementDel')}
                  key="attachManagementDel"
                >
                  <Button
                    key="button"
                    onClick={() => {
                      if (selectedRowsState.length === 0) {
                        message.warning('请至少选择一条数据');
                        return;
                      }
                      handleRemoveList(selectedRowsState);
                    }}
                  >
                    批量删除
                  </Button>
                </Access>,
              ]}
            />
          </div>
        </Col>
      </Row>
      {showbg && (
        <UpdateAttachTree
          showbg={showbg}
          treeId={treeId as string}
          attachTreeType={attachTreeType as string}
          treeDetail={treeDetail as Record<string, unknown>}
          getAllTree={getAllTree}
          onCancel={() => {
            setTc(false);
            setAttachTreeType('');
          }}
        />
      )}
      {updateVisble && (
        <UpdateAttach
          updateVisble={updateVisble}
          treeId={treeId as string}
          // update={update}
          cancelModal={cancelModal}
          heavyLoad={heavyLoad}
        />
      )}
      {
        <Detail
          detailVs={detailVs}
          detailIn={detailIn}
          onCancel={() => {
            setDetailVs(false);
            setDetailIn(null);
          }}
        />
      }
    </PageContainer>
  );
};

export default TableList;
