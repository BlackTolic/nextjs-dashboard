'use client';

import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title = '删除确认' }: DeleteDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p>确定要删除这条投资思考吗？此操作无法撤销。</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            取消
          </Button>
          <Button color="danger" onPress={onConfirm}>
            删除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
