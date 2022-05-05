const TokenKey = 'loginId';

const userName = 'login-user';
const loginId = 'login-uid';
const userId = 'login-id';
const avat = 'avatar';
export function getToken(): string {
  return localStorage.getItem(TokenKey) || '';
}

export function setToken(token: string) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.remove(TokenKey);
}

export function getUserName(): string {
  return localStorage.getItem(userName) || '';
}

export function setUserName(name: string) {
  return localStorage.setItem(userName, name);
}

export function removeUserName() {
  return localStorage.removeItem(userName);
}

export function getUserId(): string {
  return localStorage.getItem(userId) || '';
}

export function setUserId(id: string) {
  return localStorage.setItem(userId, id);
}

export function removeUserId() {
  return localStorage.removeItem(userId);
}
export function setAvatar(avatar: string) {
  return localStorage.setItem(avat, avatar);
}

export function getAvatar(): string {
  return localStorage.getItem(avat) || '';
}
export function getLoginId() {
  return localStorage.getItem(loginId);
}

export function setLoginId(name: string) {
  return localStorage.setItem(loginId, name);
}
