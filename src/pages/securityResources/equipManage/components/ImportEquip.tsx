import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import Upload from '@/components/Upload';

export interface ImportFile {
  importVisible: boolean;
  handleOk: () => void;
  onSub: () => void;
}

const ImportEquip: React.FC<ImportFile> = ({ importVisible, handleOk, onSub }) => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [exportExcelInfos, setExportExcelInfos] = useState<{ columnName: string }[]>();
  const [url, setUrl] = useState<string>();

  //装备
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'typeName' },
    { columnName: 'idCardCode' },
    { columnName: 'organizationName' },
    { columnName: 'company' },
    { columnName: 'deviceId' },
    { columnName: 'vedioId' },
    { columnName: 'remark' },
  ];

  return (
    <>
      <Modal title="导入" width={600} visible={importVisible} onOk={handleOk} onCancel={handleOk}>
        <Row>
          <Col span={24}>
            <div>
              <Button
                type="primary"
                style={{ margin: '10px' }}
                onClick={() => {
                  setExportExcelInfos(exportPersonExcelInfos);
                  setUrl('/api/tArGpsDevice/importExcel');
                  setIsUpload(true);
                  setName('装备导入');
                }}
              >
                装备导入
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
          showTemplate={true}
          downloadTemplate={() => {
            const a = document.createElement('a');
            a.href = '/excel/装备管理模板.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        />
      )}
    </>
  );
};

export default ImportEquip;
