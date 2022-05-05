import React, { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Image } from 'antd';
import './index.less';

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
  attachmentId: string;
  minioFileUrl: any;
};

interface IProps {
  dataSource: any[];
  onChange: (value: any) => void;
}

const ETable: React.FC<IProps> = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]); //多选
  // const [selectedRowsState, setSelectedRows] = useState<any[]>([]); //多选存放选择人员
  const [tableList, setTableList] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '图标',
      render: (text, record) => <Image width={40} height={40} src={record.minioFileUrl} />,
      editable: false,
      valueType: 'avatar',
    },
    {
      title: '编号',
      dataIndex: 'code',
      // valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record) => [
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '确定删除？',
              type: 'warning',
              onOk: () => {
                const a = tableList.filter((item) => item.id !== record.id);
                setTableList(a);
                props.onChange(a);
              },
            });
            // setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  useEffect(() => {
    setTableList(props.dataSource);
  }, [props.dataSource]);
  function deleteRows() {
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: '确认删除？',
        type: 'warning',
        onOk: () => {
          let imgs: any = [];
          for (let j = 0; j < selectedRowKeys.length; j++) {
            const a = tableList?.findIndex((item) => {
              return item.minioFileUrl === selectedRowKeys[j];
            });
            const newInfo = tableList.splice(a, 1);
            const news = tableList.filter((item: any) => {
              return item != newInfo;
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            imgs = news;
            setTableList(news);
          }
          setTableList(imgs);
          props.onChange(imgs);
          setSelectedRowKeys([]);
        },
      });
    } else {
      message.warn('请先选择要删除的图标');
    }
  }
  return (
    <ProTable<DataSourceType>
      columns={columns}
      actionRef={actionRef}
      tableAlertRender={false}
      rowSelection={{
        fixed: true,
        selectedRowKeys,
        onChange: (_) => {
          setSelectedRowKeys(_);
        },
      }}
      dataSource={tableList.sort((a, b) => a.code - b.code)}
      // editable={false}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="minioFileUrl"
      search={false}
      options={false}
      pagination={false}
      dateFormatter="string"
      toolBarRender={() => [
        <Button key="button" onClick={deleteRows}>
          批量删除
        </Button>,
      ]}
    />
  );
};
export default ETable;
