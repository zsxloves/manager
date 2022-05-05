import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { getToken } from '@/utils/auth';
import { calcPageNo, getBit } from '@/utils/utilsJS';
import { history, useAccess, Access } from 'umi';
import './index.less';
import Detail from '../../securityActivities/activityManage/detail/detail';
import { getTableData, move, getInfoById, batchDeletepark } from '../../../services/parking';
import style from '../../securityActivities/activityManage/index.less';
import AddVenue from './add/add';
import Upload from '../../../components/Upload';

type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};
const exportExcelColumns: any[] = [
  {
    titleName: '停车场名称',
    columnName: 'name',
  },
  {
    titleName: '停车场类别',
    columnName: 'type',
  },

  {
    titleName: '所属场馆',
    columnName: 'gymName',
  },
  {
    titleName: '场馆层级',
    columnName: 'gymLevel',
  },
  {
    titleName: '停车场编号',
    columnName: 'no',
  },
  {
    titleName: '总量',
    columnName: 'total',
  },
  {
    titleName: '饱和度',
    columnName: 'saturation',
  },
  {
    titleName: '停车场位置',
    columnName: 'site',
  },
  {
    titleName: '经度',
    columnName: 'lon',
  },
  {
    titleName: '纬度',
    columnName: 'lat',
  },
  {
    titleName: '高度',
    columnName: 'height',
  },
];
const ParkingManage: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<number>(parseInt(props.location?.query?.page));
  const [pageSize, setPageSize] = useState<number>(parseInt(props.location?.query?.size));
  const [totle, setTotle] = useState<number>();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [addItem, setAddItem] = useState<any>({});
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选存放选择人员
  const [exportParams, setExportParams] = useState<any>(); //查询人员列表存放所有
  const [type, setType] = useState<boolean>(true);
  const params = { type };
  const access = useAccess();

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        batchDeletepark(ids)
          .then((res) => {
            if (res.code === 200) {
              setSelectedRowKeys([]);
              setSelectedRows([]);
              message.success('删除成功!');
              const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
              actionRef.current?.setPageInfo!({ current: delPage, pageSize });
              setType(!type);
            } else {
              message.warning(res.message);
            }
          })
          .catch((err) => {
            message.error(err.message);
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
      title: '停车场名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '停车场类别',
      dataIndex: 'type',
      search: false,
      ellipsis: true,
    },
    {
      title: '停车场编号',
      dataIndex: 'no',
      search: false,
      ellipsis: true,
    },
    {
      title: '停车场位置',
      dataIndex: 'site',
      search: false,
      ellipsis: true,
    },
    {
      title: '经度',
      search: false,
      dataIndex: 'lon',
      ellipsis: true,
    },
    {
      title: '纬度',
      search: false,
      dataIndex: 'lat',
      ellipsis: true,
    },
    {
      title: '高度',
      search: false,
      dataIndex: 'height',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 300,
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
                if (res.code === 200) {
                  setShowDetail(true);
                  setAddItem(res.result.detail);
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
        <Access accessible={access.btnHasAuthority('parkingManageEdit')} key="parkingManageEdit">
          <a
            key="editable"
            onClick={() => {
              history.push(
                `/securityResources/parkingManage/add?detail=1&id=${record.id}&current=${current}&pageSize=${pageSize}`,
              );
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('parkingManageDel')} key="parkingManageDel">
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
    move(current, pageSize, item.id, isUp)
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
  //导出
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/park/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '停车场管理表',
        },
        `停车场管理表${new Date().getTime()}.xlsx`,
      );
    } else {
      exportFile(
        '/api/park/exportExcel',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns,
          fileName: '停车场管理表',
        },
        `停车场管理表${new Date().getTime()}.xlsx`,
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
        rowKey="id"
        tableAlertRender={false}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (paramss) => {
          const res = await getTableData({
            queryObject: {
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              name: paramss.name,
              // ascending: false,
              // propertyName: 'sortIndex',
              // sortOrder: 'desc',
            },
          });
          const { result } = res;
          setExportParams(result.page.content);
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(result.page.totalElements);
          if (result.page.content?.length > 0) {
            result.page.content.map((item: any) => {
              item.lon = getBit(item?.lon, 10);
              item.lat = getBit(item?.lat, 10);
            });
          }
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
          <Access accessible={access.btnHasAuthority('parkingManageAdd')} key="parkingManageAdd">
            <Button
              key="button"
              type="primary"
              onClick={() => {
                history.push(
                  `/securityResources/parkingManage/add?add=1&current=${current}&pageSize=${pageSize}`,
                );
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('parkingManageImport')}
            key="parkingManageImport"
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
            accessible={access.btnHasAuthority('parkingManageExport')}
            key="parkingManageExport"
          >
            <Button
              key="button"
              onClick={() => {
                if (!exportParams?.length) {
                  message.warning('导出数据为空');
                  return;
                }
                toExport(selectedRowsState);
              }}
            >
              导出
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
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(_);
          },
        }}
      />
      {showAdd && (
        <AddVenue
          current={current as number}
          pageSize={pageSize}
          show={showAdd}
          onCancel={() => {
            setShowAdd(false);
          }}
          onConfirm={(page: number, size: number) => {
            setShowAdd(false);
            setAddItem({});
            setCurrent(page);
            setPageSize(size);
            // getTable(page, size, formValue);
          }}
          item={addItem}
        />
      )}
      <Detail
        show={showDetail}
        baseInfo={addItem}
        onClose={() => {
          setShowDetail(false);
        }}
        title="停车场详情"
        config={[
          { label: '名称', index: 'name', span: 2 },
          { label: '负责人姓名', index: 'personName', span: 2 },
          { label: '负责人身份证号', index: 'idCard' },
          { label: '负责人联系电话', index: 'phoneNumber' },
          { label: '类别', index: 'type' },
          { label: '所属场馆', index: 'gymName' },
          { label: '场馆层级', index: 'gymLevel' },
          { label: '编号', index: 'no' },
          { label: '总量', index: 'total' },
          { label: '饱和度', index: 'saturation', span: 2 },
          { label: '位置', index: 'site', span: 2 },
          { label: '信息标识地址', index: 'src', span: 2 },
          { label: '经度', index: 'lon' },
          { label: '纬度', index: 'lat' },
          { label: '高度', index: 'height' },
          { label: '使用状态', index: 'status' },
          { label: '停车场出入口数量', index: 'enterNumber' },
          { label: '所属区域编码', index: 'zoneCode' },
          { label: '插入人', index: 'inserterName' },
          { label: '插入人时间', index: 'insertTime' },
          { label: '更新人', index: 'updaterName' },
          { label: '更新时间', index: 'updateTime' },
        ]}
      />
      {showUpload && (
        <Upload
          className="park-add"
          onCancel={() => {
            setShowUpload(false);
          }}
          onSubmit={() => {
            setShowUpload(false);
            // getTable(0, 10);
            setType(!type);
            actionRef.current?.setPageInfo!({ current: 1, pageSize: 10 });
          }}
          updateModalVisible={showUpload}
          exportExcelHeaderInfos={exportExcelColumns.map(({ columnName }) => ({ columnName }))}
          url={'/api/park/importExcelAbout'}
          title="停车场导入"
          showTemplate={true}
          downloadTemplate={() => {
            const a = document.createElement('a');
            a.href = '/excel/停车场管理导入模板.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        />
      )}
    </PageContainer>
  );
};

export default ParkingManage;
