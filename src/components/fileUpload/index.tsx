import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import styles from './index.less';
import { uploadFiles } from '@/services/systemManager';
import IconFont from '@/components/IconFont/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface UpdateFormProps {
  onSubmit: (values: any) => void;
  fileMax: number;
  imgMax: number;
  videoMax: number;
  showFlgFile: boolean;
  showFlgImg: boolean;
  showFlgVideo: boolean;
  isDetail: boolean;
  appendixList: any[];
}
const UploadModel: React.FC<UpdateFormProps> = (props) => {
  const {
    onSubmit: handleUpload,
    fileMax,
    imgMax,
    videoMax,
    showFlgFile,
    showFlgImg,
    showFlgVideo,
    isDetail,
    appendixList,
  } = props;
  const [accept, setAccept] = useState<any>([]);
  const [appendixIdList, setAppendixIdList] = useState<any>([]);
  const [deleteList, setDeleteList] = useState<any>([]);
  const [filesList, setFilesList] = useState<any>([]);
  const [docList, setDoc] = useState<any>([]);
  const [imageList, setImg] = useState<any>([]);
  const [videoList, setVideo] = useState<any>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [showItem, setShowItem] = useState<any>({});
  const [isShowUp, setIsShowUp] = useState<boolean>(true);
  const [timer, setTimer] = useState<any>(null);
  const [fileNameList, setFileName] = useState<any>([]);
  const [connId] = useState<string>('');
  const [upLen, setLen] = useState<number>(0);
  const [upIndex, setIndex] = useState<number>(0);
  const [showIndex, setShowIndex] = useState<any>(null);
  const docType = ['.xlsx', '.xls', '.docx', '.pdf', '.XLSX', '.XLS', '.DOCX', '.PDF'];
  const videoType = ['.avi', '.mp4', '.AVI', '.MP4'];
  const imgType = ['.jpg', '.jpeg', '.png', '.bmp', '.JPG', '.JPEG', '.PNG', '.BMP'];
  const filesUpload = () => {
    setIsShowUp(true);
    if (timer) {
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        const a = document.getElementById('uploadfiles');
        // tslint:disable-next-line
        a?.click();
      }, 0),
    );
  };
  const fileLists: any[] = [];
  const fileNameLists: any[] = [];
  const appendixIdLists: any[] = [];
  const setDeleteLists: any[] = [];
  const docLists: any[] = [];
  const imageLists: any[] = [];
  const videoLists: any[] = [];
  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };
  // ????????????
  const filterType = (arr: any[]) => {
    if (!arr.length) {
      return [];
    }
    const list = arr.map((val: any) => {
      const item = val;
      const typeName = item.appendixName.substring(
        item.appendixName.lastIndexOf('.') + 1,
        item.appendixName.length,
      );
      if (typeName === 'docx' || typeName === 'DOCX') {
        item.fileType = 'icon-doc';
      } else if (
        typeName === 'xls' ||
        typeName === 'xlsx' ||
        typeName === 'XLS' ||
        typeName === 'XLSX'
      ) {
        item.fileType = 'icon-xls';
      } else if (typeName === 'pdf' || typeName === 'PDF') {
        item.fileType = 'icon-pdf';
      } else {
        item.fileType = 'icon-weizhi';
      }
      return item;
    });
    return list;
  };
  const fileChange = (targets: any) => {
    const index1 = targets.name.lastIndexOf('.') - 1;
    const index2 = targets.name.length;
    const suffix = targets.name.substring(index1 + 1, index2);
    let type: string | Blob = '-1';
    if (docType.includes(suffix)) {
      type = '0';
    }
    if (imgType.includes(suffix)) {
      type = '1';
    }
    if (videoType.includes(suffix)) {
      type = '2';
    }
    const files = targets; // ??????????????????
    const myform = new FormData();
    const fileName = targets.name;
    const extendName = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (type === '0') {
      if (
        !(
          extendName === 'xlsx' ||
          extendName === 'docx' ||
          extendName === 'xls' ||
          extendName === 'pdf' ||
          extendName === 'XLSX' ||
          extendName === 'DOCX' ||
          extendName === 'XLS' ||
          extendName === 'PDF'
        )
      ) {
        message.error('?????????????????????????????????xlsx,docx,xls,pdf???');
        return;
      }
    } else if (type === '1') {
      if (
        !(
          extendName === 'jpg' ||
          extendName === 'jpeg' ||
          extendName === 'png' ||
          extendName === 'bmp' ||
          extendName === 'JPG' ||
          extendName === 'JPEG' ||
          extendName === 'PNG' ||
          extendName === 'BMP'
        )
      ) {
        message.error('?????????????????????????????????jpg,jpeg,png,bmp???');
        return;
      }
    } else if (type === '2') {
      if (
        !(
          extendName === 'avi' ||
          extendName === 'mp4' ||
          extendName === 'AVI' ||
          extendName === 'MP4'
        )
      ) {
        message.error('?????????????????????????????????avi,mp4???');
        return;
      }
    }
    const newName = files.name;
    let sameFile = [];
    if (fileNameList.length > 0) {
      sameFile = fileNameList.filter((item: any) => {
        return newName === item.name;
      });
    }
    if (sameFile.length > 0) {
      message.warning('??????????????????');
      return;
    }
    // let newName = files.name.substring(0, files.name.lastIndexOf('.')) + '_' + conForm.id + files.name.substring(files.name.lastIndexOf('.'))
    const renameReportFile = new Blob([files]);
    // file.forEach((item: any)=>{
    //   formData.append('files', item.originFileObj,item.name);
    // })
    myform.append('file', renameReportFile, newName);
    if (type === '1') {
      myform.append('attCode', '100'); // ???????????????
    } else {
      myform.append('attCode', '600'); // ???????????????
    }
    myform.append('type', type); //   1?????? 0?????? 2??????
    if (!!connId && connId !== '') {
      myform.append('connId', connId);
    }

    uploadFiles(myform)
      .then((res) => res.json())
      .then((res) => {
        // targets.val('')
        myform.delete('file');
        let index: number = upIndex;
        setIndex((index += 1));
        if (res.code === 200) {
          fileNameLists.push({ name: newName });
          setFileName(fileNameList.concat(fileNameLists));
          if (res.data !== '' || res.data !== null) {
            fileLists.push(res.data);
            appendixIdLists.push(res.data.id);
            setFilesList(filesList.concat(filterType(fileLists)));
            if (res.data.type === '0') {
              docLists.push(res.data);
              setDoc(docList.concat(docLists));
            }
            if (res.data.type === '1') {
              imageLists.push(res.data);
              setImg(imageList.concat(imageLists));
            }
            if (res.data.type === '2') {
              videoLists.push(res.data);
              setVideo(videoList.concat(videoLists));
            }
            setAppendixIdList(appendixIdList.concat(appendixIdLists));
            setDeleteLists.push([
              {
                id: res.data.id,
                appendixPath: res.data.appendixPath,
              },
            ]);
            setDeleteList(deleteList.concat(setDeleteLists));
            if (upIndex === upLen) {
              message.success('????????????');
            }
            // for (const key of myform.keys()) {
            //   myform.delete(key)
            // }
            handleUpload(appendixIdList.concat(appendixIdLists));
          }
        } else {
          message.error(res.msg || res);
        }
      })
      .catch((res: any) => {
        let index: number = upIndex;
        setIndex((index += 1));
        // targets.val('');
        myform.delete('file');
        message.error(res.msg || res);
      });
  };
  const getFilesChange = (val: any) => {
    setIsShowUp(false);
    const arr = Array.prototype.slice.call(val.target.files);
    const img = [];
    const video = [];
    const doc = [];
    let isSize: boolean = false;
    let isVideoSize: boolean = false;
    setLen(arr.length);
    setIndex(0);
    arr.map((i: any) => {
      // ????????????
      let suffix = '';
      const index1 = i.name.lastIndexOf('.') - 1;
      const index2 = i.name.length;
      suffix = i.name.substring(index1 + 1, index2);
      if (docType.includes(suffix)) {
        if (i.size / 1024 / 1024 > 20) {
          isSize = true;
        }
        doc.push(i);
      }
      if (imgType.includes(suffix)) {
        if (i.size / 1024 / 1024 > 20) {
          isSize = true;
        }
        img.push(i);
      }
      if (videoType.includes(suffix)) {
        if (i.size / 1024 / 1024 > 100) {
          isVideoSize = true;
        }
        video.push(i);
      }
      return i;
    });
    if (doc.length + docList.length > fileMax) {
      message.warning(`????????????${fileMax}?????????`);
      return;
    }
    if (img.length + imageList.length > imgMax) {
      message.warning(`????????????${imgMax}?????????`);
      return;
    }
    if (video.length + videoList.length > videoMax) {
      message.warning(`????????????${videoMax}?????????`);
      return;
    }
    if (isVideoSize) {
      message.error('??????????????????100M?????????????????????????????????');
      return;
    }
    if (isSize) {
      message.error('??????????????????20M?????????????????????????????????');
      return;
    }
    arr.forEach((noc: any) => {
      fileChange(noc);
    });
  };
  // ????????????
  const delAppendInfo = (del: any) => {
    const newName = del.appendixName;
    const arr = fileNameList.filter((val: any) => {
      return val.name !== newName;
    });
    setFileName(arr);
    const arr1 = docList.filter((val: any) => val.id !== del.id);
    setDoc(arr1);
    const arr2 = imageList.filter((val: any) => val.id !== del.id);
    setImg(arr2);
    const arr3 = videoList.filter((val: any) => val.id !== del.id);
    setVideo(arr3);
    const newArr = filesList.filter((val: any) => val.id !== del.id);
    setFilesList(filterType(newArr));
    const newArr2 = appendixIdList.filter((val: any) => val !== del.id);
    setAppendixIdList(newArr2);
    const newArr3 = deleteList.filter((val: any) => val.id !== del.id);
    setDeleteList(newArr3);
    handleUpload(newArr2);
  };
  useEffect(() => {
    let arr: any = [];
    const arr2: any = [];
    const arr3: any = [];
    const arr4: any = [];
    const arr5: any = [];
    if (showFlgVideo) {
      arr = arr.concat(videoType);
    }
    if (showFlgFile) {
      arr = arr.concat(docType);
    }
    if (showFlgImg) {
      arr = arr.concat(imgType);
    }
    setAccept(arr.join(','));
    if (Array.isArray(appendixList) && appendixList.length) {
      const echoAffix = appendixList;
      const ids: any = [];
      setFilesList(filterType(echoAffix));
      echoAffix.forEach((item: any) => {
        arr5.push({ name: item.appendixName });
        if (item.type === '0') {
          arr2.push(item);
        } else if (item.type === '1') {
          arr3.push(item);
        } else if (item.type === '2') {
          arr4.push(item);
        }
        ids.push(item.id);
      });
      setDoc(docList.concat(arr2));
      setImg(imageList.concat(arr3));
      setVideo(videoList.concat(arr4));
      setFileName(fileNameList.concat(arr5));
      setAppendixIdList(ids);
      handleUpload(ids);
      setDeleteList(echoAffix);
    }
  }, [appendixList]);
  return (
    <div className={styles.uploadFile}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filesList.map((item: any, index: any) => (
          <div key={index} className={styles.uploadDiv}>
            <div
              className={styles.uploadShow}
              onMouseOver={() => {
                setShowIndex(index);
              }}
              onMouseLeave={() => {
                setShowIndex(null);
              }}
            >
              {showIndex === index && (
                <div className={styles.handel}>
                  <IconFont
                    onClick={() => {
                      if (item.type === '1') {
                        setShowItem(item);
                        setIsShow(true);
                      } else {
                        download(item.appendixPath, item.appendixName);
                      }
                    }}
                    className={styles.avataIcon}
                    type={item.type === '1' ? 'icon-yulan' : 'icon-xiazai'}
                    style={{ fontSize: '16px', verticalAlign: 'bottom', color: '#ffffff' }}
                  />
                  {!isDetail && (
                    <IconFont
                      className={styles.avataIcon}
                      type={'icon-shanchu'}
                      onClick={() => {
                        Modal.confirm({
                          title: '????????????',
                          icon: <ExclamationCircleOutlined />,
                          content: '?????????????????????',
                          okText: '??????',
                          cancelText: '??????',
                          onCancel: (close) => {
                            close();
                          },
                          onOk: async (close) => {
                            delAppendInfo(item);
                            close();
                          },
                        });
                      }}
                      style={{ fontSize: '16px', verticalAlign: 'bottom', color: '#ffffff' }}
                    />
                  )}
                </div>
              )}
              {item.type === '0' && (
                <IconFont
                  className={styles.avataFile}
                  type={item.fileType}
                  style={{ fontSize: '56px', verticalAlign: 'bottom', color: '#D5D5D5' }}
                />
              )}
              {item.type === '1' && <img className={styles.avatarImg} src={item.appendixPath} />}
              {item.type === '2' && (
                <IconFont
                  className={styles.avataFile}
                  type={'icon-shipin'}
                  style={{ fontSize: '56px', verticalAlign: 'bottom', color: '#D5D5D5' }}
                />
              )}
            </div>
            <div className={styles.uploadTitle} title={item.appendixName}>
              {item.appendixName}
            </div>
          </div>
        ))}
        {!isDetail && (
          <div className={styles.uploadDiv}>
            <div className={styles.uploadIcon} onClick={filesUpload}>
              <IconFont
                type={'icon-tianjia'}
                style={{ fontSize: '56px', verticalAlign: 'bottom' }}
              />
            </div>
            <div className={styles.uploadTitle}>????????????</div>
          </div>
        )}
      </div>
      {isShowUp && (
        <input
          id="uploadfiles"
          type="file"
          multiple
          style={{ display: 'none' }}
          accept={accept}
          onChange={getFilesChange}
        />
      )}
      <Modal
        title="??????"
        width={1000}
        maskClosable
        footer={null}
        visible={isShow}
        onCancel={() => setIsShow(false)}
      >
        <img className={styles.showImg} src={showItem.appendixPath} />
      </Modal>
    </div>
  );
};
export default UploadModel;
