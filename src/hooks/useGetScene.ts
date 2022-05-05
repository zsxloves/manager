import { getSceneList } from '@/services/sceneManage/index';
import { message } from 'antd';
import { useState, useEffect } from 'react';
function useOrg() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getSceneList({
      queryObject: {
        page: 0,
        size: 2 ** 10,
      },
    })
      .then((res) => {
        setLoading(false);
        if (res.result.page?.content?.length > 0) {
          setList(res.result.page.content || []);
          console.log(res.result.page.content);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);
  return { list, loading };
}
export default useOrg;
