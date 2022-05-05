import React, { useState, useRef } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import upload from '@/assets/img/upload.png';
import errIcon from '@/assets/img/errIcon.png';
import styles from './index.less';

const { Dragger } = Upload;
export interface FormValueType extends Partial<any> {
  url?: string;
  // headers: any;
  // param: any;
}
export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  exportExcelHeaderInfos?: { columnName: string }[];
  url: string;
  num?: number;
  title: string;
  // headers: any;
  // param: any;
  showTemplate?: boolean;
  downloadTemplate?: () => void;
  className?: string;
  planID?: string;
  listId?: string;
  accepType?: string; //自定义上传格式
}

const UploadModel: React.FC<UpdateFormProps> = (props: any) => {
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    url,
    num,
    updateModalVisible,
    title,
    // headers,
    // param,
    exportExcelHeaderInfos: exportExcelInfos,
    showTemplate,
    downloadTemplate,
    className,
    planID,
    listId,
    accepType,
  } = props;

  const type: any = useRef(accepType || '.xlsx,.xls,.XLSX,.XLS');
  const [fileData, setFileData] = useState<any>({});
  const [errFileDown, setErrFileDown] = useState<any>();
  const [isShowErr, setShowErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const confirm = async () => {
    const formData = new FormData();
    if (!fileData.name) {
      message.warning('请选择需要文件');
      return;
    }
    formData.append('file', fileData);
    if (planID) {
      // 预案
      formData.append('planId', planID);
      formData.append('planID', planID);
    }
    if (listId) {
      // 图层图元
      formData.append('listId', planID);
    }
    if (num) formData.append('dataType', num);
    if (Array.isArray(exportExcelInfos) && exportExcelInfos.length > 0) {
      for (let i = 0; i < exportExcelInfos.length; i++) {
        formData.append(`exportExcelInfos[${i}].columnName`, exportExcelInfos[i].columnName);
      }
    }
    setLoading(true);
    fetch(url, {
      method: 'post',
      headers: {
        Authorization: localStorage.getItem('loginId') || '',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res: any) => {
        if (res.code === 200) {
          handleUpdate(res.data);
          message.success('文件导入成功');
        } else {
          setFileData({});
          message.error(res.message);
        }
        if (res) {
          if (typeof res.data === 'string' && res.data.constructor === String) {
            setShowErr(true);
            setErrFileDown(res.data);
            setFileData({});
          }
        }
        setLoading(false);
      })
      .catch((res) => {
        setFileData({});
        message.error(res.message);
        if (res) {
          if (typeof res.data === 'string' && res.data.constructor === String) {
            setShowErr(true);
            setErrFileDown(res.data);
            setFileData({});
          }
        }
        setLoading(false);
      });
  };
  // 下载失败文件
  const download = () => {
    const a: any = document.getElementById('downFile');
    a.href = errFileDown;
    a?.click();
    setShowErr(false);
    setFileData({});
    setErrFileDown('');
  };
  const renderFooter = () => {
    return (
      <div className={styles.modelfooter}>
        {showTemplate ? (
          <Button
            onClick={() => {
              downloadTemplate();
            }}
          >
            模板下载
          </Button>
        ) : (
          ''
        )}
        <Button
          onClick={() => {
            handleUpdateModalVisible(false);
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          loading={loading}
        >
          确定
        </Button>
      </div>
    );
  };
  return (
    <Modal
      width={600}
      bodyStyle={{ padding: '32px 40px 48px', position: 'relative' }}
      destroyOnClose
      maskClosable={false}
      title={title}
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
      className={className}
    >
      <Dragger
        className={styles.drag}
        // ? accepType : ".xlsx,.xls,.XLSX,.XLS"
        accept={type.current}
        maxCount={1}
        fileList={fileData.name ? [fileData] : []}
        beforeUpload={(info: any) => {
          setShowErr(false);
          setFileData(info);
          return false;
        }}
        onRemove={() => {
          setFileData({});
        }}
      >
        <div className={styles.main}>
          <div>
            <img className={styles.icon} src={upload} alt="" />
            <div className={styles.title}>点击或拖拽至此处上传</div>
          </div>
        </div>
      </Dragger>
      <a
        style={{ display: 'none' }}
        download={`上传失败文件.xlsx`}
        id="downFile"
        href={errFileDown}
      />
      {isShowErr && (
        <div className={styles.error} onClick={download}>
          <div className={styles.title} style={{ color: '#F23C1F' }}>
            <img className={styles.icon} src={errIcon} />
            文件导入失败
          </div>
          <div className={styles.title} style={{ color: '#1786F9', cursor: 'pointer' }}>
            点击下载失败文件
          </div>
        </div>
      )}
    </Modal>
  );
};
UploadModel.defaultProps = {
  showTemplate: false,
  downloadTemplate: () => {},
  className: '',
};
export default UploadModel;
