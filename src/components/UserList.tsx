import React from 'react';
import { User } from '../types';
import { ViewIcon, DeleteIcon, EditIcon } from './icons/Icons';

interface UserListProps {
  users: User[];
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onRequestEditUser: (user: User) => void;
  currentUser: User;
}

const UserList: React.FC<UserListProps> = ({ users, onViewUser, onDeleteUser, onRequestEditUser, currentUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Danh Sách Người Dùng</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai Trò
              </th>
               <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              // Deletion Rules
              const canDelete =
                currentUser.id !== user.id &&
                ((currentUser.role === 'Admin' && user.role !== 'Admin') ||
                  (currentUser.role === 'Manager' && user.role === 'Requester'));

              // Editing Rules
              const canEdit =
                currentUser.id !== user.id &&
                user.role !== 'Admin' &&
                (currentUser.role === 'Admin' || (currentUser.role === 'Manager' && user.role === 'Requester'));

              return (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-mono">{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'Manager'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={() => onViewUser(user)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label={`Xem chi tiết người dùng ${user.name}`}
                        >
                            <ViewIcon className="h-5 w-5" />
                        </button>

                        {canEdit && (
                             <button
                                onClick={() => onRequestEditUser(user)}
                                className="text-gray-400 hover:text-green-600 transition-colors"
                                aria-label={`Chỉnh sửa người dùng ${user.name}`}
                            >
                                <EditIcon className="h-5 w-5" />
                            </button>
                        )}
                        
                        {canDelete && (
                             <button
                                onClick={() => onDeleteUser(user)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                aria-label={`Xóa người dùng ${user.name}`}
                            >
                                <DeleteIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;