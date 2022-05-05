import React, { useState, useEffect } from 'react';
import Upload from '@/components/Upload';

export interface ImportFile {
  planID: any;
  importVisible: boolean;
  onSub: () => void;
  ok: () => void;
  importUrl: any;
}

const ImportPerson: React.FC<ImportFile> = ({ importVisible, onSub, ok, importUrl, planID }) => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    setUrl(importUrl);
    setName('标记信息导入');
    setIsUpload(importVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Upload
        planID={planID}
        listId={planID}
        showTemplate={true}
        downloadTemplate={() => {
          const a = document.createElement('a');
          a.href = '/excel/标记信息模板.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
        title={name as string}
        updateModalVisible={isUpload}
        url={url as string}
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
