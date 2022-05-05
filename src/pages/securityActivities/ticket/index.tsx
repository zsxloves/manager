import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getTicketList, getTicketDelect, getTicketSwapIndex } from '@/services/ticket';
import { getState } from '@/services/match';
import DetailTicket from './components/DetailTicket';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import { calcPageNo } from '@/utils/utilsJS';
import Addpage from './components/Add';
import styles from './index.less';

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
const TicketTableList: React.FC<Itable> = (props) => {
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
  const [stateList, setstateList] = useState<
    {
      value: string;
      label: string;
    }[]
  >();

  useEffect(() => {
    // 获取上报区域
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: '2de698d1-1882-47c6-8cf4-7705bed9d85f',
    };
    getState({ queryObject }).then((res) => {
      const data = res.result.page.content;
      const de =
        data &&
        data.map((item: Record<string, unknown>) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      setstateList(de);
    });
  }, []);
  // 批量删除
  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await getTicketDelect(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
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
      title: '上报区域',
      dataIndex: 'reportAreaName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '上报区域',
      hideInTable: true,
      dataIndex: 'reportArea',
      valueType: 'select',
      renderFormItem: () => {
        return <Select allowClear className={styles.typedd} options={stateList} showSearch />;
      },
    },
    {
      title: '上报时间',
      dataIndex: 'reportTime',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '已售门票',
      dataIndex: 'num',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '入园人数',
      dataIndex: 'addNum',
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
              reqModel: {
                queryObject: {
                  pageNumber: current,
                  pageSize: pageSize,
                  sortColumn: 'sortIndex',
                  sortOrder: 'desc',
                },
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: true,
                },
              },
            };
            getTicketSwapIndex(datas)
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
                  pageNumber: current,
                  pageSize: pageSize,
                  sortColumn: 'sortIndex',
                  sortOrder: 'desc',
                },
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: false,
                },
              },
            };
            getTicketSwapIndex(datas)
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
            setRow(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('ticketEdit')} key="ticketEdit">
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
        <Access accessible={access.btnHasAuthority('ticketDelete')} key="ticketDelete">
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
        className={styles.tablePro}
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
          <Access accessible={access.btnHasAuthority('ticketAdd')} key="ticketAdd">
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
          <Access accessible={access.btnHasAuthority('ticketDelete')} key="ticketDelete">
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
          const res = await getTicketList({
            queryObject: {
              reportArea: paramss?.reportArea,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
            },
            // sortColumn: 'sortIndex',
            // sortOrder: 'desc',
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(res.result.page.totalElements);
          return {
            data: res.result.page?.content,
            success: res.code === 200 ? true : false,
            total: res.result.page?.totalElements,
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
        <DetailTicket
          onCancel={() => {
            setShowDeatail(false);
          }}
          modalVisible={showDeatail}
          info={row}
          title={'票务详情'}
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

export default TicketTableList;
