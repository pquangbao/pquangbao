import React, { useState, useEffect } from 'react';
import { Order, User } from '../types';
import { SendIcon, GoodsTypeIcon } from './icons/Icons';

interface OrderFormProps {
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  suppliers: string[];
  currentUser: User;
  users: User[];
}

const getInitialFormState = (currentUser: User) => {
    return {
      requester: currentUser.id, // Default to current user's ID
      pickupDate: '',
      projectCode: '',
      projectName: '',
      deliveryDate: '',
      pickupWarehouse: currentUser.address || '',
      deliveryWarehouse: '',
      vehicleType: 'Xe tải 1 tấn',
      goodsType: 'Hàng nhẹ',
      quantity: 1,
      supplier: '',
      notes: '',
      isUrgent: false,
    };
};

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, suppliers, currentUser, users }) => {
  const [formState, setFormState] = useState(() => getInitialFormState(currentUser));

  useEffect(() => {
    // When the current logged-in user changes, reset the entire form.
    setFormState(getInitialFormState(currentUser));
  }, [currentUser]);

  useEffect(() => {
    // When the requester field changes (e.g., a manager selects a different user),
    // automatically update the pickup warehouse to that user's address.
    const selectedUser = users.find(u => u.id === formState.requester);
    if (selectedUser && selectedUser.address) {
      setFormState(prevState => ({
        ...prevState,
        pickupWarehouse: selectedUser.address || '',
      }));
    } else {
        // If the selected user has no address, clear the field.
        setFormState(prevState => ({...prevState, pickupWarehouse: ''}));
    }
  }, [formState.requester, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormState(prevState => ({
      ...prevState,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : name === 'quantity'
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    for (const key in formState) {
        if (key === 'notes' || key === 'isUrgent') continue;
        if (currentUser.role === 'Requester' && key === 'supplier') continue;

        if (key === 'quantity') {
            if (formState.quantity < 1) {
                alert('Vui lòng nhập số lượng lớn hơn 0.');
                return;
            }
        } else if (formState[key as keyof typeof formState] === '') {
            alert(`Vui lòng điền vào trường: ${key}`);
            return;
        }
    }
    onSubmit(formState);
    setFormState(getInitialFormState(currentUser));
  };

  const today = new Date().toISOString().split('T')[0];
  const isPrivilegedUser = currentUser.role === 'Manager' || currentUser.role === 'Admin';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tạo Yêu Cầu Vận Chuyển Mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="requester" className="block text-sm font-medium text-gray-700">Người Yêu Cầu</label>
           {isPrivilegedUser ? (
                <select
                    name="requester"
                    id="requester"
                    value={formState.requester}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    name="requester"
                    id="requester"
                    value={currentUser.name}
                    readOnly
                    required
                    className="mt-1 block w-full bg-gray-100 text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700">Mã Dự Án</label>
                <input type="text" name="projectCode" id="projectCode" value={formState.projectCode} onChange={handleChange} required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Tên Dự Án</label>
                <input type="text" name="projectName" id="projectName" value={formState.projectName} onChange={handleChange} required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Ngày Lấy Hàng</label>
                <input type="date" name="pickupDate" id="pickupDate" min={today} value={formState.pickupDate} onChange={handleChange} required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Ngày Nhận Hàng</label>
                <input type="date" name="deliveryDate" id="deliveryDate" min={formState.pickupDate || today} value={formState.deliveryDate} onChange={handleChange} required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="pickupWarehouse" className="block text-sm font-medium text-gray-700">Kho Lấy Hàng</label>
                <input type="text" name="pickupWarehouse" id="pickupWarehouse" value={formState.pickupWarehouse} onChange={handleChange} required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="deliveryWarehouse" className="block text-sm font-medium text-gray-700">Kho Giao Hàng</label>
                <input type="text" name="deliveryWarehouse" id="deliveryWarehouse" value={formState.deliveryWarehouse} onChange={handleChange} required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Loại Xe</label>
                <select name="vehicleType" id="vehicleType" value={formState.vehicleType} onChange={handleChange} className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option>Xe tải 1 tấn</option>
                    <option>Xe tải 2.5 tấn</option>
                    <option>PCN (Chuyển phát nhanh)</option>
                    <option>Xe máy</option>
                    <option>Khác</option>
                </select>
            </div>
            <div className="sm:col-span-1">
                <label htmlFor="goodsType" className="block text-sm font-medium text-gray-700">Loại Hàng</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <GoodsTypeIcon goodsType={formState.goodsType} className="h-5 w-5 text-gray-400" />
                  </div>
                  <select name="goodsType" id="goodsType" value={formState.goodsType} onChange={handleChange} className="block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>Hàng nhẹ</option>
                      <option>Hàng cồng kềnh</option>
                      <option>Hàng dễ vỡ</option>
                      <option>Tài liệu</option>
                      <option>Khác</option>
                  </select>
                </div>
            </div>
             <div className="sm:col-span-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Số Lượng</label>
                <input type="number" name="quantity" id="quantity" value={formState.quantity} onChange={handleChange} min="1" required className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Ghi Chú</label>
          <textarea name="notes" id="notes" value={formState.notes} onChange={handleChange} rows={3} className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ví dụ: hàng cần bốc xếp, giao hàng ngoài giờ hành chính..."></textarea>
        </div>
        {isPrivilegedUser && (
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Nhà Cung Cấp (Tùy chọn)</label>
              <input list="suppliers" name="supplier" id="supplier" value={formState.supplier} onChange={handleChange} className="mt-1 block w-full bg-white text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              <datalist id="suppliers">
                {suppliers.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div className="relative flex items-start pt-6">
              <div className="flex items-center h-5">
                <input
                  id="isUrgent"
                  name="isUrgent"
                  type="checkbox"
                  checked={formState.isUrgent}
                  onChange={handleChange}
                  className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isUrgent" className="font-medium text-gray-700">
                  Đơn hàng khẩn
                </label>
                <p className="text-gray-500">Ưu tiên xử lý đơn hàng này.</p>
              </div>
            </div>
          </div>
        )}
        <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
          <SendIcon className="h-5 w-5 mr-2" />
          Gửi Yêu Cầu
        </button>
      </form>
    </div>
  );
};

export default OrderForm;