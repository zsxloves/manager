import { message } from 'antd';
import { getOrg } from '@/services/activeManager/index';
import request from 'umi-request';
import { useState, useEffect } from 'react';
function useOrg() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getOrg().then((res) => {
      setLoading(false);
      setList(res.data);
    });
  }, []);
  return { list, loading };
}
export default useOrg;

export function useGetDictionaryByCode(parentId: string) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    request('/api/dictionary/findAll', {
      method: 'POST',
      data: { parentId },
    })
      .then((res) => {
        setLoading(false);
        setList(res.result.result);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.message);
      });
  }, []);

  return { list, loading };
}
