import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { Button, message, Modal, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { getPersonList, movePerson, batchDeletePerson } from '@/services/securityResources';
import { getDictfindAll } from '@/services/systemManager';
import { getToken } from '@/utils/auth';
import { calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';
import DetailPerson from './components/DetailPerson';
import ImportPerson from './components/ImportPerson';
import Tabs from '@/components/TabsButton';
import styles from './index.less';

type TableListItem = {
  id: string;
  key?: number;
  name: string;
  code: string;
  remark: string;
  value: string;
  fatherDictz?: string;
  posTypeName?: string;
  pageSize: number;
};
type ExportExcel = {
  titleName: string;
  columnName: string;
};
type Itable = {
  location: any;
};

const PersonManage: React.FC<Itable> = (props) => {
  const actionRef = useRef<ActionType>();
  const menuName: any = useRef([
    'd6697b08-8afe-47d3-8b1b-99fa39ac3555',
    'e7961c17-f52b-4893-9cd2-30fc63042b56',
    '3c1dad35-8c26-4d6a-b530-db5178a253a9',
    '3f1a1562-7d53-415e-a585-9c45f2c42400',
  ]);
  const defaultValue: any = useRef(
    props.location?.query?.defaultValue ? props.location?.query?.defaultValue : '工作人员',
  );
  const [persId, setPersId] = useState<string>(); //人员单个id
  const [checkPerson, setCheckPerson] = useState<boolean>(false); //人员详情
  const [importVisible, setImportVisible] = useState<boolean>(false); //导入状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选存放选择人员
  const [exportParams, setExportParams] = useState<any>([]); //查询人员列表存放所有
  const [type, setType] = useState<boolean>(true);
  const [posType, setPosType] = useState<any>([]); //职业类别
  const [current, setCurrent] = useState<number>(parseInt(props.location?.query?.page));
  const [pageSize, setPageSize] = useState<number>(parseInt(props.location?.query?.size));
  const [totle, setTotle] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const access = useAccess();
  const params = { type };

  // 重新加载table
  const heavyLoad = () => {
    setType(!type);
  };
  //过滤查找字典
  const FType = (names: any, data?: any) => {
    if (names?.length > 0 && data) {
      for (let i = 0; i < names?.length; i++) {
        const index = data.findIndex((item: any) => item.label === names[i]);
        menuName.current.push(data[index].value);
      }
    } else {
      for (let i = 0; i < names?.length; i++) {
        const index = posType.findIndex((item: any) => item.label === names[i]);
        menuName.current.push(posType[index].value);
      }
    }
  };
  const filterValue = (val: any) => {
    menuName.current = [];
    if (val === '工作人员') {
      FType(['民警', '辅警', '交警', '保安']);
    } else if (val === '实有人口') {
      FType(['普通人员']);
    } else if (val === '重点人员') {
      FType(['重点人员']);
    } else if (val === '住店人员') {
      FType(['住店人员']);
    }
    actionRef.current?.reloadAndRest!();
  };

  const filters = (data: any) => {
    const info = data.result.result;
    if (info.length > 0) {
      for (let i = 0; i < info.length; i++) {
        info[i].label = info[i].name;
        info[i].value = info[i].id;
      }
    }
    return info;
  };

  useEffect(() => {
    setLoading(true);
    if (props.location?.query?.page) {
      if (localStorage.getItem('menuId')) {
        const a = localStorage.getItem('menuId');
        menuName.current = JSON.parse(a as any);
      }
      localStorage.removeItem('menuId');
      actionRef.current?.setPageInfo!({ current: parseInt(props.location?.query?.page), pageSize });
    }
    //字典库--职业类别查询
    getDictfindAll({ parentId: 'ccdf1602-38b2-4987-886c-944ac533b891' })
      .then((res) => {
        const data = filters(res);
        setPosType(data);
        // FType(["民警","辅警","交警","保安"],data);
        // actionRef.current?.reloadAndRest!();
      })
      .catch((err) => {
        message.error(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 删除
   *
   * @param ids
   */
  const handleRemove = async (ids: string[]) => {
    if (!ids) return true;
    try {
      const deleteInfo = await batchDeletePerson(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        setSelectedRows([]);
        message.success('删除成功!');
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
  //详情取消
  const cancelDetail = () => {
    setCheckPerson(false);
    setPersId('');
  };
  const TabColumn = [
    {
      access: 'personTotal',
      content: '全部',
      value: '全部',
    },
    {
      access: 'personWork',
      content: '工作人员',
      value: '工作人员',
    },
    {
      access: 'personIndeed',
      content: '实有人口',
      value: '实有人口',
    },
    {
      access: 'personKeyNote',
      content: '重点人员',
      value: '重点人员',
    },
    {
      access: 'personCheck',
      content: '住店人员',
      value: '住店人员',
    },
  ];

  const exportExcelColumns: ExportExcel[] = [
    {
      titleName: '姓名',
      columnName: 'name',
    },
    {
      titleName: '曾用名',
      columnName: 'alias',
    },
    {
      titleName: '性别',
      columnName: 'genderName',
    },
    {
      titleName: '人员类别',
      columnName: 'personTypeName',
    },
    {
      titleName: '职业类别',
      columnName: 'posTypeName',
    },
    {
      titleName: '标准地址',
      columnName: 'standardAddress',
    },
    {
      titleName: '户籍地址',
      columnName: 'nativeAddress',
    },
    {
      titleName: '文化程度',
      columnName: 'educationName',
    },
    {
      titleName: '健康状况',
      columnName: 'health',
    },
    {
      titleName: '婚姻状况',
      columnName: 'marriageName',
    },
    {
      titleName: '政治面貌',
      columnName: 'partyAffiliationName',
    },
    {
      titleName: '身份证号',
      columnName: 'idCardCode',
    },
    {
      titleName: '管控分级',
      columnName: 'controlLevel',
    },
    {
      titleName: '布控情况',
      columnName: 'controlInfo',
    },
    {
      titleName: '案件类别',
      columnName: 'caseType',
    },
    {
      titleName: '最后管控时间',
      columnName: 'controlTime',
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
      titleName: '关联组织机构',
      columnName: 'orgName',
    },
    {
      titleName: '备注',
      columnName: 'remark',
    },
  ];

  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };
  //
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
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  //导出
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/person/info/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '人员管理表',
        },
        '人员管理表.xlsx',
      );
    } else {
      // message.error('请选择需要导出的数据');
      exportFile(
        '/api/person/info/exportExcel',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns,
          fileName: '人员管理表',
        },
        '人员管理表.xlsx',
      );
    }
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
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '标签',
      dataIndex: 'posTypeName',
      search: false,
      width: 90,
      valueEnum: {
        民警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        辅警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        保安: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        交警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        普通人员: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        重点人员: {
          text: <Tag color="#f50">重点人员</Tag>,
        },
        住店人员: {
          text: <Tag color="rgb(88 139 255)">住店人员</Tag>,
        },
      },
    },
    {
      title: '性别',
      dataIndex: 'genderName',
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '人员类别',
      dataIndex: 'personTypeName',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '类别',
      dataIndex: 'posTypeName',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'idCardCode',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '关联组织机构',
      dataIndex: 'orgName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 230,
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
            movePerson(datas)
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
            movePerson(datas)
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
            setPersId(record.id);
            setCheckPerson(true);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('personManageEdit')} key="personManageEdit">
          <a
            key="edit"
            onClick={() => {
              history.push(
                `/securityResources/personManage/editPerson?personId=${record.id}&page=${current}&size=${pageSize}&defaultValue=${defaultValue.current}`,
              );
              localStorage.setItem('menuId', JSON.stringify(menuName.current));
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('personManageDel')} key="personManageDel">
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
        form={{ ignoreRules: false }}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        className={styles.table}
        actionRef={actionRef}
        tableAlertRender={false}
        options={false}
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
          searchText: '查询',
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('personManageAdd')} key="personManageAdd">
            <Button
              type="primary"
              onClick={() => {
                history.push(
                  `/securityResources/personManage/addPerson?page=${current}&size=${pageSize}&defaultValue=${defaultValue.current}`,
                );
                localStorage.setItem('menuId', JSON.stringify(menuName.current));
              }}
            >
              新增
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('personManageImport')}
            key="personManageImport"
          >
            <Button
              key="button"
              onClick={() => {
                setImportVisible(true);
              }}
            >
              导入
            </Button>
          </Access>,
          <Access
            accessible={access.btnHasAuthority('personManageExport')}
            key="personManageExport"
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
          <Access accessible={access.btnHasAuthority('personManageDel')} key="personManageDel">
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
          <div className="btnfour">
            <Tabs
              size="large"
              loading={loading}
              defaultValue={defaultValue.current}
              columns={TabColumn}
              onClick={(value: any) => {
                filterValue(value);
                defaultValue.current = value;
              }}
            />
          </div>,
        ]}
        request={async (paramss) => {
          setLoading(true);
          const res = await getPersonList({
            queryObject: {
              name: paramss?.name,
              posTypeList: menuName.current?.length > 0 ? menuName.current : undefined,
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              ascending: false,
              propertyName: 'sortIndex',
              sortOrder: 'desc',
            },
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          const data = res.result.page.content;
          setTotle(res.result.page.totalElements);
          setExportParams(data);
          setLoading(false);
          return {
            data,
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
      <DetailPerson
        persId={persId as string}
        detailVisible={checkPerson}
        cancelDetail={cancelDetail}
      />
      {/* 导入 */}
      <ImportPerson
        importVisible={importVisible}
        handleOk={() => setImportVisible(false)}
        onSub={() => {
          if (actionRef.current) {
            actionRef.current.reloadAndRest!();
          }
        }}
      />
    </PageContainer>
  );
};

export default PersonManage;
