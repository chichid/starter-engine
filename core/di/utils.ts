const CORE_DI_NAMESPACE = "_____core_di";

export function setProperty(target: any, key: string, value: any) {
  const k = getKey(key);
  target[k] = value;
}

export function getProperty(target: any, key: string) {
  const k = getKey(key);
  return target[k];
}

function getKey(key: string) {
  return `${CORE_DI_NAMESPACE}_${key}`;
}