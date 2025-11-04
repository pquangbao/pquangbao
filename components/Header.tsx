import React, { useRef, useState, useEffect } from 'react';
import { ExportIcon, TruckIcon, SearchIcon, LogoutIcon, BackupIcon, UploadIcon, PhoneIcon, MenuIcon } from './icons/Icons';
import { User } from '../types';

interface HeaderProps {
  onExport: () => void;
  onBackup: () => void;
  onRestore: (event: React.ChangeEvent<HTMLInputElement>) => void;
  orderCount: number;
  globalSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  authenticatedUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onBackup, onRestore, orderCount, globalSearch, onSearchChange, authenticatedUser, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <TruckIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Quản Lý Vận Chuyển</h1>
              <a href="tel:0909174793" className="flex items-center mt-1 text-gray-500 hover:text-blue-600 transition-colors">
                 <PhoneIcon className="h-3 w-3 mr-1.5" />
                 <span className="text-xs font-medium">Hotline: Mr Lập 0909174793</span>
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex justify-center px-4">
            <div className="w-full max-w-md">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tìm kiếm đơn hàng..."
                  type="search"
                  value={globalSearch}
                  onChange={onSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
             <span className="text-sm font-medium text-gray-500">
               Tổng: <span className="text-blue-600 font-semibold">{orderCount}</span>
             </span>
            
            <div className="text-right border-l pl-4 border-gray-200">
              <p className="text-sm font-medium text-gray-800">{currentDateTime.toLocaleTimeString('vi-VN')}</p>
              <p className="text-xs text-gray-500">{currentDateTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{authenticatedUser.name}</p>
                  <p className="text-xs text-gray-500">{authenticatedUser.role}</p>
              </div>
              <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label="Đăng xuất"
              >
                  <LogoutIcon className="h-5 w-5" />
              </button>
            </div>

            {authenticatedUser.role === 'Admin' && (
              <>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onRestore} 
                  accept="application/json"
                  className="hidden"
                  aria-hidden="true"
                />
               <button
                onClick={handleRestoreClick}
                title="Khôi Phục"
                className="inline-flex items-center p-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
               >
                <UploadIcon className="h-5 w-5" />
              </button>
               <button
                onClick={onBackup}
                title="Sao Lưu"
                className="inline-flex items-center p-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <BackupIcon className="h-5 w-5" />
              </button>
              </>
            )}

            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ExportIcon className="h-5 w-5 mr-2" />
              <span>Xuất File</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
             <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isMenuOpen}
             >
                <MenuIcon className="h-6 w-6" />
             </button>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
            <div className="lg:hidden absolute top-16 right-4 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{authenticatedUser.name}</p>
                        <p className="text-sm text-gray-500">{authenticatedUser.role}</p>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-800">{currentDateTime.toLocaleTimeString('vi-VN')}</p>
                        <p className="text-xs text-gray-500">{currentDateTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                     <div className="py-1">
                        <button onClick={onExport} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <ExportIcon className="h-5 w-5 mr-3" /> Xuất Báo Cáo
                        </button>
                        {authenticatedUser.role === 'Admin' && (
                            <>
                                <button onClick={handleRestoreClick} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <UploadIcon className="h-5 w-5 mr-3" /> Khôi Phục Dữ Liệu
                                </button>
                                <button onClick={onBackup} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <BackupIcon className="h-5 w-5 mr-3" /> Sao Lưu Dữ Liệu
                                </button>
                            </>
                        )}
                    </div>
                    <div className="py-1 border-t border-gray-200">
                        <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <LogoutIcon className="h-5 w-5 mr-3" /> Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </header>
  );
};

export default Header;