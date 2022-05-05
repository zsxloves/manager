import React, { useState, useEffect } from 'react';
import VideoPlayer from './index';
import './myVideo.less';
//定义props的类型
interface Props {
  viderUrls: string[];
  onCancel: (falg?: boolean) => void;
}

const VideoMore: React.FC<Props> = (props) => {
  const { onCancel, viderUrls } = props;
  const [urlList, setUrlList] = useState<string[]>([]);

  useEffect(() => {
    const list = viderUrls;
    if (list.length < 4 && list.length > 1) {
      for (let i = 0; i < 4 - list.length; i++) {
        list.push('');
      }
    } else if (list.length < 9 && list.length > 4) {
      for (let i = 0; i < 9 - list.length; i++) {
        list.push('');
      }
    } else {
      list.splice(8);
    }
    console.log('海康：', list);
    setUrlList(list);
  }, [viderUrls]);

  return (
    <div className="videoListBox">
      <i className="iconfont icon-guanbi" onClick={() => onCancel()} />
      {urlList.length > 0 &&
        urlList.map((url: string) => (
          <div
            key={url}
            className={`videoItem ${urlList.length <= 4 && urlList.length > 1 ? 'videoItem4' : ''}`}
          >
            {url.length > 0 && <VideoPlayer src={url} />}
          </div>
        ))}
    </div>
  );
};
export default VideoMore;
