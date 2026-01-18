import React from "react";
import ModalWrapper from "./ModalWrapper";

const AlertModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper title="系統訊息" onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center py-4">
        <p className="font-bold text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </ModalWrapper>
  );
};

export default AlertModal;