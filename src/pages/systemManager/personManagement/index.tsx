import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { Button, message, Modal, Switch } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getUserList, moveUser, editUserInfo, batchDeletePerson } from '@/services/systemManager';
import DetailPerson from './components/DetailPerson';
import { calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';
type Itable = {
  location: any;
};
type TableListItem = {
  key?: number;
  name: string;
  code: string;
  id: string;
  idCardCode?: string;
  mobilePhone: string;
  enable?: string;
  remark: string;
  isDeleted: boolean;
  insertTime: string;
  sortIndex: string;
  password: string;
  avatarId: string;
  version: number;
};

const TableList: React.FC<Itable> = (props) => {
  const actionRef = useRef<ActionType>();
  const [rowId, setRowId] = useState<string>('');
  const [showDeatail, setShowDeatail] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [selectedRows, setSelectedRows] = useState<any>([]); //数据
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>(parseInt(props.location?.query?.page));
  const [pageSize, setPageSize] = useState<number>(parseInt(props.location?.query?.size));
  const [totle, setTotle] = useState<number>();
  const params = { type };
  const access = useAccess();

  useEffect(() => {
    if (props.location?.query?.page) {
      actionRef.current?.setPageInfo!({ current: parseInt(props.location?.query?.page), pageSize });
    }
  }, []);

  const handleRemove = async (ids: string[]) => {
    if (!ids) return true;
    try {
      const deleteInfo = await batchDeletePerson(ids);
      if (deleteInfo.code === 200) {
        message.success('删除成功！');
        setSelectedRowKeys([]);
        const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
        setType(!type);
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
      title: '用户名称',
      key: 'name',
      dataIndex: 'name',
      valueType: 'text',
      width: '100px',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '身份证号',
      key: 'idCardCode',
      dataIndex: 'idCardCode',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '联系方式',
      key: 'mobilePhone',
      dataIndex: 'mobilePhone',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '关联数据域',
      key: 'regionName',
      dataIndex: 'regionName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '所属角色',
      key: 'rolerName',
      dataIndex: 'rolerName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '所属组织机构',
      key: 'organizationName',
      dataIndex: 'organizationName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '状态',
      key: 'enable',
      dataIndex: 'enable',
      hideInSearch: true,
      render: (_, record) => [
        <Switch
          checkedChildren="启动"
          unCheckedChildren="禁用"
          defaultChecked={record.enable == '0' ? false : true}
          onClick={(checked) => {
            const data = { ...record, enable: checked ? '1' : '0' };
            editUserInfo({ data }).then((res) => {
              if (res.code === 200) {
                setType(!type);
                setSelectedRowKeys([]);
              } else {
                message.error(res.message);
              }
            });
          }}
        />,
      ],
    },
    {
      title: '操作',
      key: 'option',
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
            moveUser(datas)
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
            moveUser(datas)
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
            setShowDeatail(true);
            setRowId(record.id);
          }}
        >
          详情
        </a>,
        <Access
          accessible={access.btnHasAuthority('personManagementEdit')}
          key="personManagementEdit"
        >
          <a
            key="edit"
            onClick={() => {
              history.push(
                `/systemManager/personManagement/editPerson?userId=${record.id}&page=${current}&size=${pageSize}`,
              );
            }}
          >
            编辑
          </a>
        </Access>,
        <Access
          accessible={access.btnHasAuthority('personManagementDel')}
          key="personManagementDel"
        >
          <a
            key="del"
            onClick={() => {
              if (record.enable === '0') {
                handleRemoveOne([record.id]);
              } else {
                message.warning('状态为启用的用户不可删除！');
              }
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
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (Keys, data) => {
            setSelectedRowKeys(Keys);
            setSelectedRows(data);
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
            accessible={access.btnHasAuthority('personManagementAdd')}
            key="personManagementAdd"
          >
            <Button
              type="primary"
              onClick={() => {
                history.push(
                  `/systemManager/personManagement/addPerson?page=${current}&size=${pageSize}`,
                );
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('personManagementDel')}
            key="personManagementDel"
          >
            <Button
              key="button"
              onClick={() => {
                if (selectedRowKeys.length === 0) {
                  message.warning('请至少选择一条数据');
                  return;
                }
                for (let i = 0; i < selectedRows.length; i++) {
                  if (selectedRows[i].enable === '1') {
                    message.warning(`${selectedRows[i].name}状态为启用,不可删除！`);
                    return;
                  }
                }
                handleRemoveOne(selectedRowKeys);
              }}
            >
              批量删除
            </Button>
          </Access>,
        ]}
        request={async (paramss) => {
          const res = await getUserList({
            queryObject: {
              name: paramss.name,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              isRoot: true,
              ascending: false,
              propertyName: 'sortIndex',
            },
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(res?.result?.page?.totalElements);
          const data = res?.result?.page?.content;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          data &&
            data.map((item: any) => {
              item.rolerName = item.role.name;
              item.key = item.id;
              if (item?.sysRegions?.length > 0) {
                item.regionName = item?.sysRegions[0].name;
              }
            });
          return {
            data: data,
            success: res.code === 200 ? true : false,
            total: res?.result?.page?.totalElements,
          };
        }}
        columns={columns}
      />
      <DetailPerson
        onCancel={() => {
          setShowDeatail(false);
          setRowId('');
        }}
        modalVisible={showDeatail}
        userId={rowId}
        title={'用户详情'}
      />
    </PageContainer>
  );
};

export default TableList;
