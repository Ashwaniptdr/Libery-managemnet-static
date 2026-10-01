import { useParams } from 'react-router';

export function useParamsId(key: string = 'id') {
  const { [key]: id } = useParams<{ [key: string]: string }>();
  return id ? parseInt(id, 10) : 0;
}
