import React, { useState, useEffect } from 'react';
import Upload from '@/components/Upload';

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

  //人员
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'directions' },
    { columnName: 'devChnId' },
    { columnName: 'lon' },
    { columnName: 'lat' },
  ];

  useEffect(() => {
    setExportExcelInfos(exportPersonExcelInfos);
    setUrl('/api/arVias/importExcel');
    setName('卡口导入');
    setIsUpload(importVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Upload
        showTemplate={true}
        downloadTemplate={() => {
          const a = document.createElement('a');
          a.href = '/excel/卡口导入模板.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
        title={name as string}
        updateModalVisible={isUpload}
        url={url as string}
        exportExcelHeaderInfos={exportExcelInfos as { columnName: string }[]}
        onSubmit={() => {
          onSub();
          setIsUpload(false);
          ok();
        }}
        onCancel={() => {
          setIsUpload(false);
          ok();
        }}
      />
    </>
  );
};

export default ImportPerson;
