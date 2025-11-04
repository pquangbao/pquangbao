import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User } from '../types';
import { EditIcon } from './icons/Icons';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'address'>>) => boolean;
  user: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name,
        email: user.email,
        address: user.address || '',
      });
    }
  }, [isOpen, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleConfirm = () => {
    if (formData.name.trim() === '' || formData.email.trim() === '') {
        alert('Tên và Email không được để trống.');
        return;
    }
    onConfirm(user.id, {
        name: formData.name,
        email: formData.email,
        address: formData.address,
    });
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
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <EditIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Chỉnh Sửa Thông Tin Người Dùng
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Cập nhật thông tin cho <span className="font-bold text-gray-700">{user.name}</span> (ID: {user.id}).
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
              <input
                type="text"
                id="userName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
             <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <input
                type="email"
                id="userEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <input
                type="text"
                id="userAddress"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            onClick={handleConfirm}
          >
            Lưu Thay Đổi
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

export default EditUserModal;