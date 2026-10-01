import { nanoid } from 'nanoid';

export function getRandomKey() {
  return nanoid(5);
}
