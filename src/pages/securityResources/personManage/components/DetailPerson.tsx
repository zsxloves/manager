import React, { useState, useEffect } from 'react';
import { Descriptions, Drawer, message, Tabs } from 'antd';
import { personDetail } from '@/services/securityResources';
import { getBit } from '@/utils/utilsJS';
// import { getSingleOrganizationr } from '@/services/systemManager';

export interface DetailPer {
  persId: string;
  detailVisible: boolean;
  cancelDetail: () => void;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type PersonType = {
  [key: string]: any;
};

const DetailPerson: React.FC<DetailPer> = ({ persId, detailVisible, cancelDetail }) => {
  const [person, setPerson] = useState<PersonType>({});

  //人员详情
  useEffect(() => {
    if (detailVisible) {
      personDetail({ id: persId })
        .then((res) => {
          const data = {
            ...res.data.personInfoVO,
            ...res.data.arObservepersonVO,
            personTypeName: res.data.personInfoVO.personTypeName,
            standardAddress: res.data.personInfoVO.standardAddress,
            nativeAddress: res.data.personInfoVO.nativeAddress,
            posTypeName: res.data.personInfoVO.posTypeName,
            idCardCode: res.data.personInfoVO.idCardCode,
            phoneNumber: res.data.personInfoVO.phoneNumber,
            orgName: res.data.personInfoVO.orgName,
          };
          console.log(data);
          data.lon = getBit(data?.lon, 10);
          data.lat = getBit(data?.lat, 10);
          if (res.code === 200) {
            setPerson(data);
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
      title="人员详情"
      visible={detailVisible}
      onClose={() => {
        cancelDetail();
        setPerson({});
      }}
      closable={true}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          {detailVisible && (
            <Descriptions
              column={2}
              layout="horizontal"
              labelStyle={{
                width: '130px',
                justifyContent: 'right',
                marginRight: '16px',
                color: '#666666',
              }}
              contentStyle={{ fontWeight: 'bold', color: '#000000' }}
            >
              <Descriptions.Item label="名称">{person.name}</Descriptions.Item>
              <Descriptions.Item label="曾用名">{person.alias}</Descriptions.Item>
              <Descriptions.Item label="民族">{person.ethnicity}</Descriptions.Item>
              <Descriptions.Item label="性别">{person.genderName}</Descriptions.Item>
              <Descriptions.Item label="标准地址" span={2}>
                {person.standardAddress}
              </Descriptions.Item>
              <Descriptions.Item label="户籍地址" span={2}>
                {person.nativeAddress}
              </Descriptions.Item>
              <Descriptions.Item label="手机号">{person.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{person.idCardCode}</Descriptions.Item>
              <Descriptions.Item label="类别">{person.posTypeName}</Descriptions.Item>
              <Descriptions.Item label="文化程度">{person.educationName}</Descriptions.Item>
              <Descriptions.Item label="健康状况">{person.health}</Descriptions.Item>
              <Descriptions.Item label="婚姻状况">{person.marriageName}</Descriptions.Item>
              <Descriptions.Item label="政治面貌">{person.partyAffiliationName}</Descriptions.Item>
              <Descriptions.Item label="关联组织机构">{person.orgName}</Descriptions.Item>
              <Descriptions.Item label="人员类别">{person.personTypeName}</Descriptions.Item>
              <Descriptions.Item label="重点分类">{person.personClass}</Descriptions.Item>
              <Descriptions.Item label="管控分级">{person.controlLevel}</Descriptions.Item>
              <Descriptions.Item label="布控情况">{person.controlInfo}</Descriptions.Item>
              <Descriptions.Item label="案件类别">{person.caseType}</Descriptions.Item>
              <Descriptions.Item label="经度">{person.lon}</Descriptions.Item>
              <Descriptions.Item label="纬度">{person.lat}</Descriptions.Item>
              <Descriptions.Item label="最后管控时间">{person.controlTime}</Descriptions.Item>
              <Descriptions.Item label="管控民警">{person.controlName}</Descriptions.Item>
              <Descriptions.Item label="管控民警联系方式" span={2}>
                {person.controlPhone}
              </Descriptions.Item>
              <Descriptions.Item label="同住人" span={2}>
                {person.compoion}
              </Descriptions.Item>
              <Descriptions.Item label="住店时间">{person.enterTime}</Descriptions.Item>
              <Descriptions.Item label="离店时间">{person.leaveTime}</Descriptions.Item>
              <Descriptions.Item label="同住人数量">{person.companionNumber}</Descriptions.Item>
              <Descriptions.Item label="出发地点">{person.departureAdress}</Descriptions.Item>
              <Descriptions.Item label="插入人">{person.inserterName}</Descriptions.Item>
              <Descriptions.Item label="插入时间">{person.insertTime}</Descriptions.Item>
              <Descriptions.Item label="更新人">{person.updaterName}</Descriptions.Item>
              <Descriptions.Item label="更新时间" span={2}>
                {person.updateTime}
              </Descriptions.Item>
              <Descriptions.Item span={2} label="备注">
                {person.remark}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default DetailPerson;
