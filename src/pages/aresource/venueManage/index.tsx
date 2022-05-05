import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Switch } from 'antd';
import { getTableData, move, batchDeleteVenue, CXIcons } from '../../../services/venue/index';
import style from '../../securityActivities/activityManage/index.less';
import Detail from '../../securityActivities/activityManage/detail/detail';
import { PageContainer } from '@ant-design/pro-layout';
import { calcPageNo, getBit } from '@/utils/utilsJS';
import { history, useAccess, Access } from 'umi';

type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};

const VenueManage: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<number>(parseInt(props.location?.query?.page));
  const [pageSize, setPageSize] = useState<number>(parseInt(props.location?.query?.size));
  const [totle, setTotle] = useState<number>();
  // const [showAdd, setShowAdd] = useState<boolean>(false);
  const [addItem, setAddItem] = useState<any>({});
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [type, setType] = useState<boolean>(true);
  const [url, setUrl] = useState<any>([]);
  const access = useAccess();
  const params = { type };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        batchDeleteVenue(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
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

  const CXIcon = (ids: any) => {
    if (ids?.length === 0) return [];
    const icon: any = [];
    CXIcons({ idList: ids })
      .then((res: any) => {
        const info = res.data.rows;

        if (info.length > 0) {
          info.map((items: any) => {
            icon.push(items.minioFileUrl);
          });
          // setFileList(icon);
        }
        setUrl(icon);
      })
      .catch((err: any) => {
        message.error(err.message);
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
      title: '场馆名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
        rules: [
          {
            min: 1,
            max: 20,
          },
        ],
      },
    },
    {
      title: '场馆地址',
      dataIndex: 'address',
      search: false,
      ellipsis: true,
    },
    {
      title: '经纬度',
      key: 'lonLat',
      search: false,
      ellipsis: true,
      render: (text, record) => {
        return `${getBit(record.lon, 10) || ''}${record.lon ? ',' : ''}${
          getBit(record.lat, 10) || ''
        }`;
      },
    },
    {
      title: '场馆负责人',
      dataIndex: 'gymPerson',
      hideInSearch: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '联系方式',
      ellipsis: true,
      search: false,
      dataIndex: 'phoneNumber',
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
            setShowDetail(true);
            const detail = record;
            if (detail.hasSecurityOrganization === '1') {
              detail.hasSecurityOrganization = '是';
            } else if (detail.hasSecurityOrganization === '0') {
              detail.hasSecurityOrganization = '否';
            }
            const idList: any = [];
            if (detail?.placeUrl1) idList.push(detail.placeUrl1);
            if (detail?.placeUrl2) idList.push(detail.placeUrl2);
            if (detail?.placeUrl3) idList.push(detail.placeUrl3);
            CXIcon(idList);
            setAddItem(detail);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('venueManageEdit')} key="venueManageEdit">
          <a
            key="editable"
            onClick={() => {
              history.push(
                `/aresource/venueManage/edit?id=${record.id}&current=${current}&pageSize=${pageSize}`,
              );
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('venueManageDel')} key="venueManageDel">
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

  const detailColumn: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
      width: 100,
      search: false,
    },
    {
      title: '图层名称',
      dataIndex: 'name',
      width: 300,
      ellipsis: true,
    },
    {
      title: '是否默认',
      render: (_, record) => (
        <Switch defaultChecked={record?.isDefult == '0' ? false : true} disabled={true} />
      ),
    },
  ];
  function moveItem(item: TableListItem, isUp: boolean) {
    move(current, pageSize, item.id, isUp)
      .then(() => {
        setType(!type);
      })
      .catch((res) => {
        message.warning(res.message);
      });
  }
  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        columns={columns}
        params={params}
        actionRef={actionRef}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableAlertRender={false}
        rowKey="id"
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          },
        }}
        request={async (paramss) => {
          const res = await getTableData({
            // ...paramss,
            name: paramss.name,
            page: (paramss.current as number) - 1,
            size: paramss.pageSize as number,
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(res.result.page.totalElements);

          return {
            data: res.result.page.content,
            success: res.code === 200 ? true : false,
            total: res.result.page.totalElements,
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
          <Access accessible={access.btnHasAuthority('venueManageAdd')} key="venueManageAdd">
            <Button
              key="button"
              type="primary"
              onClick={() => {
                history.push(`/aresource/venueManage/add?&current=${current}&pageSize=${pageSize}`);
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('venueManageDel')} key="venueManageDel">
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
      />
      {/* {showAdd && (
        <AddVenue
          updateType={updateType as string}
          show={showAdd}
          onCancel={() => {
            setShowAdd(false);
          }}
          onConfirm={() => {
            setShowAdd(false);
            setAddItem({});
            setType(!type);
          }}
          item={addItem}
        />
      )} */}
      <Detail
        width="170px"
        show={showDetail}
        baseInfo={addItem}
        onClose={() => {
          setShowDetail(false);
        }}
        imgUrl="image"
        imgName="场馆图片"
        imageUrl={url}
        title="场馆详情"
        detailTabTow="关联图层"
        detailColumn={detailColumn}
        detailData={addItem?.arLayermanagerVOS?.sort((a: any, b: any) => a.code - b.code)}
        config={[
          { label: '场馆名称', index: 'name', span: 2 },
          { label: '场馆负责人', index: 'gymPerson', span: 2 },
          { label: '场馆负责人联系方式', index: 'phoneNumber', span: 2 },
          { label: '场馆实际地址', index: 'realAddress', span: 2 },
          { label: '场馆登记地址', index: 'address', span: 2 },
          { label: '监督民警', index: 'districtPolice', span: 2 },
          { label: '监督民警联系方式', index: 'districtPoliceTel', span: 2 },
          { label: '是否有保卫机构', index: 'hasSecurityOrganization', span: 2 },
          { label: '保卫机构名称', index: 'securityOrganizationName', span: 2 },
          { label: '保卫机构负责人', index: 'directorName', span: 2 },
          { label: '保卫机构负责人联系方式', index: 'directorIdTel', span: 2 },
          { label: '场馆编码', index: 'code' },
          { label: '经度', index: 'lon' },
          { label: '纬度', index: 'lat' },
          { label: '高度', index: 'height' },
          { label: '行政区划代码', index: 'zoomCode' },
          { label: '所属公安机关', index: 'psoname' },
          { label: '插入人', index: 'inserterName' },
          { label: '插入时间', index: 'insertTime' },
          { label: '更新人', index: 'updaterName' },
          { label: '更新时间', index: 'updateTime' },
        ]}
      />
    </PageContainer>
  );
};

export default VenueManage;
