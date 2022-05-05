import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import Upload from '@/components/Upload';
import styles from './import.less';

export interface ImportFile {
  importVisible: boolean;
  handleOk: () => void;
  onSub: () => void;
}

const ImportPerson: React.FC<ImportFile> = ({ importVisible, handleOk, onSub }) => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [exportExcelInfos, setExportExcelInfos] = useState<{ columnName: string }[]>();
  const [url, setUrl] = useState<string>();

  //人员
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'idCardCode' },
    { columnName: 'name' },
    { columnName: 'phoneNumber' },
    { columnName: 'age' },
    { columnName: 'gender' },
    { columnName: 'alias' },
    { columnName: 'ethnicity' },
    { columnName: 'nativeAddress' },
    { columnName: 'standardAddress' },
    { columnName: 'personTypeName' },
    { columnName: 'posTypeName' },
    { columnName: 'orgName' },
  ];
  //重点人员
  const exportKeyExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'idCardCode' },
    { columnName: 'personTypeName' },
    { columnName: 'phoneNumber' },
    { columnName: 'nativeAddress' },
    { columnName: 'standardAddress' },
    { columnName: 'controlTime' },
    { columnName: 'controlTimeByPer' },
    { columnName: 'personClass' },
    { columnName: 'controlLevel' },
    { columnName: 'controlInfo' },
    { columnName: 'caseType' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'orgName' },
  ];
  //住店人员
  const exportCompoionExcelInfos: { columnName: string }[] = [
    { columnName: 'idCardCode' },
    { columnName: 'name' },
    { columnName: 'age' },
    { columnName: 'genderName' },
    { columnName: 'alias' },
    { columnName: 'ethnicity' },
    { columnName: 'nativeAddress' },
    { columnName: 'standardAddress' },
    { columnName: 'personTypeName' },
    { columnName: 'orgName' },
    { columnName: 'educationName' },
    { columnName: 'health' },
    { columnName: 'marriageName' },
    { columnName: 'partyAffiliationName' },
    { columnName: 'compoion' },
    { columnName: 'companionNumber' },
    { columnName: 'departureAdress' },
    { columnName: 'enterTime' },
    { columnName: 'leaveTime' },
  ];

  return (
    <>
      <Modal
        title="导入"
        width={600}
        visible={importVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <Row className={styles.box}>
          <Col span={12}>
            <div className={styles.person}>
              <Button
                type="primary"
                onClick={() => {
                  setExportExcelInfos(exportPersonExcelInfos);
                  setUrl('/api/person/info/importExcel');
                  setIsUpload(true);
                  setName('人员导入');
                }}
              >
                人员导入
              </Button>
              <Button>
                <a href="/excel/人员管理模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.keyPerson}>
              <Button
                type="primary"
                onClick={() => {
                  setExportExcelInfos(exportKeyExcelInfos);
                  setUrl('/api/arObserveperson/importExcel');
                  setIsUpload(true);
                  setName('重点人员导入');
                }}
              >
                重点人员导入
              </Button>
              <Button>
                <a href="/excel/重点人员管理模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.keyPerson}>
              <Button
                type="primary"
                onClick={() => {
                  setExportExcelInfos(exportCompoionExcelInfos);
                  setUrl('/api/arPersonHotel/importExcel');
                  setIsUpload(true);
                  setName('住店人员导入');
                }}
              >
                住店人员导入
              </Button>
              <Button>
                <a href="/excel/住店人员管理模板.xlsx">模板下载</a>
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
      {isUpload && (
        <Upload
          title={name as string}
          updateModalVisible={isUpload}
          url={url as string}
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
