/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const authority = currentUser?.authority || [];
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    normalRouteFilter: (route: any) => authority.some((item) => route.authority.includes(item)),
    btnHasAuthority: (key: string) => authority.includes(key),
  };
}
