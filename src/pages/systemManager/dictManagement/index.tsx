import React, { useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getDictList, moveDict, batchDeleteDict } from '@/services/systemManager';
import DictUpdate from './components/DictUpdate';
import SubItemDict from './components/SubitemDict';
import { calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';

type TableListItem = {
  id: string;
  key?: number;
  name: string;
  code: string;
  remark: string;
  value: string;
  fatherDictz?: string;
};

const DictManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [dictAdd, setDictAdd] = useState<boolean>(false); //字典新增/编辑
  const [dictType, setDictType] = useState<string>('add'); //字典操作类型
  const [dictInfo, setDictInfo] = useState<Record<string, unknown>>(); //字典单个信息
  const [checkDictSub, setCheckDictSub] = useState<boolean>(false); //查看字典子项
  const [dictSubInfo, setDictSubInfo] = useState<Record<string, unknown>>(); //子项当前父id
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const access = useAccess();
  const params = { type };

  // 重新加载table
  const heavyLoad = () => {
    setType(!type);
  };

  /**
   * 删除字典
   *
   * @param ids
   */
  const handleRemove = async (ids: string[]) => {
    if (!ids) return true;
    try {
      const deleteInfo = await batchDeleteDict(ids);
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
      title: '字典名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '字典描述',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
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
            moveDict(datas)
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
            moveDict(datas)
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
            setDictSubInfo(record);
            setCheckDictSub(true);
          }}
        >
          子项
        </a>,
        <Access accessible={access.btnHasAuthority('dictManagementEdit')} key="dictManagementEdit">
          <a
            key="edit"
            onClick={() => {
              setDictAdd(true);
              setDictType('edit');
              setDictInfo(record);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('dictManagementDel')} key="dictManagementDel">
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
          onChange: (Keys) => {
            setSelectedRowKeys(Keys);
          },
        }}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('dictManagementAdd')} key="dictManagementAdd">
            <Button
              type="primary"
              onClick={() => {
                setDictAdd(true);
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('dictManagementDel')} key="dictManagementDel">
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
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        request={async (paramss) => {
          const res = await getDictList({
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
      {dictAdd && (
        <DictUpdate
          dictType={dictType}
          dictAdd={dictAdd}
          cancelModal={() => {
            setDictAdd(false);
            setDictType('add');
          }}
          dictInfo={dictInfo as Record<string, unknown>}
          heavyLoad={heavyLoad}
        />
      )}
      {checkDictSub && (
        <SubItemDict
          dictSubInfo={dictSubInfo as Record<string, unknown>}
          checkDictSub={checkDictSub}
          hideModal={() => {
            setCheckDictSub(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default DictManagement;
