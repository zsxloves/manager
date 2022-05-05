import { useState, useEffect } from 'react';
import { getTypeListAll } from '../services/iconManage';
export function useIconType(code: string) {
  const [list, setList] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getTypeListAll(code).then((res) => {
      setList(res.result.result);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { list, loading };
}
