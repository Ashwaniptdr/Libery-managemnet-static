import { useState } from 'react';

export function useModal(value: boolean = false) {
  const [visible, setVisible] = useState(value);

  return {
    modalVisible: visible,
    toggleModal: () => setVisible(!visible),
  };
}
