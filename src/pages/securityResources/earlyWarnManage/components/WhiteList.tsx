import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { getEarlyList, earlyWhile } from '@/services/securityResources';
import styles from './index.less';

export interface BaseConfirmProps {
  cancelModal: () => void;
  // onSubmit: (list?: any) => void;
  selectPersonVisible: boolean;
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
    cancelModal,
    // onSubmit: handleConfirm,
    // onCancel: handleCancel,
    selectPersonVisible,
  } = props;
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [whilteKey, setWhileKey] = useState<any>();
  const [pageSize, setPageSize] = useState<number>();

  const handleEnsure = async () => {
    //删除设备
    if (whilteKey?.length > 0) {
      const d = whilteKey.filter(function (v: any) {
        return selectedRowKeys.indexOf(v) == -1;
      });
      if (d.length > 0) {
        earlyWhile({
          idList: d,
          isInWhiteList: false,
        })
          .then((res) => {
            if (res.code === 200) {
              cancelModal();
              setSelectedRowKeys([]);
            }
          })
          .catch((err) => {
            message.error(err.message);
          });
      }
    }
    if (selectedRowKeys.length > 0) {
      earlyWhile({
        idList: selectedRowKeys,
        isInWhiteList: true,
      })
        .then((res) => {
          if (res.code === 200) {
            cancelModal();
            setSelectedRowKeys([]);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  const wihteList = () => {
    getEarlyList({
      queryObject: {
        size: 99999,
        page: 0,
        isInWhiteList: true,
        sortColumn: 'sortIndex',
        sortOrder: 'desc',
      },
    })
      .then((res: any) => {
        if (res.code === 200) {
          const list: any = [];
          const data = res.result?.page?.content;
          if (data?.length > 0) {
            data.forEach((item: any) => {
              list.push(item.id);
            });
            setSelectedRowKeys(list);
            setWhileKey(list);
          }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    wihteList();
  }, []);
  const renderFooter = () => {
    return (
      <>
        <div style={{ fontSize: '14px', color: '#838383', float: 'left', lineHeight: '32px' }}>
          已选：{selectedRowKeys.length}
        </div>
        <Button
          onClick={() => {
            setSelectedRowKeys([]);
            // handleCancel(false);
            cancelModal();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleEnsure()}>
          保存
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
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '设备编码',
      dataIndex: 'code',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '设备分类',
      dataIndex: 'categoryName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '经度',
      dataIndex: 'lat',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '纬度',
      dataIndex: 'lon',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '高度',
      dataIndex: 'height',
      ellipsis: true,
      hideInSearch: true,
    },
  ];
  return (
    <Modal
      width={1000}
      // bodyStyle={{ padding: '0' }}
      destroyOnClose
      maskClosable={false}
      title="更新白名单"
      className={styles.height440}
      visible={selectPersonVisible}
      footer={renderFooter()}
      onCancel={() => {
        setSelectedRowKeys([]);
        cancelModal();
        // handleCancel(false);
      }}
    >
      <ProTable<TableListItem>
        className={styles.tableStyle}
        form={{ ignoreRules: false }}
        actionRef={actionRef}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
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
        request={async (paramss: any) => {
          // wihteList();
          const res = await getEarlyList({
            queryObject: {
              ...paramss,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              isInWhiteList: null,
              sortColumn: 'sortIndex',
              sortOrder: 'desc',
            },
          });
          if (res.code !== 200) {
            message.error(res.message);
          }
          setPageSize(paramss.pageSize);
          return {
            data: res.result?.page?.content || [],
            total: res.result?.page?.totalElements,
          };
        }}
        onReset={() => {
          actionRef.current?.reset!();
        }}
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
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
          // setSelectedRowKeys([]);
        }}
      />
    </Modal>
  );
};

export default SelectRoler;
