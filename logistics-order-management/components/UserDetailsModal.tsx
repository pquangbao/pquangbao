import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User } from '../types';
import { UsersIcon } from './icons/Icons';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
    </div>
);


const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

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
              <UsersIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Chi Tiết Người Dùng
              </h3>
               <p className="text-sm text-gray-500">{user.name}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200">
             <dl className="divide-y divide-gray-200">
                <DetailItem label="ID Người Dùng" value={<span className="font-mono">{user.id}</span>} />
                <DetailItem label="Họ và Tên" value={user.name} />
                <DetailItem label="Email" value={<a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>} />
                <DetailItem label="Địa chỉ" value={user.address} />
                <DetailItem label="Vai Trò" value={
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ user.role === 'Admin' ? 'bg-red-100 text-red-800' : user.role === 'Manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800' }`}>
                        {user.role}
                    </span>
                } />
                <DetailItem label="Ngày Tạo" value={new Date(user.createdAt).toLocaleString('vi-VN')} />
                <DetailItem label="Đăng Nhập Lần Cuối" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'} />
             </dl>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            Đóng
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

export default UserDetailsModal;
