import React from 'react';
import { User } from '../types';
import UserForm from './UserForm';
import UserList from './UserList';

interface UserManagementProps {
  users: User[];
  onCreateUser: (newUser: Omit<User, 'createdAt' | 'lastLogin'>) => boolean;
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onRequestEditUser: (user: User) => void;
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onCreateUser, onViewUser, onDeleteUser, onRequestEditUser, currentUser }) => {
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <UserForm onCreateUser={onCreateUser} currentUser={currentUser} />
      </div>
      <div className="lg:col-span-8">
        <UserList 
          users={users} 
          onViewUser={onViewUser} 
          onDeleteUser={onDeleteUser} 
          onRequestEditUser={onRequestEditUser}
          currentUser={currentUser} 
        />
      </div>
    </div>
  );
};

export default UserManagement;
