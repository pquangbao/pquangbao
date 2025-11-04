import React, { useState } from 'react';
import { User, Role } from '../types';
import { UserPlusIcon } from './icons/Icons';

interface UserFormProps {
  onCreateUser: (newUser: Omit<User, 'createdAt' | 'lastLogin'>) => boolean;
  currentUser: User;
}

const initialFormState = {
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'Requester' as Role,
  address: '',
};

const UserForm: React.FC<UserFormProps> = ({ onCreateUser, currentUser }) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.id || !formState.name || !formState.email || !formState.password) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (ID, Tên, Email, Mật khẩu).');
      return;
    }

    const success = onCreateUser({
        id: formState.id,
        name: formState.name,
        email: formState.email,
        password: formState.password,
        role: formState.role,
        address: formState.address,
    });

    if (success) {
        setFormState(initialFormState);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <UserPlusIcon className="h-5 w-5 mr-2 text-gray-500" />
        Tạo Người Dùng Mới
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID Đăng Nhập
          </label>
          <input
            type="text"
            name="id"
            id="id"
            value={formState.id}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Họ và Tên
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Địa chỉ Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
         <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Địa chỉ (Tùy chọn)
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formState.address}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formState.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Vai trò
          </label>
          <select
            name="role"
            id="role"
            value={formState.role}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Requester">Requester</option>
            {currentUser.role === 'Admin' && <option value="Manager">Manager</option>}
          </select>
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Tạo Tài Khoản
        </button>
      </form>
    </div>
  );
};

export default UserForm;
