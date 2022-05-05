import React, { useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  getEarlyList,
  moveEarly,
  exportEarly,
  batchDeleteEarly,
} from '@/services/securityResources';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Upload from '@/components/Upload';
import UpdateEarly from './components/UpdateEarly';
import EarlyDetail from './components/EarlyDetail';
import ImportEarly from './components/ImportEarly';
import WhiteList from './components/WhiteList';
import { calcPageNo, getBit } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';

type TableListItem = {
  id: string;
  key?: number;
  name: string;
  code: string;
  remark: string;
  value: string;
  fatherDictz?: string;
  personInfoList?: string[];
};
// type ExportExcel = {
//   titleName: string;
//   columnName: string;
// };

const EquipManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateTitle, setUpdateTitle] = useState<string>(); //新增编辑类型
  const [add, setAdd] = useState<boolean>(false); //新增编辑
  //const [selectedRowsState, setSelectedRowsState] = useState<any>([]); //选择数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  //const [equipAllInfo, setEquipAllInfo] = useState<any>(); //整页数据
  //const [equipUpload, setEquipUpload] = useState<boolean>(false); //导入状态
  const [eqId, setEqId] = useState<string>(); //编辑详情id
  const [detailBol, setDetailBol] = useState<boolean>(false); //详情
  const [detailInfo, setDetailInfo] = useState<any>();
  const [earlyUpload, setEarlyUpload] = useState<boolean>(false);
  const [whiteVisble, setWhiteVisble] = useState<boolean>(false); //白名单
  const [parkAllInfo, setParkAllInfo] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/ban-types
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
      const deleteInfo = await batchDeleteEarly(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        // setSelectedRowsState([]);
        message.success(deleteInfo.message);
        const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
        heavyLoad();
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
  //预警设备
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'code' },
    { columnName: 'category' },
    { columnName: 'activityName' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
  ];

  //导出
  const toExport = (ids: string[]) => {
    const info: any = {
      page: current,
      size: pageSize,
      isInWhiteList: null,
      propertyName: 'sortIndex',
      ascending: false,
    };
    if (ids.length > 0) {
      info.idList = ids;
    }
    exportEarly(info)
      .then((res) => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = URL.createObjectURL(res);
        document.body.appendChild(link);
        link.download = '预警设备管理.xlsx';
        link.click();
        // 释放的 URL 对象以及移除 a 标签
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      })
      .catch((err) => {
        message.error(err.message);
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
      width: '300px',
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '所属活动',
      dataIndex: 'activityName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '设备分类',
      dataIndex: 'categoryName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '白名单',
      dataIndex: 'isInWhiteList',
      ellipsis: true,
      hideInSearch: true,
      valueEnum: {
        true: {
          text: '是',
        },
        false: {
          text: '否',
        },
      },
    },
    {
      title: '经度',
      dataIndex: 'lon',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '纬度',
      dataIndex: 'lat',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '高度',
      dataIndex: 'height',
      ellipsis: true,
      hideInSearch: true,
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
                  size: pageSize,
                  isInWhiteList: null,
                  sortColumn: 'sortIndex',
                  ascending: false,
                },
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: true,
                },
              },
            };
            moveEarly(datas)
              .then((res) => {
                if (res.code === 200) {
                  heavyLoad();
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
          key="low"
          onClick={() => {
            const datas = {
              reqModel: {
                queryObject: {
                  page: current,
                  size: pageSize,
                  isInWhiteList: null,
                  sortColumn: 'sortIndex',
                  ascending: false,
                },
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: false,
                },
              },
            };
            moveEarly(datas)
              .then((res) => {
                if (res.code === 200) {
                  heavyLoad();
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
            setDetailInfo(record);
            setDetailBol(true);
            // setEqId(record.id);
            // setEquipInfo(record);
            // setCheckEquip(true);
          }}
        >
          详情
        </a>,
        <Access
          accessible={access.btnHasAuthority('earlyWarnManageEdit')}
          key="earlyWarnManageEdit"
        >
          <a
            key="edit"
            onClick={() => {
              setAdd(true);
              setEqId(record.id);
              // setEquipInfo(record);
              setUpdateTitle('edit');
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('earlyWarnManageDel')} key="earlyWarnManageDel">
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
        form={{ ignoreRules: false }}
        params={params}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        actionRef={actionRef}
        tableAlertRender={false}
        options={false}
        rowKey="id"
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (_) => {
            // setSelectedRowsState(selectedRows);
            setSelectedRowKeys(_);
          },
        }}
        search={{
          labelWidth: 100,
          span: 5,
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        toolBarRender={() => [
          <Access
            accessible={access.btnHasAuthority('earlyWarnManageAdd')}
            key="earlyWarnManageAdd"
          >
            <Button
              key="button"
              type="primary"
              onClick={() => {
                setAdd(true);
                setUpdateTitle('add');
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('earlyWarnManageWhiteList')}
            key="earlyWarnManageWhiteList"
          >
            <Button
              key="button"
              onClick={() => {
                setWhiteVisble(true);
              }}
            >
              白名单
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('earlyWarnManageImport')}
            key="earlyWarnManageImport"
          >
            <Button
              key="button"
              onClick={() => {
                setEarlyUpload(true);
              }}
            >
              导入
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('earlyWarnManageExport')}
            key="earlyWarnManageExport"
          >
            <Button
              key="button"
              onClick={() => {
                if (!parkAllInfo?.length) {
                  message.warning('导出数据为空');
                  return;
                }
                toExport(selectedRowKeys);
              }}
            >
              导出
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('earlyWarnManageDel')}
            key="earlyWarnManageDel"
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
        request={async (paramss) => {
          const res = await getEarlyList({
            queryObject: {
              ...paramss,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              isInWhiteList: null,
              propertyName: 'sortIndex',
              ascending: false,
            },
          });
          const data = res.result.page.content;
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize);
          if (data?.length > 0) {
            data.map((item: any) => {
              item.lon = getBit(item?.lon, 10);
              item.lat = getBit(item?.lat, 10);
            });
          }
          setParkAllInfo(data);
          setTotle(res.result.page.totalElements);
          return {
            data,
            success: res.code === 200 ? true : false,
            total: res.result.page.totalElements,
          };
        }}
        columns={columns}
      />
      {add && (
        <UpdateEarly
          eqId={eqId as string}
          equipVisible={add}
          title={updateTitle as string}
          heavyLoad={heavyLoad}
          cancelModal={() => {
            setAdd(false);
            setEqId('');
          }}
        />
      )}
      <EarlyDetail
        checkEquip={detailBol}
        equipInfo={detailInfo}
        onCancel={() => {
          setDetailBol(false);
          setDetailInfo('');
        }}
      />
      <ImportEarly
        importVisible={earlyUpload}
        handleOk={() => setEarlyUpload(false)}
        onSub={() => {
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      />
      {whiteVisble && (
        <WhiteList
          selectPersonVisible={whiteVisble}
          // preserve={(data: string[]) => {
          //   //白名单id-存储加重载table
          // }}
          cancelModal={() => {
            heavyLoad();
            setWhiteVisble(false);
            // setWhiteData(null);
          }}
        />
      )}
      {earlyUpload && (
        <Upload
          title="预警设备导入"
          updateModalVisible={earlyUpload}
          url={'/api/ar/device/excel/import'}
          exportExcelHeaderInfos={exportPersonExcelInfos as { columnName: string }[]}
          onSubmit={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
            setEarlyUpload(false);
          }}
          onCancel={() => {
            setEarlyUpload(false);
          }}
          showTemplate={true}
          downloadTemplate={() => {
            const a = document.createElement('a');
            a.href = '/excel/预警设备管理模板.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        />
      )}
    </PageContainer>
  );
};

export default EquipManage;
