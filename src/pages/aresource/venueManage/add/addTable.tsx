import { useState, useEffect, useRef } from 'react';
/* eslint-disable react/self-closing-comp */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { getLayerInfo } from '@/services/venue/index';
import styles from './add.less';

interface Props {
  show: boolean;
  selectVList: any;
  ids: string[];
  onCancel: () => void;
  onConfirm: (a: string[], b: any) => void;
}
type TableListItem = {
  id: string | number;
  size: number;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};

function AddTable(props: Props) {
  const { ids, selectVList, show, onCancel, onConfirm } = props;

  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]); //多选
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选人员全部信息
  const [pageSize, setPageSize] = useState<number>();
  //const [filterList, setFilterList] = useState<any>();
  function handleOk() {
    onConfirm(selectedRowKeys, selectedRowsState);
  }
  function handleCancel() {
    onCancel();
  }

  useEffect(() => {
    setSelectedRows(selectVList);
    setSelectedRowKeys(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleOk()}>
          保存
        </Button>
      </>
    );
  };

  return (
    <Modal
      title="图层列表"
      visible={show}
      maskClosable={false}
      onCancel={handleCancel}
      footer={renderFooter()}
      width={900}
    >
      {/* <Row> */}
      <ProTable
        options={false}
        rowKey="id"
        actionRef={actionRef}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableAlertRender={false}
        className={styles.venueTable}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (paramss) => {
          const res = await getLayerInfo({
            queryObject: {
              ...paramss,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
            },
          });
          setPageSize(paramss.pageSize);
          return {
            data: res.result.page.content || [],
            success: res.code === 200 ? true : false,
            total: res?.result?.page?.totalElements,
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
        rowSelection={{
          selectedRowKeys,
          onSelect: (record, selected) => {
            const keyArr: any[] = [record.id];
            if (selected) {
              setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
              setSelectedRows([...new Set(selectedRowsState.concat(record))]);
            } else {
              const keys: string[] = selectedRowKeys.filter((val: string) => {
                return val !== String(record.id);
              });
              const Rows: TableListItem[] = selectedRowsState.filter((val: any) => {
                return val.id !== String(record.id);
              });
              setSelectedRowKeys(keys);
              setSelectedRows(Rows);
            }
          },
          onSelectAll: (selected, rows, changeRows) => {
            if (selected) {
              const pageAllKeys: string[] = rows.map((a: any) => {
                return a?.id;
              });
              const pageAllRows: TableListItem[] = rows.filter((a: any) => {
                if (a !== undefined) {
                  return a;
                }
              });
              setSelectedRowKeys([...new Set(selectedRowKeys.concat(pageAllKeys))]);
              setSelectedRows([...new Set(selectedRowsState.concat(pageAllRows))]);
            } else {
              const pageAllKeys: string[] = changeRows.map((a: any) => {
                return a.id;
              });
              const keys: string[] = selectedRowKeys.filter((val: string) => {
                return !pageAllKeys.includes(val);
              });
              const Rows: TableListItem[] = selectedRowsState.filter((vals: any) => {
                return !pageAllKeys.includes(vals.id);
              });
              setSelectedRowKeys(keys);
              setSelectedRows(Rows);
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
                const Rows: TableListItem[] = selectedRowsState.filter((val: any) => {
                  return val.id !== String(record.id);
                });
                setSelectedRowKeys(keys);
                setSelectedRows(Rows);
              } else {
                setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
                setSelectedRows([...new Set(selectedRowsState.concat(record))]);
              }
            },
          };
        }}
        onSubmit={() => {
          // setSelectedRowKeys([]);
        }}
        dateFormatter="string"
        columns={[
          {
            title: '序号',
            dataIndex: 'index',
            render: (_, record, index) => index + 1,
            width: 50,
            search: false,
          },
          {
            title: '图层名称',
            dataIndex: 'name',
            ellipsis: true,
            width: 100,
          },
        ]}
      ></ProTable>
      {/* </Row> */}
    </Modal>
  );
}

export default AddTable;
