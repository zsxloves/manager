import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { getToken } from '@/utils/auth';
import { calcPageNo, getBit } from '@/utils/utilsJS';
import { history } from 'umi';
import Detail from '../../securityActivities/activityManage/detail/detail';
import { getTableData, move, deleteMonitor, getInfoById } from '@/services/monitor';
import style from '../../securityActivities/activityManage/index.less';
import AddVenue from './add/add';
import Upload from '../../../components/Upload';
import { useAccess, Access } from 'umi';
import '../parkingManage/index.less';

type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};
const exportExcelColumns: any[] = [
  { label: '视频id', columnName: 'videoId' },
  { label: '视频名称', columnName: 'videoName' },
  { label: '视频URL地址', columnName: 'videoUrl' },
  { label: '视频类型', columnName: 'videoTypeName' },
  { label: '视频位置', columnName: 'position' },
  { label: '经度', columnName: 'lon' },
  { label: '纬度', columnName: 'lat' },
  { label: '高度', columnName: 'height' }, //饱和度
  { label: '显示级别', columnName: 'level' },
  { label: '是否融合', columnName: 'hasMarker' },
  { label: '摄像头类型', columnName: 'cameraTypeName' },
  { label: '视口信息', columnName: 'views' },
  { label: '室内室外', columnName: 'inDoorName' },
  { label: '楼层', columnName: 'floor' },
  { label: '是否损坏', columnName: 'isDamage' },
  { label: '所属组织', columnName: 'organizationName' },
  { label: '关联图层', columnName: 'layerName' },
];
const ParkingManage: React.FC = (props: any) => {
  const access = useAccess();
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

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        deleteMonitor(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
            setSelectedRows([]);
            const delPage = calcPageNo(totle, current, pageSize, ids.length);
            actionRef.current?.setPageInfo!({ current: delPage, pageSize });
            setType(!type);
          } else {
            message.warning(res.message);
          }
        });
      },
    });
  };

  const filterOneT = (rows: any) => {
    const data = rows;
    data.map((item: any) => {
      if (item.hasMarker === '1') {
        item.hasMarker = '是';
      } else if (item.hasMarker === '0') {
        item.hasMarker = '否';
      }
      if (item.isDamage === '1') {
        item.isDamage = '是';
      } else if (item.isDamage === '0') {
        item.isDamage = '否';
      }

      if (item.cameraType === '1') {
        item.cameraType = '枪机';
      } else if (item.cameraType === '2') {
        item.cameraType = '球机';
      } else if (item.cameraType === '3') {
        item.cameraType = '半球机';
      } else if (item.cameraType === '4') {
        item.cameraType = '带云台半球';
      }
    });
    return data;
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
      title: '视频Id',
      dataIndex: 'videoId',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '视频名称',
      dataIndex: 'videoName',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '视频地址',
      dataIndex: 'videoUrl',
      search: false,
      ellipsis: true,
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
                if (res.code === 200) {
                  setShowDetail(true);
                  const a = res.data.rows[0];
                  if (a.hasMarker === '1') {
                    a.hasMarkerName = '是';
                  } else {
                    a.hasMarkerName = '否';
                  }
                  if (a.isDamage === '1') {
                    a.isDamageName = '是';
                  } else {
                    a.isDamageName = '否';
                  }

                  if (a.cameraType === '1') {
                    a.cameraTypeName = '枪机';
                  } else if (a.cameraType === '2') {
                    a.cameraTypeName = '球机';
                  } else if (a.cameraType === '3') {
                    a.cameraTypeName = '半球机';
                  } else if (a.cameraType === '4') {
                    a.cameraTypeName = '带云台半球';
                  }
                  a.lon = getBit(a?.lon, 10);
                  a.lat = getBit(a?.lat, 10);
                  setAddItem(a);
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
        <Access accessible={access.btnHasAuthority('monitorManageEdit')} key="monitorManageEdit">
          <a
            key="editable"
            onClick={() => {
              history.push(
                `/securityResources/monitorManage/add?detail=1&id=${record.id}&page=${current}&size=${pageSize}`,
              );
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('monitorManageDel')} key="monitorManageDel">
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

  useEffect(() => {
    if (props.location?.query?.page) {
      actionRef.current?.setPageInfo!({ current: parseInt(props.location?.query?.page), pageSize });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      .then((res) => {
        return res.blob();
      })
      .then((data) => {
        const href = window.URL.createObjectURL(data);
        download(href, name);
        setSelectedRowKeys([]);
        setSelectedRows([]);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  //导出
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/arVideo/exportExcel',
        {
          dataList: filterOneT(rows),
          exportExcelInfos: exportExcelColumns.map((v) => ({
            columnName: v.columnName,
            titleName: v.label,
          })),
          fileName: '监控管理表',
        },
        `监控管理表${new Date().getTime()}.xlsx`,
      );
    } else {
      exportFile(
        '/api/arVideo/exportExcel',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns.map((v) => ({
            columnName: v.columnName,
            titleName: v.label,
          })),
          fileName: '监控管理表',
        },
        `监控管理表${new Date().getTime()}.xlsx`,
      );
    }
  };

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        // loading={loading}
        params={params}
        columns={columns}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        actionRef={actionRef}
        // dataSource={tableData}
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
          const res = await getTableData({
            ...paramss,
            pageNumber: paramss.current || 1,
            pageSize: paramss.pageSize || 10,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          const { data } = res;
          setCurrent(paramss.current || 1);
          setExportParams(filterOneT(data.rows));
          setPageSize(paramss.pageSize as number);
          setTotle(res.data.totalCount);
          return {
            data: res.data.rows,
            success: res.code === 200 ? true : false,
            total: res.data.totalCount,
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
          <Access accessible={access.btnHasAuthority('monitorManageAdd')} key="monitorManageAdd">
            <Button
              key="button"
              type="primary"
              onClick={() => {
                history.push(
                  `/securityResources/monitorManage/add?page=${current}&size=${pageSize}`,
                );
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('monitorManageImport')}
            key="monitorManageImport"
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
            accessible={access.btnHasAuthority('monitorManageExport')}
            key="monitorManageExport"
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
          <Access accessible={access.btnHasAuthority('monitorManageDel')} key="monitorManageDel">
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
          show={showAdd}
          onCancel={() => {
            setShowAdd(false);
          }}
          onConfirm={() => {
            setShowAdd(false);
            setAddItem({});
            // getTable(current, pageSize, formValue);
            setType(!type);
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
        title="监控详情"
        config={[
          { label: '视频名称', index: 'videoName', span: 2 },
          { label: '视频Id', index: 'videoId', span: 2 },
          { label: 'URL地址', index: 'videoUrl', span: 2 },
          { label: '视频位置', index: 'position', span: 2 },
          { label: '显示级别', index: 'level', span: 2 },
          { label: '视口信息', index: 'views', span: 2 },
          { label: '视频类别', index: 'videoTypeName' },
          { label: '经度', index: 'lon' },
          { label: '纬度', index: 'lat' },
          { label: '高度', index: 'height' },
          { label: '是否融合', index: 'hasMarkerName' },
          { label: '摄像头类型', index: 'cameraTypeName' },
          { label: '室内室外', index: 'inDoorName' },
          { label: '楼层', index: 'floor' },
          { label: '是否损坏', index: 'isDamageName' },
          { label: '组织架构', index: 'organizationName' },
          { label: '关联图层', index: 'layerName' },
          { label: '插入人', index: 'inserterName' },
          { label: '插入时间', index: 'insertTime' },
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
            // setFormValue({});
            (actionRef as any)?.current?.setPageInfo({ current: 1, pageSize: 10 });
            // getTable(0, 10);
            setType(!type);
          }}
          updateModalVisible={showUpload}
          exportExcelHeaderInfos={exportExcelColumns.map((v) => ({ columnName: v.columnName }))}
          url={'/api/arVideo/importExcelNew'}
          title="监控导入"
          showTemplate={true}
          downloadTemplate={() => {
            const a = document.createElement('a');
            a.href = '/excel/监控导入模板.xlsx';
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
