import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Detail from '../../securityActivities/activityManage/detail/detail';
import { getTableData, move, getInfoById, batchDeleteLayer } from '@/services/Layer/index';
import AddLayer from './components/AddLayer';
import { useAccess, Access } from 'umi';
import { calcPageNo } from '@/utils/utilsJS';
import style from '../../securityActivities/activityManage/index.less';

type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};
export function preDelete(parentId: string[]) {
  return getTableData({ page: 0, size: 2 ** 10 }, { parentIdList: parentId });
}

const Layer: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totle, setTotle] = useState<number>();
  const [showAdd, setShow] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [updateType, setUpdateType] = useState<string>();
  const [item, setItem] = useState<any>({});
  const access = useAccess();
  const [type, setType] = useState<boolean>(true);
  const params = { type };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        batchDeleteLayer(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            setSelectedRowKeys([]);
            const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
            actionRef.current?.setPageInfo!({ current: delPage, pageSize });
            setType(!type);
          } else {
            message.warning(res.message);
          }
        });
      },
    });
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
      width: 100,
      search: false,
    },
    {
      title: '图层名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '父级图层',
      dataIndex: 'parentName',
      ellipsis: true,
      search: false,
    },
    {
      title: '图层类型',
      dataIndex: 'layerTypeName',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      render: (text, record) => [
        <ArrowUpOutlined
          className={style['activity-arrow']}
          onClick={() => {
            moveItem(record, true);
          }}
        />,
        <ArrowDownOutlined
          className={style['activity-arrow']}
          onClick={() => {
            moveItem(record, false);
          }}
        />,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            getInfoById(record.id)
              .then((res) => {
                if (res.code === 200) {
                  setItem(res.result.detail);
                  setShowDetail(true);
                } else {
                  message.error(res.message);
                }
              })
              .catch((res) => {
                message.error(res.message);
              });
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('layerEdit')} key="layerEdit">
          <a
            key="editable"
            onClick={() => {
              getInfoById(record.id).then((res) => {
                if (res.code === 200) {
                  setItem(res.result.detail);
                  setUpdateType('edit');
                  setShow(true);
                } else {
                  message.error(res.message);
                }
              });
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('layerDel')} key="layerDel">
          <a
            target="_blank"
            rel="noopener noreferrer"
            key="view"
            onClick={() => {
              preDelete([record.id])
                .then((res) => {
                  if (!res.result.page.content) {
                    handleRemoveOne([record.id]);
                  } else {
                    message.error('该图层下存在子项不能删除');
                  }
                })
                .catch((res) => {
                  message.error(res.message);
                });
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];
  function moveItem(item1: TableListItem, isUp: boolean) {
    move(current, pageSize, item1.id, isUp)
      .then((res) => {
        if (res.code === 200) {
          setType(!type);
        }
      })
      .catch((res) => {
        message.warning(res.message);
      });
  }
  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        params={params}
        columns={columns}
        actionRef={actionRef}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        rowKey="id"
        tableAlertRender={false}
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          },
        }}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (paramss) => {
          const res = await getTableData({
            name: paramss.name,
            page: (paramss.current as number) - 1,
            size: paramss.pageSize as number,
          });
          const data = res.result.page.content;
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(res.result.page.totalElements);
          return {
            data,
            success: res.code === 200 ? true : false,
            total: res.result.page.totalElements,
          };
        }}
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        dateFormatter="string"
        options={false}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('layerAdd')} key="layerAdd">
            <Button
              key="button"
              type="primary"
              onClick={() => {
                setShow(true);
                setUpdateType('add');
                setItem({});
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('layerDel')} key="layerDel">
            <Button
              key="button"
              onClick={() => {
                if (selectedRowKeys.length === 0) {
                  message.warning('请至少选择一条数据');
                  return;
                }
                preDelete(selectedRowKeys)
                  .then((res) => {
                    if (!res.result.page.content) {
                      handleRemoveOne(selectedRowKeys);
                    } else {
                      message.error('该图层下存在子项不能删除');
                    }
                  })
                  .catch((res) => {
                    message.error(res.message);
                  });
              }}
            >
              批量删除
            </Button>
          </Access>,
        ]}
      />
      <Detail
        show={showDetail}
        baseInfo={item}
        json="配置详细json"
        config={[
          { label: '图层名称', index: 'name', span: 2 },
          { label: '父级图层', index: 'parentName' },
          { label: '图层类型', index: 'layerTypeName' },
          { label: '插入人', index: 'inserterName' },
          { label: '插入时间', index: 'insertTime' },
          { label: '更新人', index: 'updaterName' },
          { label: '更新时间', index: 'updateTime' },
          { label: '配置详细json', index: 'entity', span: 2 },
        ]}
        onClose={() => {
          setShowDetail(false);
        }}
        title="图层详情"
      />
      {showAdd && (
        <AddLayer
          show={showAdd}
          onCancel={() => {
            setShow(false);
          }}
          onConfirm={() => {
            setShow(false);
            setItem({});
            setType(!type);
          }}
          item={item}
          updateType={updateType}
        />
      )}
    </PageContainer>
  );
};

export default Layer;
