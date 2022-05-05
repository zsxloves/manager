import React, { useState, useRef } from 'react';
// import { history } from 'umi';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getDutyList, deleteDuty, moveDuty } from '../../../services/duty';
import DetailUnit from './components/Detail';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import Addpage from './components/Add';
type TableListItem = {
  name: string;
  code: string;
  remark: string;
  corporation: string;
  contactNo: string;
  organizationId: string;
  id: string;
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<any>();
  const [showDeatail, setShowDeatail] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [editid, setEditid] = useState<string>();

  const params = { type };
  const access = useAccess();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选

  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await deleteDuty(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        setType(!type);
      }
    } catch (error: any) {
      message.error(error.message);
      return;
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
      valueType: 'index',
      width: 80,
    },
    {
      title: '值班名称',
      dataIndex: 'name',
      width: '100px',
      hideInSearch: false,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '所属活动',
      dataIndex: 'actName',
      hideInSearch: true,
      width: '100px',
      ellipsis: true,
    },
    {
      title: '职务',
      dataIndex: 'job',
      hideInSearch: true,
      width: '200px',
      ellipsis: true,
    },
    {
      title: '所属部门',
      dataIndex: 'dept',
      hideInSearch: true,
      width: '300px',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'num',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record: any) => record.num,
    },
    {
      title: '起始时间',
      dataIndex: 'startTime',
      ellipsis: true,
      hideInSearch: true,
      width: '200px',
      render: (_, record: any) => record.startTime?.split(' ')[0],
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      ellipsis: true,
      hideInSearch: true,
      width: '200px',
      render: (_, record: any) => record.endTime?.split(' ')[0],
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
            moveDuty(datas)
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
            moveDuty(datas)
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
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setShowDeatail(true);
            setRow(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('dutyEdit')} key="dutyEdit">
          <a
            key="edit"
            onClick={() => {
              setEditid(record.id);
              setShowAdd(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('dutyDelete')} key="dutyDelete">
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
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        params={params}
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
          <Access accessible={access.btnHasAuthority('dutyAdd')} key="dutyAdd">
            <Button
              type="primary"
              onClick={() => {
                setEditid('');
                setShowAdd(true);
                // history.push('/securityActivities/duty/components/Add');
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('dutyDelete')} key="dutyDelete">
            <Button
              style={{ float: 'left' }}
              onClick={() => {
                if (selectedRowKeys.length > 0) {
                  handleRemoveOne(selectedRowKeys);
                } else {
                  message.error('请至少选择一条数据');
                }
              }}
            >
              批量删除
            </Button>
          </Access>,
        ]}
        request={async (paramss) => {
          const res = await getDutyList({
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
          if (res.code === 200) {
          } else {
            message.error(res.message);
          }
          return {
            data: res.result.page.content,
            success: res.code === 200 ? true : false,
            total: res.result.page.totalElements,
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
          userInfo={row}
          title={'值班详情'}
        />
      )}
      {showAdd && (
        <Addpage
          showAdd={true}
          editId={editid}
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
