import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getmatchList, deleteSlef, move, getState } from '../../../services/match';
import DetailUnit from './components/DetailUnit';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import Addpage from './components/Add';
import styles from './style.less';
type TableListItem = {
  name: string;
  id: string;
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
  const params = { type };
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [edit, setEdit] = useState<any>();
  const [showAdd, setShowAdd] = useState<boolean>(false);

  // 批量删除
  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await deleteSlef(ids);
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
      title: '是否确认删除？',
      onOk: () => {
        handleRemove(ids);
      },
    });
  };
  const [stateList, setstateList] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
      ellipsis: true,
    },
    {
      title: '赛事名称',
      dataIndex: 'name',
      hideInSearch: false,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '赛事类型',
      dataIndex: 'compTypeName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '赛事类型',
      hideInTable: true,
      dataIndex: 'compType',
      valueType: 'select',
      renderFormItem: () => {
        return <Select showSearch allowClear className={styles.typedd} options={stateList} />;
      },
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
      title: '关联活动',
      dataIndex: 'activityName',
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
            move(datas)
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
            move(datas)
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
        <Access accessible={access.btnHasAuthority('matchEdit')} key="matchEdit">
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
        <Access accessible={access.btnHasAuthority('matchDelete')} key="matchDelete">
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
  useEffect(() => {
    // 获取赛事类型
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: '2b36e222-500e-4839-bfca-71b4d29b4bb4',
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
          <Access accessible={access.btnHasAuthority('matchAdd')} key="matchAdd">
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
          <Access accessible={access.btnHasAuthority('matchDelete')} key="matchDelete">
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
          const res = await getmatchList({
            ...paramss,
            pageNumber: (paramss.current as number) - 1,
            pageSize: paramss.pageSize,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          if (res.code === 200) {
            // message.success(res.message);
          } else {
            message.error(res.message);
          }
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
          title={'赛事详情'}
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
