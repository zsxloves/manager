import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getkeyUnitList, deleteUnit, movekeyUnit } from '../../../services/keyUnit';
import DetailUnit from './components/DetailUnit';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getToken } from '@/utils/auth';
import ImportPerson from './components/ImportPerson'; //导入
import { useAccess, Access } from 'umi';
import style from './index.less';
type TableListItem = {
  name: string;
  code: string;
  remark: string;
  corporation: string;
  contactNo: string;
  organizationId: string;
  id: string;
};
type Itable = {
  location: any;
};
const TableList: React.FC<Itable> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<any>();
  const [showDeatail, setShowDeatail] = useState<boolean>(false);
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>(props.location?.query?.page);
  const [pageSize, setPageSize] = useState<number>(props.location?.query?.size);
  const params = { type };
  const [exportParams, setExportParams] = useState<any>(); //查询人员列表存放所有
  const [importVisible, setImportVisible] = useState<boolean>(false); //导入状态
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选存放选择人员
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  // const [cjType, setCjType] = useState<
  //   {
  //     value: string;
  //     label: string;
  //   }[]
  // >(); //采集类型
  // 导出
  type ExportExcel = {
    titleName: string;
    columnName: string;
  };
  const exportExcelColumns: ExportExcel[] = [
    {
      titleName: '单位名称',
      columnName: 'name',
    },
    {
      titleName: '备注',
      columnName: 'remark',
    },
    {
      titleName: '标准地址',
      columnName: 'standardAddress',
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
    {
      titleName: '简称',
      columnName: 'abbreviation',
    },
    {
      titleName: '法人',
      columnName: 'corporation',
    },
    {
      titleName: '公司状态',
      columnName: 'statusName',
    },
    {
      titleName: '社会统一信用代码',
      columnName: 'uscc',
    },
    {
      titleName: '联系人',
      columnName: 'contacts',
    },
    {
      titleName: '联系电话',
      columnName: 'contactNo',
    },
    {
      titleName: '所属组织机构',
      columnName: 'orgName',
    },
    {
      titleName: '安保联系人',
      columnName: 'securityContacts',
    },
    {
      titleName: '安保联系电话',
      columnName: 'securityContactno',
    },
    {
      titleName: '采集类型',
      columnName: 'getTypeName',
    },
    {
      titleName: '距离',
      columnName: 'distence',
    },
    {
      titleName: '距离类型',
      columnName: 'distenceType',
    },
  ];

  // const init = () => {
  //   //采集类型
  //   const querycjlx = {
  //     page: 0,
  //     size: 10000000,
  //     parentId: '34d7861c-5b01-447a-aa33-34d71e581a76',
  //   };
  //   getState({ queryObject: querycjlx }).then((res) => {
  //     const data = res.result.page.content;
  //     const de =
  //       data &&
  //       data.map((item: Record<string, unknown>) => {
  //         return {
  //           value: item.id,
  //           label: item.name,
  //         };
  //       });
  //     setCjType(de);
  //   });
  // };
  useEffect(() => {
    // init();
    if (props.location?.query?.page) {
      actionRef.current?.setPageInfo!({
        current: parseInt(props.location?.query?.page),
        pageSize: props.location?.query?.size,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        '/api/arCompany/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '基础信息',
        },
        '基础信息.xlsx',
      );
    } else {
      // message.error('请选择需要导出的数据');
      exportFile(
        '/api/arCompany/exportExcel',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns,
          fileName: '基础信息',
        },
        '基础信息.xlsx',
      );
    }
  };
  // 批量删除
  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await deleteUnit(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        setType(!type);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除？',
      onOk: () => {
        handleRemove(ids);
      },
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
      ellipsis: true,
    },
    {
      title: '单位名称',
      dataIndex: 'name',
      hideInSearch: false,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '简称',
      dataIndex: 'abbreviation',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      valueType: 'select',
      valueEnum: {
        0: { text: '重点单位' },
        // 1: { text: '重点单位名册表' },
        2: { text: '工地采集表' },
        3: { text: '交叉路口采集表' },
        4: { text: '公交车站' },
        5: { text: '上垮桥' },
        6: { text: '涵洞桥梁高架' },
        7: { text: '制高点' },
      },
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      hideInSearch: true,
      width: '100px',
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'contactNo',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '组织机构',
      dataIndex: 'orgName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '涉及路名',
      dataIndex: 'road',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '片区',
      dataIndex: 'area',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      fixed: 'right',
      render: (_, record) => [
        <a
          title="上移"
          key="up"
          type="link"
          onClick={() => {
            const datas = {
              reqModel: {
                queryObject: {
                  page: current,
                  pageSize: pageSize,
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
            movekeyUnit(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                }
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          title="下移"
          key="down"
          type="link"
          onClick={() => {
            const datas = {
              reqModel: {
                queryObject: {
                  page: current,
                  pageSize: pageSize,
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
            movekeyUnit(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setShowDeatail(true);
            setRow(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('keyUnitEdit')} key="keyUnitEdit">
          <a
            key="edit"
            onClick={() => {
              history.push(
                `/securityResources/keyUnit/components/AddUnit?userId=${record.id}&page=${current}&size=${pageSize}`,
              );
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('keyUnitDelete')} key="keyUnitDelete">
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
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        className={style.tableKey}
        actionRef={actionRef}
        tableAlertRender={false}
        options={{
          density: false,
          fullScreen: undefined,
          reload: undefined,
          setting: false,
        }}
        rowKey="id"
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        search={{
          labelWidth: 100,
          span: 5,
          layout: 'horizontal',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('keyUnitAdd')} key="keyUnitAdd">
            <Button
              type="primary"
              onClick={() => {
                history.push(
                  `/securityResources/keyUnit/components/AddUnit?page=${current}&size=${pageSize}`,
                );
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('keyUnitImport')} key="keyUnitImport">
            <Button
              onClick={() => {
                setImportVisible(true);
              }}
            >
              导入
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('keyUnitExport')} key="keyUnitExport">
            <Button
              onClick={() => {
                toExport(selectedRowsState);
              }}
            >
              导出
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('keyUnitDelete')} key="keyUnitDelete">
            <Button
              style={{ float: 'left' }}
              onClick={() => {
                if (selectedRowKeys.length > 0) {
                  handleRemoveOne(selectedRowKeys);
                } else {
                  message.error('请至少选择一条数据');
                }
              }}
            >
              批量删除
            </Button>
          </Access>,
        ]}
        request={async (paramss) => {
          const res = await getkeyUnitList({
            queryObject: {
              // ...paramss,
              name: paramss?.name,
              dataType: paramss?.dataType,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              propertyName: 'sortIndex',
              ascending: false,
            },
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setExportParams(res.result.page.content);
          if (res.code === 200) {
            // message.success(res.message);
          } else {
            message.error(res.message);
          }
          return {
            data: res.result.page.content,
            success: res.code === 200 ? true : false,
            total: res.result.page.totalElements,
          };
        }}
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(_);
          },
        }}
        columns={columns}
      />
      {showDeatail && (
        <DetailUnit
          onCancel={() => {
            setShowDeatail(false);
          }}
          modalVisible={showDeatail}
          userInfo={row}
          title={'基础信息详情'}
        />
      )}
      {/* 导入 */}
      {importVisible && (
        <ImportPerson
          importVisible={importVisible}
          onSub={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          ok={() => {
            setImportVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;
