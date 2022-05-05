import React, { useState, useEffect } from 'react';
import { Descriptions, Drawer, message, Tabs, Tag } from 'antd';
import { houseDetail } from '@/services/securityResources';
import type { ProColumns } from '@ant-design/pro-table';
import { getBit } from '@/utils/utilsJS';
import ProTable from '@ant-design/pro-table';

export interface DetailPer {
  persId: string;
  detailVisible: boolean;
  cancelDetail: () => void;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type PersonType = {
  [key: string]: any;
};
type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};

const DetailPerson: React.FC<DetailPer> = ({ persId, detailVisible, cancelDetail }) => {
  const [person, setPerson] = useState<PersonType>({});
  const [info, setInfo] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      width: 50,
      render: (_: any, record: any, index: any) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e: any) => e.target.value.trim(),
        rules: [
          {
            pattern: /^(a-z|A-Z|0-9)*[^$%^&*;:,<>?()\""\']{1,20}$/,
            message: '姓名由1-20个字符组成',
          },
        ],
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
      title: '职业类别',
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
  ];

  //房屋详情
  useEffect(() => {
    if (detailVisible) {
      houseDetail({ id: persId })
        .then((res) => {
          console.log(res);
          const data = res.data;
          data.lon = getBit(data?.lon, 10);
          data.lat = getBit(data?.lat, 10);
          setPerson(data);
          if (data?.personInfoVOList?.length > 0) {
            setInfo(data?.personInfoVOList);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persId]);

  return (
    <Drawer
      width={1000}
      title="房屋详情"
      visible={detailVisible}
      onClose={() => {
        cancelDetail();
        setPerson({});
      }}
      closable={true}
    >
      {detailVisible && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基础信息" key="1">
            {detailVisible && (
              <Descriptions
                column={2}
                layout="horizontal"
                labelStyle={{
                  width: '100px',
                  justifyContent: 'right',
                  marginRight: '16px',
                  color: '#666666',
                }}
                contentStyle={{ fontWeight: 'bold', color: '#000000' }}
              >
                <Descriptions.Item label="派出所名称" span={2}>
                  {person.pcsmc}
                </Descriptions.Item>
                <Descriptions.Item label="标准地址" span={2}>
                  {person.address}
                </Descriptions.Item>
                <Descriptions.Item label="派出所代码">{person.pcsdm}</Descriptions.Item>
                <Descriptions.Item label="区域">{person.areaName}</Descriptions.Item>
                <Descriptions.Item label="经度">{person.lon}</Descriptions.Item>
                <Descriptions.Item label="纬度">{person.lat}</Descriptions.Item>
                <Descriptions.Item label="高度">{person.height}</Descriptions.Item>
              </Descriptions>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="人员列表" key="2">
            <ProTable<TableListItem>
              columns={columns}
              tableAlertRender={false}
              request={() => {
                return Promise.resolve({
                  data: info,
                  success: true,
                });
              }}
              rowKey="id"
              options={false}
              pagination={false}
              search={false}
              dateFormatter="string"
            />
          </Tabs.TabPane>
        </Tabs>
      )}
    </Drawer>
  );
};

export default DetailPerson;
