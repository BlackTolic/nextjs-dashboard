'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockCode: string;
  stockName: string;
}

export default function StockDetailModal({
  isOpen,
  onClose,
  stockCode,
  stockName,
}: StockDetailModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      股票详情：{stockName}（{stockCode}）
                    </Dialog.Title>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">最新价</p>
                            <p className="text-lg font-semibold">¥25.68</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">涨跌幅</p>
                            <p className="text-lg font-semibold text-green-600">+2.45%</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">成交量</p>
                            <p className="text-lg font-semibold">1234.5万</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">成交额</p>
                            <p className="text-lg font-semibold">3.2亿</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}