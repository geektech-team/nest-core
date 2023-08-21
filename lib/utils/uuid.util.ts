import { v4 } from 'uuid';

export const getUuid = () => {
  const uuid = v4();
  return uuid.replace(/-/g, '');
};
