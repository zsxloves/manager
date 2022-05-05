import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getSceneList, sceneSwapIndex, batchDeleteScene } from '@/services/sceneManage';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import UpdateScene from './components/UpdateScene';
import SceneDetail from './components/SceneDetail';
import { useAccess, Access } from 'umi';
import { calcPageNo } from '@/utils/utilsJS';

type TableListItem = {
  id: string;
  key?: number;
  name: string;
  code: string;
  remark: string;
  value: string;
  fatherDictz?: string;
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateType, setUpdateType] = useState<boolean>(false); //更新状态
  const [modalType, setModalType] = useState<string>(); //弹框类型
  const [sceneDetailV, setSceneDetailV] = useState<boolean>(); //详情状态
  const [scenue, setScenue] = useState<Record<string, unknown>>(); //编辑 数据
  const [detailId, setDetailId] = useState<string>();
  const [type, setType] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const access = useAccess();
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const params = { type };

  // 重新加载table
  const heavyLoad = () => {
    setType(!type);
  };

  /**
   * 删除场景
   *
   * @param ids
   */
  const handleRemove = async (ids: string[]) => {
    if (!ids) return true;
    try {
      const deleteInfo = await batchDeleteScene(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
        heavyLoad();
        message.success('删除成功');
      }
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        handleRemove(ids);
      },
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
      title: '场景名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '场景标题',
      dataIndex: 'title',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '场景编码',
      dataIndex: 'code',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '组织机构',
      dataIndex: 'organizationName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'views视域',
      dataIndex: 'views',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '中心点',
      dataIndex: 'centerPosition',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 230,
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      render: (_, record) => [
        <a
          key="up"
          onClick={() => {
            const datas = {
              reqModel: {
                queryObject: {
                  page: current,
                  pageSize: pageSize,
                  ascending: false,
                  propertyName: 'sortIndex',
                },
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: true,
                },
              },
            };
            sceneSwapIndex(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message || err);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          key="down"
          onClick={() => {
            const datas = {
              reqModel: {
                queryObject: {
                  page: current,
                  pageSize: pageSize,
                  ascending: false,
                  propertyName: 'sortIndex',
                },
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: false,
                },
              },
            };
            sceneSwapIndex(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.error(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message || err);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setDetailId(record.id);
            setSceneDetailV(true);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('sceneManageEdit')} key="sceneManageEdit">
          <a
            key="edit"
            onClick={() => {
              setScenue(record);
              setUpdateType(true);
              setModalType('edit');
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('sceneManageDel')} key="sceneManageDel">
          <a
            key="del"
            onClick={() => {
              handleRemoveOne([record.id]);
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];

  return (
    <>
      <PageContainer title={false} breadcrumb={undefined}>
        <ProTable<TableListItem>
          params={params}
          form={{ ignoreRules: false }}
          scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
          tableRender={(_props, dom) => {
            return dom;
          }}
          actionRef={actionRef}
          tableAlertRender={false}
          options={false}
          rowKey="id"
          pagination={{
            responsive: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
          }}
          search={{
            labelWidth: 100,
            span: 5,
            searchText: '查询',
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          rowSelection={{
            onChange: (keys) => {
              setSelectedRowKeys(keys);
            },
          }}
          toolBarRender={() => [
            <Access accessible={access.btnHasAuthority('sceneManageAdd')} key="sceneManageAdd">
              <Button
                type="primary"
                onClick={() => {
                  setUpdateType(true);
                  setModalType('add');
                }}
              >
                新增
              </Button>
            </Access>,
            <Access accessible={access.btnHasAuthority('sceneManageDel')} key="sceneManageDel">
              <Button
                key="button"
                onClick={() => {
                  if (selectedRowKeys.length === 0) {
                    message.warning('请至少选择一条数据');
                    return;
                  }
                  handleRemoveOne(selectedRowKeys);
                }}
              >
                批量删除
              </Button>
            </Access>,
          ]}
          request={async (paramss) => {
            const res = await getSceneList({
              queryObject: {
                ...paramss,
                page: (paramss.current as number) - 1,
                size: paramss.pageSize,
                ascending: false,
                propertyName: 'sortIndex',
              },
            });
            setCurrent((paramss.current as number) - 1);
            setPageSize(paramss.pageSize);
            setTotle(res.result.page.totalElements);
            return {
              data: res.result.page.content,
              success: res.code === 200 ? true : false,
              total: res.result.page.totalElements,
            };
          }}
          columns={columns}
        />
        {updateType && (
          <UpdateScene
            scenue={scenue as Record<string, unknown>}
            modalType={modalType as string}
            updateType={updateType}
            heavyLoads={heavyLoad}
            cancel={() => {
              setUpdateType(false);
              setScenue({});
            }}
          />
        )}
        {/* {sceneDetailV && ( */}
        <SceneDetail
          scenueId={detailId as string}
          sceneDetailV={sceneDetailV as boolean}
          cancelDetail={() => {
            setSceneDetailV(false);
            setDetailId('');
          }}
        />
        {/* )} */}
      </PageContainer>
    </>
  );
};

export default TableList;
