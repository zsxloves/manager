import React, { useState, useEffect } from 'react';
import Upload from '@/components/Upload';

export interface ImportFile {
  importUrl: string;
  planID: string;
  importVisible: boolean;
  onSub: () => void;
  ok: () => void;
}
const ImportPerson: React.FC<ImportFile> = ({ planID, importVisible, onSub, ok, importUrl }) => {
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>();

  useEffect(() => {
    setName('图标导入');
    setIsUpload(importVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Upload
      accepType=".json,.JSON"
      title={name as string}
      updateModalVisible={isUpload}
      url={importUrl as string}
      planID={planID}
      listId={planID}
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
  );
};

export default ImportPerson;
