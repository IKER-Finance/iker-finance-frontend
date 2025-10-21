import { useState } from 'react';

export const useConfirmDialog = (onConfirm, onReject) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const show = (confirmData = null) => {
    setData(confirmData);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    setData(null);
    setLoading(false);
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      await onConfirm(data);
      hide();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(data);
    }
    hide();
  };

  return {
    visible,
    data,
    loading,
    show,
    hide,
    handleAccept,
    handleReject,
  };
};
