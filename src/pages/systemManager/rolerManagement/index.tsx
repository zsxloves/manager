import { Button, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getRolerList, batchDeleteRoler, moveRoler } from '@/services/systemManager';
import AddRoler from './components/AddRoler';
import RolerDetail from './components/RolerDetail';
import { calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';
// import styles from './index.less';

type TableListItem = {
  key: number;
  name: string;
  id: string;
  code: string;
  fatherHome: string;
  description: string;
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [rolerVisble, setRolerVisble] = useState<boolean>(false); //更新
  const [rolerType, setRolerType] = useState<string>(); //更新类型
  const [roleId, setRoleId] = useState<string>(); //id
  const [showDetail, setShowDetail] = useState<boolean>(false); //详情展示
  const [details, setDetailsId] = useState<string>(); //详情id
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const access = useAccess();
  const params = { type };

  const loading = () => {
    setType(!type);
  };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        batchDeleteRoler(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
            setType(!type);
            const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
            actionRef.current?.setPageInfo!({ current: delPage, pageSize });
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
      key: 'index',
      hideInSearch: true,
      width: 50,
      render: (_, record, index) => index + 1,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
      width: '50%',
      valueType: 'text',
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
              reqModel: {
                queryObject: {
                  page: current,
                  pageSize: pageSize,
                  isRoot: true,
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
            moveRoler(datas)
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
          key="down"
          onClick={() => {
            const datas = {
              reqModel: {
                queryObject: {
                  page: current,
                  pageSize: pageSize,
                  isRoot: true,
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
            moveRoler(datas)
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
          key="details"
          onClick={() => {
            setShowDetail(true);
            setDetailsId(record.id);
          }}
        >
          详情
        </a>,
        <Access
          accessible={access.btnHasAuthority('rolerManagementEdit')}
          key="rolerManagementEdit"
        >
          <a
            key="config"
            onClick={() => {
              setRoleId(record.id);
              setRolerType('edit');
              setRolerVisble(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('rolerManagementDel')} key="rolerManagementDel">
          <a
            key="subscribeAlert"
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
        form={{ ignoreRules: false }}
        params={params}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
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
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          },
        }}
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        toolBarRender={() => [
          <Access
            accessible={access.btnHasAuthority('rolerManagementAdd')}
            key="rolerManagementAdd"
          >
            <Button
              type="primary"
              onClick={() => {
                setRolerType('add');
                setRolerVisble(true);
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('rolerManagementDel')}
            key="rolerManagementDel"
          >
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
          const res = await getRolerList({
            queryObject: {
              ...paramss,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              isRoot: true,
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
      {rolerVisble && (
        <AddRoler
          roleId={roleId as string}
          rolerVisble={rolerVisble}
          rolerType={rolerType as string}
          loading={loading}
          onhandler={() => {
            setRolerVisble(false);
            setRolerType('');
            setRoleId('');
          }}
        />
      )}
      {/* {showDetail &&( */}
      <RolerDetail
        details={details as string}
        showDetail={showDetail}
        onCancel={() => {
          setShowDetail(false);
          setDetailsId('');
        }}
      />
      {/* )} */}
    </PageContainer>
  );
};

export default TableList;
