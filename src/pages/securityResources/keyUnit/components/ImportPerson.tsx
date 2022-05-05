import React, { useState } from 'react';
import Upload from '@/components/Upload';
import { Button, Col, Modal, Row } from 'antd';
import styles from './index.less';
export interface ImportFile {
  importVisible: boolean;
  onSub: () => void;
  ok: () => void;
}

const ImportPerson: React.FC<ImportFile> = ({ importVisible, onSub, ok }) => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [exportExcelInfos, setExportExcelInfos] = useState<{ columnName: string }[]>();
  const [url, setUrl] = useState<string>();
  const [typeNum, setTypeNum] = useState<number>(0);

  //重点单位
  const exportKeyUnitExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'remark' },
    { columnName: 'standardAddress' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'abbreviation' },
    { columnName: 'corporation' },
    { columnName: 'status' },
    { columnName: 'uscc' },
    { columnName: 'contacts' },
    { columnName: 'contactNo' },
    { columnName: 'orgName' },
    { columnName: 'securityContacts' },
    { columnName: 'securityContactno' },
    { columnName: 'unitTypeName' },
    { columnName: 'dangerName' },
    { columnName: 'num' },
    { columnName: 'measures' },
    { columnName: 'road' },
    { columnName: 'area' },
  ];
  //制高点
  const exportZGDExcelInfos: { columnName: string }[] = [
    { columnName: 'standardAddress' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'distence' },
    { columnName: 'distenceType' },
    { columnName: 'orgName' },
    { columnName: 'area' },
  ];
  //重点单位名册表
  // const exportzddwmcb: { columnName: string }[] = [
  //   { columnName: 'name' },
  //   { columnName: 'contacts' },
  //   { columnName: 'contactNo' },
  //   { columnName: 'dangerName' },
  //   { columnName: 'standardAddress' },
  //   { columnName: 'type' },
  //   { columnName: 'num' },
  //   { columnName: 'measures' },
  //   { columnName: 'orgName' },
  //   { columnName: 'road' },
  //   { columnName: 'area' },
  //   { columnName: 'remark' },
  // ];
  //工地采集
  const exportgdcj: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'contacts' },
    { columnName: 'contactNo' },
    { columnName: 'standardAddress' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'roadNum' },
    { columnName: 'checkNum' },
    { columnName: 'unit' },
    { columnName: 'securityContacts' },
    { columnName: 'securityContactno' },
    { columnName: 'orgName' },
    { columnName: 'road' },
    { columnName: 'area' },
    { columnName: 'remark' },
  ];
  //交叉路口
  const exportjclk: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'type' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'roadNum' },
    { columnName: 'isLight' },
    { columnName: 'isLimit' },
    { columnName: 'isCarLimit' },
    { columnName: 'isLine' },
    { columnName: 'standardAddress' },
    { columnName: 'orgName' },
    { columnName: 'road' },
    { columnName: 'area' },
    { columnName: 'remark' },
  ];
  //公交车
  const exportgjcz: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'standardAddress' },
    { columnName: 'storeAddress' },
    { columnName: 'line' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'orgName' },
    { columnName: 'road' },
    { columnName: 'area' },
  ];
  //上跨桥
  const exportskq: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'standardAddress' },
    { columnName: 'type' },
    { columnName: 'length' },
    { columnName: 'width' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'area' },
    { columnName: 'remark' },
  ];
  //涵洞桥梁
  const exporthdqlgj: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'standardAddress' },
    { columnName: 'type' },
    { columnName: 'length' },
    { columnName: 'width' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
    { columnName: 'orgName' },
    { columnName: 'road' },
    { columnName: 'area' },
    { columnName: 'remark' },
  ];

  return (
    <>
      <Modal
        title="导入"
        width={600}
        visible={importVisible}
        maskClosable={false}
        onOk={ok}
        onCancel={ok}
        className={styles.importModal}
      >
        <Row>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportskq);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('上跨桥导入');
                  setTypeNum(5);
                }}
              >
                上跨桥导入
              </Button>
              <Button>
                <a href="/excel/上跨桥模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportZGDExcelInfos);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('制高点导入');
                  setTypeNum(7);
                }}
              >
                制高点导入
              </Button>
              <Button>
                <a href="/excel/制高点模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportgdcj);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('工地采集导入');
                  setTypeNum(2);
                }}
              >
                工地采集导入
              </Button>
              <Button>
                <a href="/excel/工地采集模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportjclk);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('交叉路口导入');
                  setTypeNum(3);
                }}
              >
                交叉路口导入
              </Button>
              <Button>
                <a href="/excel/交叉路口模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportgjcz);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('公交车站导入');
                  setTypeNum(4);
                }}
              >
                公交车站导入
              </Button>
              <Button>
                <a href="/excel/公交车站模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportKeyUnitExcelInfos);
                  setUrl('/api/arCompany/importExcel');
                  setName('重点单位导入');
                  setIsUpload(importVisible);
                  setTypeNum(0);
                }}
              >
                重点单位导入
              </Button>
              <Button>
                <a href="/excel/重点单位模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exporthdqlgj);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('涵洞桥梁高架导入');
                  setTypeNum(6);
                }}
              >
                涵洞桥梁导入
              </Button>
              <Button>
                <a href="/excel/涵洞桥梁高架模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          {/* <Col span={12}>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '20px', marginBottom: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportzddwmcb);
                  setUrl('/api/arCompany/importExcelCanNull');
                  setIsUpload(true);
                  setName('重点单位名册导入');
                  setTypeNum(1);
                }}
              >
                重点单位名册导入
              </Button>
              <Button>
                <a href="/excel/重点单位名册模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col> */}
        </Row>
      </Modal>
      {isUpload && (
        <Upload
          title={name as string}
          updateModalVisible={isUpload}
          url={url as string}
          num={typeNum}
          exportExcelHeaderInfos={exportExcelInfos as { columnName: string }[]}
          onSubmit={() => {
            onSub();
            setIsUpload(false);
          }}
          onCancel={() => {
            setIsUpload(false);
          }}
        />
      )}
    </>
  );
};

export default ImportPerson;
