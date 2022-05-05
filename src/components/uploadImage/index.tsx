import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';

export interface IProps {
  // eslint-disable-next-line @typescript-eslint/type-annotation-spacing
  fileList: IListItem[];
  // eslint-disable-next-line @typescript-eslint/type-annotation-spacing
  onChange: (res: any) => void;
  limit: string | number;
  maxCount?: number;
  visble?: boolean;
  imgLength?: number;
}
interface IListItem {
  url: string;
}
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const UploadImage: React.FC<IProps> = (props) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const count = useRef(0);
  const maxCount = props.maxCount || 1;
  const handleChange = (file: any) => {
    setFileList(file.fileList);
    props.onChange(file.fileList);
  };
  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  useEffect(() => {
    setFileList(props.fileList);
    // if (props.fileList.length === maxCount - 1) {
    //   message.warning('已到达最大上传数量');
    // }
  }, [props.fileList]);

  return (
    <>
      <Upload
        action="#"
        listType="picture-card"
        fileList={fileList}
        accept="image/*"
        beforeUpload={(file, fileLists) => {
          if (file.size > props.limit) {
            message.error('文件过大，请重新选择');
            return Upload.LIST_IGNORE;
          }
          if ((props.imgLength as number) + fileLists.length >= maxCount) {
            if (file.uid === fileLists[0].uid) {
              message.warning(`最多上传${maxCount - 1}张图片`);
            }
            return Upload.LIST_IGNORE;
          }
          if (fileLists.length >= maxCount) {
            if (count.current === maxCount - 1) {
              message.error(`图片数量超出${maxCount - 1}张，请重新选择`);
            }
            count.current++;
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
        maxCount={(props.maxCount as number) - 1}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple
      >
        {/* {uploadButton} */}
        {props.visble ? uploadButton : fileList.length >= maxCount - 1 ? null : uploadButton}
      </Upload>

      {previewVisible && (
        <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      )}
    </>
  );
};
UploadImage.defaultProps = {
  fileList: [],
  maxCount: 1,
};

export default UploadImage;
