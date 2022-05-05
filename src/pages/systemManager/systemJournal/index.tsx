import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ExportJsonExcel from 'js-export-excel';
import { getLogData } from '@/services/systemManager';
import { PageContainer } from '@ant-design/pro-layout';
import { useAccess, Access } from 'umi';
import styles from './index.less';

export type TableListItem = {
  name: string;
  code: string;
  inserterName: string;
  insertTime: string;
  operateType: string;
  ip: string;
  remark: string;
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
    title: '日志名称',
    dataIndex: 'name',
    ellipsis: true,
    formItemProps: {
      getValueFromEvent: (e) => e.target.value.trim(),
    },
  },
  {
    title: '操作人名称',
    dataIndex: 'inserterName',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '日期区间',
    dataIndex: 'insertTimeEnd',
    valueType: 'dateRange',
    ellipsis: true,
    hideInTable: true,
    hideInSearch: true,
  },
  {
    title: '操作时间',
    dataIndex: 'insertTime',
    tooltip: '相比正常时间延缓8分钟',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '操作类型',
    dataIndex: 'operateType',
    // hideInSearch: true,
    valueEnum: {
      add: { text: '新增' },
      update: { text: '修改' },
      addOrUpdate: { text: '新增或修改' },
      delete: { text: '删除' },
      importExcel: { text: '导入excel' },
      exportExcel: { text: '导出excel' },
      uploadFile: { text: '上传' },
      downloadFile: { text: '下载' },
      login: { text: '登录' },
      logout: { text: '登出' },
    },
  },
  // {
  //   title: '代码',
  //   dataIndex: 'code',
  //   hideInSearch: true,
  // },
  {
    title: '操作电脑ip',
    dataIndex: 'ip',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    hideInSearch: true,
  },
];

const SystemJournal: React.FC = () => {
  const [option, setOption] = useState<Record<string, unknown>>({});
  const [dataTable, setDataTable] = useState<TableListItem[]>([]);
  const [pageSize, setPageSize] = useState<number>();
  const access = useAccess();
  useEffect(() => {
    setOption({
      fileName: 'operationLog', //文件名称
      datas: [
        {
          sheetData: dataTable,
          sheetName: 'sheet',
          columnWidths: [10, 10, 10, 10, 10, 10, 10],
          sheetFilter: [
            'name',
            'inserterName',
            'insertTime',
            'operateType',
            'browser',
            'ip',
            'remark',
          ],
          sheetHeader: [
            '名称',
            '操作人名称',
            '操作时间',
            '操作类型',
            '浏览器',
            '操作电脑ip',
            '备注',
          ],
        },
      ],
    });
  }, [dataTable]);

  const operateTypeFY = (data: any) => {
    data.map((item: any) => {
      if (item.operateType === 'add') {
        item.operateType = '新增';
      } else if (item.operateType === 'update') {
        item.operateType = '修改';
      } else if (item.operateType === 'delete') {
        item.operateType = '删除';
      } else if (item.operateType === 'importExcel') {
        item.operateType = '导入excel';
      } else if (item.operateType === 'exportExcel') {
        item.operateType = '导出excel';
      } else if (item.operateType === 'uploadFile') {
        item.operateType = '上传';
      } else if (item.operateType === 'downloadFile') {
        item.operateType = '下载';
      } else if (item.operateType === 'login') {
        item.operateType = '登录';
      } else if (item.operateType === 'logout') {
        item.operateType = '登出';
      } else if (item.operateType === 'addOrUpdate') {
        item.operateType = '新增或修改';
      }
    });
    return data;
  };

  const downloadExcel = () => {
    const toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  };

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        className={styles.box}
        columns={columns}
        form={{ ignoreRules: false }}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        options={false}
        request={async (paramss) => {
          const res = await getLogData({
            queryObject: {
              ...paramss,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              insertTimeEnd: paramss.insertTimeEnd && `${paramss.insertTimeEnd[1]} 00:00:00`,
              insertTimeStart: paramss.insertTimeEnd && `${paramss.insertTimeEnd[0]} 23:59:59`,
              propertyName: 'insertTime',
              ascending: false, //时间顺序--降序
            },
          });
          if (res.code === 200) {
            const info = operateTypeFY(res.result.page.content);
            setDataTable(info);
          }
          setPageSize(paramss.pageSize);
          return {
            data: res.result.page.content,
            success: res.code === 200 ? true : false,
            total: res.result.page.totalElements,
          };
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 10,
        }}
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Access
            accessible={access.btnHasAuthority('systemJournalExport')}
            key="systemJournalExport"
          >
            <Button type="primary" key="show" onClick={downloadExcel}>
              导出日志
            </Button>
          </Access>,
        ]}
      />
    </PageContainer>
  );
};

export default SystemJournal;
