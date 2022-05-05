import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import Upload from '@/components/Upload';

export interface ImportFile {
  importVisible: boolean;
  handleOk: () => void;
  onSub: () => void;
}

const ImportEarly: React.FC<ImportFile> = ({ importVisible, handleOk, onSub }) => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [exportExcelInfos, setExportExcelInfos] = useState<{ columnName: string }[]>();
  const [url, setUrl] = useState<string>();

  //预警设备
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'typeName' },
    { columnName: 'relatedPersonName' },
    { columnName: 'company' },
    { columnName: 'deviceId' },
    { columnName: 'vedioId' },
    { columnName: 'remark' },
  ];
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            handleOk();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleOk()}>
          保存
        </Button>
      </>
    );
  };
  return (
    <>
      <Modal
        title="导入"
        width={600}
        visible={importVisible}
        onCancel={handleOk}
        footer={renderFooter()}
      >
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
              <Button>
                <a href="/excel/设备管理模板.xlsx">模板下载</a>
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

export default ImportEarly;
