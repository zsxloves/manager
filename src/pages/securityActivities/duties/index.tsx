import React, { useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { dutiesQuery, dutiesDelete, moveDuties } from '@/services/duties';
import DetailUnit from './components/DetailUnit';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import { calcPageNo } from '@/utils/utilsJS';
import Addpage from './components/Add';
type TableListItem = {
  name: string;
  id: string;
  arPlanVOS: any;
  planIdsName: string;
  arLayericonlistVOS: any;
  metaIdsName: string;
};
type Itable = {
  location: any;
};
const TableList: React.FC<Itable> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<any>({});
  const [showDeatail, setShowDeatail] = useState<boolean>(false);
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>(props.location?.query?.page);
  const [pageSize, setPageSize] = useState<number>(props.location?.query?.size);
  const [totle, setTotle] = useState<number>();
  const params = { type };
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [edit, setEdit] = useState<any>();
  const [showAdd, setShowAdd] = useState<boolean>(false);

  // 批量删除
  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await dutiesDelete(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        const delPage = calcPageNo(totle, current, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
        setType(!type);
      }
    } catch (error: any) {
      message.error(error.message);
      return;
    }
  };
  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除？',
      onOk: () => {
        handleRemove(ids);
      },
    });
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
      ellipsis: true,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      hideInSearch: false,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '父级任务',
      dataIndex: 'parentName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '任务类型',
      dataIndex: 'typeName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      fixed: 'right',
      render: (_, record) => [
        <a
          title="上移"
          key="up"
          type="link"
          onClick={() => {
            const datas = {
              queryObject: {
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
            moveDuties(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                }
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          title="下移"
          key="down"
          type="link"
          onClick={() => {
            const datas = {
              queryObject: {
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
            moveDuties(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setShowDeatail(true);
            record.planIdsName = '';
            record.metaIdsName = '';
            record?.arPlanVOS.filter((item: any, index: any) => {
              record.planIdsName += item.name;
              if (record?.arPlanVOS?.length > index) {
                record.planIdsName += ' | ';
              }
            });
            record?.arLayericonlistVOS.filter((item: any, index: any) => {
              record.metaIdsName += item.name;
              if (record?.arLayericonlistVOS?.length > index) {
                record.metaIdsName += ' | ';
              }
            });
            setRow(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('dutiesEdit')} key="dutiesEdit">
          <a
            key="edit"
            onClick={() => {
              setEdit(record);
              setShowAdd(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('dutiesDelete')} key="dutiesDelete">
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
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        params={params}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        actionRef={actionRef}
        tableAlertRender={false}
        options={{
          density: false,
          fullScreen: undefined,
          reload: undefined,
          setting: false,
        }}
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
          layout: 'horizontal',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('dutiesAdd')} key="dutiesAdd">
            <Button
              type="primary"
              onClick={() => {
                setEdit('');
                setShowAdd(true);
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('dutiesDelete')} key="dutiesDelete">
            <Button
              style={{ float: 'left' }}
              onClick={() => {
                if (selectedRowKeys.length > 0) {
                  handleRemoveOne(selectedRowKeys);
                } else {
                  message.warning('请至少选择一条数据');
                }
              }}
            >
              批量删除
            </Button>
          </Access>,
        ]}
        request={async (paramss) => {
          const res = await dutiesQuery({
            name: paramss.name,
            type: paramss.typeName,
            pageNumber: paramss.current,
            pageSize: paramss.pageSize,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          setCurrent(paramss.current as number);
          setPageSize(paramss.pageSize as number);
          setTotle(res.data.totalCount);
          return {
            data: res.data.rows,
            success: res.code === 200 ? true : false,
            total: res.data.totalCount,
          };
        }}
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (_) => {
            setSelectedRowKeys(_);
          },
        }}
        columns={columns}
      />
      {showDeatail && (
        <DetailUnit
          onCancel={() => {
            setShowDeatail(false);
          }}
          modalVisible={showDeatail}
          info={row}
          title={'任务详情'}
        />
      )}
      {/* 新增 */}
      {showAdd && (
        <Addpage
          showAdd={true}
          edit={edit}
          change={() => {
            setShowAdd(false);
          }}
          reload={() => {
            actionRef?.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;
