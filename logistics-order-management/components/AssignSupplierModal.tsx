import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Order } from '../types';
import { AssignIcon } from './icons/Icons';

interface AssignSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderId: string, supplier: string) => void;
  order: Order;
  suppliers: string[];
}

const AssignSupplierModal: React.FC<AssignSupplierModalProps> = ({ isOpen, onClose, onConfirm, order, suppliers }) => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [newSupplier, setNewSupplier] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedSupplier(suppliers.length > 0 ? suppliers[0] : 'new');
      setNewSupplier('');
    }
  }, [isOpen, suppliers]);

  const handleConfirm = () => {
    const supplierToAssign = selectedSupplier === 'new' ? newSupplier.trim() : selectedSupplier;
    if (order && supplierToAssign) {
      onConfirm(order.id, supplierToAssign);
    } else {
        alert('Vui lòng chọn hoặc nhập một nhà cung cấp.');
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <AssignIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Gán Nhà Cung Cấp
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Chọn một nhà cung cấp cho đơn hàng <span className="font-bold text-gray-700">{order.id}</span> của <span className="font-bold text-gray-700">{order.requester}</span>.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="supplierSelect" className="block text-sm font-medium text-gray-700">Chọn từ danh sách có sẵn</label>
              <select
                id="supplierSelect"
                name="supplierSelect"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="new">-- Thêm mới --</option>
              </select>
            </div>
            {selectedSupplier === 'new' && (
              <div>
                <label htmlFor="newSupplier" className="block text-sm font-medium text-gray-700">Tên nhà cung cấp mới</label>
                <input
                  type="text"
                  id="newSupplier"
                  name="newSupplier"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ví dụ: Nasco Express"
                />
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            onClick={handleConfirm}
          >
            Xác Nhận
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("The element #modal-root was not found");
    return null;
  }

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default AssignSupplierModal;
