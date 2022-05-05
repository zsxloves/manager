import React, { useRef, useState } from 'react';
import { getToken } from '@/utils/auth';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import {
  getTableDatas,
  move,
  batchDeleteActivity,
  getInfoById,
} from '../../../services/activeManager/index';
import AddActive from './add/add';
import style from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import Detail from './detail/detail';
import Upload from '@/components/Upload';
import { calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';
import '@/pages/securityResources/parkingManage/index.less';

type TableListItem = {
  arGymVOS: any[];
  id: string;
  [key: string]: any;
};

const detailConfig = [
  { label: '活动名称', index: 'name', span: 2 },
  {
    label: '开始时间',
    index: 'startTime',
    // render: (record: any) => record?.startTime?.split(' ')[0],
  },
  { label: '结束时间', index: 'endTime' },
  { label: '承办单位', index: 'contractor' },
  { label: '活动联系人', index: 'contact' },
  { label: '联系方式', index: 'contactPhone' },
  { label: '所属组织', index: 'department' },
  {
    label: '关联场景',
    render: (item1: any) => {
      return item1?.arGymVOS?.map((v: any) => v.name).join(',');
    },
  },
  { label: '插入人', index: 'inserterName' },
  { label: '插入时间', index: 'insertTime' },
  { label: '更新人', index: 'updaterName' },
  { label: '更新时间', index: 'updateTime' },
];

const exportExcelColumns: any[] = [
  {
    titleName: '活动名称',
    columnName: 'name',
  },
  {
    titleName: '开始时间',
    columnName: 'startTime',
  },
  {
    titleName: '结束时间',
    columnName: 'endTime',
  },
  {
    titleName: '承办单位',
    columnName: 'contractor',
  },
  {
    titleName: '活动联系人',
    columnName: 'contact',
  },
  {
    titleName: '联系方式',
    columnName: 'contactPhone',
  },

  {
    titleName: '所属组织',
    columnName: 'department',
  },
  {
    titleName: '关联场景',
    columnName: 'senceName',
  },
];

const ActivityManager: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [active, setActive] = useState<string>('');
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选存放选择人员
  const [exportParams, setExportParams] = useState<any>(); //查询人员列表存放所有
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const access = useAccess();
  const [type, setType] = useState<boolean>(true);
  const params = { type };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        batchDeleteActivity(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
            setSelectedRows([]);
            const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
            actionRef.current?.setPageInfo!({ current: delPage, pageSize });
            setType(!type);
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
      render: (_, record, index) => index + 1,
      width: 100,
      search: false,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '结束时间',
      key: 'showTime',
      dataIndex: 'endTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '承办单位',
      dataIndex: 'contractor',
      ellipsis: true,
      search: false,
    },
    {
      title: '关联场景',
      ellipsis: true,
      search: false,
      render: (text, record) => {
        if (record.arGymVOS) {
          return record.arGymVOS
            .map((v) => {
              return v?.name;
            })
            .join(',');
        } else {
          return '';
        }
      },
    },
    {
      title: '所属组织',
      dataIndex: 'department',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      render: (text, record) => [
        <ArrowUpOutlined
          className={style['activity-arrow']}
          onClick={() => {
            moveItem(record, true);
          }}
        />,
        <ArrowDownOutlined
          className={style['activity-arrow']}
          onClick={() => {
            moveItem(record, false);
          }}
        />,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            getInfoById(record.id)
              .then((res) => {
                if (res.code === 200 && res.result.detail) {
                  setBaseInfo(res.result.detail);
                  setShowDetail(true);
                } else {
                  message.error(res.message);
                }
              })
              .catch((res) => {
                message.error(res.message);
              });
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('activityManageEdit')} key="activityManageEdit">
          <a
            key="editable"
            onClick={() => {
              getInfoById(record.id)
                .then((res) => {
                  setBaseInfo(res.result.detail);
                  setShowAdd(true);
                  setActive('edit');
                })
                .catch((err) => {
                  message.error(err.message);
                });
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('activityManageDel')} key="activityManageDel">
          <a
            target="_blank"
            rel="noopener noreferrer"
            key="view"
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

  function moveItem(item: TableListItem, isUp: boolean) {
    move(current, pageSize as number, item.id, isUp)
      .then((res) => {
        if (res.code === 200) {
          setType(!type);
        }
      })
      .catch((res) => {
        message.warning(res.message);
      });
  }
  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };
  const exportFile = (url: any, param: any, name: any) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken(),
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.blob())
      .then((data) => {
        const href = window.URL.createObjectURL(data);
        download(href, name);
      });
  };

  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/activity/exportExcelNew',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '活动管理表',
        },
        `活动管理表${new Date().getTime()}.xlsx`,
      );
    } else {
      exportFile(
        '/api/activity/exportExcelNew',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns,
          fileName: '活动管理表',
        },
        `活动管理表${new Date().getTime()}.xlsx`,
      );
    }
  };
  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        params={params}
        columns={columns}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        actionRef={actionRef}
        tableAlertRender={false}
        rowKey="id"
        pagination={{
          responsive: true,
          showQuickJumper: true,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (paramss) => {
          const res = await getTableDatas({
            queryObject: {
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              name: paramss.name,
            },
          });
          const { result } = res;
          setExportParams(result.page.content);
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(result.page.totalElements);
          return {
            data: result.page.content,
            success: res.code === 200 ? true : false,
            total: result.page.totalElements,
          };
        }}
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        dateFormatter="string"
        options={false}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('activityManageAdd')} key="activityManageAdd">
            <Button
              key="button"
              type="primary"
              onClick={() => {
                setShowAdd(true);
                setBaseInfo({});
                setActive('add');
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('activityManageImport')}
            key="activityManageImport"
          >
            <Button
              key="button"
              onClick={() => {
                setShowUpload(true);
              }}
            >
              导入
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('activityManageExport')}
            key="activityManageExport"
          >
            <Button
              key="button"
              onClick={() => {
                toExport(selectedRowsState);
              }}
            >
              导出
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('activityManageDel')} key="activityManageDel">
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
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(_);
          },
        }}
      />
      <Detail
        show={showDetail}
        title="活动详情"
        onClose={() => {
          setShowDetail(false);
        }}
        baseInfo={{ ...baseInfo }}
        config={detailConfig}
      />
      {showAdd && (
        <AddActive
          show={showAdd}
          active={active}
          onCancel={() => {
            setShowAdd(false);
          }}
          onConfirm={() => {
            setShowAdd(false);
            setBaseInfo({});
            setType(!type);
          }}
          item={baseInfo}
        />
      )}
      {showUpload && (
        <Upload
          className="park-add"
          onCancel={() => {
            setShowUpload(false);
          }}
          onSubmit={() => {
            setShowUpload(false);
            actionRef.current?.reloadAndRest!();
          }}
          updateModalVisible={showUpload}
          exportExcelHeaderInfos={exportExcelColumns.map(({ columnName }) => ({ columnName }))}
          url={'/api/activity/importExcelAbout'}
          title="活动导入"
          showTemplate={true}
          downloadTemplate={() => {
            const a = document.createElement('a');
            a.href = '/excel/活动导入模板.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        />
      )}
    </PageContainer>
  );
};

export default ActivityManager;
