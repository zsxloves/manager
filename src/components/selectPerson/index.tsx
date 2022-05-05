import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getUserList } from '@/services/systemManager';
import './index.less';

export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (list?: any) => void;
  selectPersonVisible: boolean;
  selectKeys?: string[];
}
export interface TableListItem {
  id?: string;
  name?: string;
  personName?: string;
  customerName?: string;
  type?: string;
}

const SelectRoler: React.FC<BaseConfirmProps> = (props) => {
  const {
    onSubmit: handleConfirm,
    onCancel: handleCancel,
    selectPersonVisible,
    selectKeys,
  } = props;
  const [tableList, setTableList] = useState<TableListItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const handleEnsure = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条数据');
      return;
    }
    const list: any = [];
    tableList.forEach((item: any) => {
      if (selectedRowKeys.includes(item.id)) {
        list.push(item);
      }
    });
    handleConfirm(list);
    setSelectedRowKeys([]);
  };
  const renderFooter = () => {
    return (
      <>
        <div style={{ fontSize: '14px', color: '#838383', float: 'left', lineHeight: '32px' }}>
          已选：{selectedRowKeys.length}
        </div>
        <Button
          onClick={() => {
            setSelectedRowKeys([]);
            handleCancel(false);
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleEnsure()}>
          确定
        </Button>
      </>
    );
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
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      fieldProps: {
        autoComplete: 'off',
      },
    },
    // {
    //   title: '编码',
    //   dataIndex: 'code',
    //   hideInSearch: true,
    //   valueType: 'text',
    // },
    {
      title: '联系方式',
      dataIndex: 'mobilePhone',
      hideInSearch: true,
      ellipsis: true,
      valueType: 'text',
    },
  ];
  useEffect(() => {
    getUserList({
      queryObject: {
        size: 999,
        page: 0,
        enable: '1',
      },
    }).then((res: any) => {
      if (res.code === 200) {
        setTableList(res.result?.page?.content || []);
      }
    });
  }, []);
  useEffect(() => {
    if (selectPersonVisible) {
      setSelectedRowKeys(selectKeys || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectPersonVisible]);
  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '0' }}
      destroyOnClose
      maskClosable={false}
      title="选择人员"
      className="height440"
      visible={selectPersonVisible}
      footer={renderFooter()}
      onCancel={() => {
        setSelectedRowKeys([]);
        handleCancel(false);
      }}
    >
      <ProTable<TableListItem>
        scroll={{ x: '100%', y: 400 }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        options={false}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (params: any) => {
          console.log(params);
          const res = await getUserList({
            queryObject: {
              ...params,
              enable: '1',
              page: params.current - 1,
              size: params.pageSize,
            },
          });
          if (res.code !== 200) {
            message.error(res.message);
          }
          return {
            data: res.result?.page?.content || [],
            total: res.result?.page?.totalElements,
          };
        }}
        search={{
          labelWidth: 100,
          span: 10,
          collapsed: false,
          collapseRender: () => false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onSelect: (record, selected) => {
            const keyArr: any[] = [record.id];
            if (selected) {
              setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
            } else {
              const keys: string[] = selectedRowKeys.filter((val: string) => {
                return val !== String(record.id);
              });
              setSelectedRowKeys(keys);
            }
          },
          onSelectAll: (selected, rows, changeRows) => {
            // console.log(rows)
            if (selected) {
              const pageAllKeys: string[] = rows.map((a: any) => {
                return a?.id;
              });
              setSelectedRowKeys([...new Set(selectedRowKeys.concat(pageAllKeys))]);
            } else {
              const pageAllKeys: string[] = changeRows.map((a: any) => {
                return a.id;
              });
              const keys: string[] = selectedRowKeys.filter((val: string) => {
                return !pageAllKeys.includes(val);
              });
              setSelectedRowKeys(keys);
            }
          },
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              const keyArr: any[] = [record.id];
              if (selectedRowKeys.includes(record.id)) {
                const keys: string[] = selectedRowKeys.filter((val: string) => {
                  return val !== record.id;
                });
                setSelectedRowKeys(keys);
              } else {
                setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
              }
            },
          };
        }}
        onSubmit={() => {
          setSelectedRowKeys([]);
        }}
        onReset={() => {
          setSelectedRowKeys([]);
        }}
      />
    </Modal>
  );
};

export default SelectRoler;
