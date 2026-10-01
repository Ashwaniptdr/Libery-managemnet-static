declare namespace Data {
  interface DataItem<T = number> {
    id: T;
    text: string;
  }

  type WithId<T, TKey extends string = 'id', TId = number> = {
    [K in TKey]: TId;
  } & T;
}
