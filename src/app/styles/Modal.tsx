'use client';
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex mt-5 justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-600 rounded-xl text-[20px] w-60 h-12 flex items-center justify-center shadow-[50px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
