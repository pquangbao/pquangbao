import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GithubIcon } from './icons/Icons';

interface GithubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pat: string, gistId: string, remember: boolean) => Promise<void>;
  mode: 'sync' | 'load';
  credentials: { pat: string; gistId: string };
}

const GithubSyncModal: React.FC<GithubSyncModalProps> = ({ isOpen, onClose, onConfirm, mode, credentials }) => {
  const [pat, setPat] = useState('');
  const [gistId, setGistId] = useState('');
  const [remember, setRemember] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPat(credentials.pat || '');
      setGistId(credentials.gistId || '');
      setRemember(!!(credentials.pat && credentials.gistId));
      setIsProcessing(false);
    }
  }, [isOpen, credentials]);

  const handleConfirmClick = async () => {
    if (!pat || (mode === 'load' && !gistId)) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }
    setIsProcessing(true);
    await onConfirm(pat, gistId, remember);
    setIsProcessing(false);
  };
  
  if (!isOpen) return null;
  
  const title = mode === 'sync' ? 'Đồng bộ dữ liệu lên GitHub Gist' : 'Tải dữ liệu từ GitHub Gist';
  const confirmText = mode === 'sync' ? 'Đồng bộ' : 'Tải về';

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 sm:mx-0 sm:h-10 sm:w-10">
              <GithubIcon className="h-6 w-6 text-gray-800" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Dữ liệu sẽ được lưu trữ dưới dạng một Gist riêng tư trên tài khoản GitHub của bạn.
                </p>
                 <a href="https://github.com/settings/tokens/new?scopes=gist&description=Logistics%20App%20Sync" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Nhấn vào đây để tạo Personal Access Token.
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="pat" className="block text-sm font-medium text-gray-700">
                Personal Access Token (PAT)
              </label>
              <input
                type="password"
                id="pat"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                required
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ghp_..."
              />
            </div>
            <div>
              <label htmlFor="gistId" className="block text-sm font-medium text-gray-700">
                Gist ID {mode === 'sync' ? '(để trống để tạo mới)' : '(bắt buộc)'}
              </label>
              <input
                type="text"
                id="gistId"
                value={gistId}
                onChange={(e) => setGistId(e.target.value)}
                required={mode === 'load'}
                className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 123abc456def..."
              />
            </div>
            <div className="border-t border-gray-200 pt-4">
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="font-medium text-gray-700">
                        Ghi nhớ và tự động đồng bộ
                        </label>
                        <p className="text-gray-500">Lưu thông tin và tự động cập nhật Gist khi có thay đổi.</p>
                        <p className="text-xs text-red-600 mt-1">Cảnh báo: Personal Access Token sẽ được lưu trong bộ nhớ cục bộ của trình duyệt.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-400"
            onClick={handleConfirmClick}
            disabled={isProcessing}
          >
            {isProcessing ? 'Đang xử lý...' : confirmText}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
            disabled={isProcessing}
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

export default GithubSyncModal;
