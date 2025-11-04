import React, { useState, useMemo } from 'react';
import { Order, User } from '../types';
import { DeleteIcon, ChevronDownIcon, ChevronUpIcon, AssignIcon, GoodsTypeIcon, FireIcon } from './icons/Icons';
import OrderDetails from './OrderDetails';

interface OrderListProps {
  orders: Order[];
  totalOrders: number;
  onDeleteOrder: (id: string) => void;
  currentUser: User;
  onAssignSupplier: (order: Order) => void;
  users: User[];
}

const OrderList: React.FC<OrderListProps> = ({ orders, totalOrders, onDeleteOrder, currentUser, onAssignSupplier, users }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  const handleRowClick = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  if (orders.length === 0) {
    const message = totalOrders === 0
      ? "Chưa có yêu cầu vận chuyển nào được tạo."
      : "Không tìm thấy đơn hàng nào phù hợp với bộ lọc.";

    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold text-gray-900">Danh Sách Đơn Hàng</h2>
        <p className="mt-4 text-gray-500">{message}</p>
        <img src="https://storage.googleapis.com/aistudio-ux-team/templates/41f45091-4475-4303-9783-a75d5f2f51f1.png" alt="Empty state illustration" className="mx-auto mt-4 rounded-lg opacity-70 h-60 w-auto"/>
      </div>
    );
  }

  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Admin';
  // Correctly calculate the number of columns for the colSpan attribute.
  // Manager/Admin has 8 columns, Requester has 6.
  const visibleColumnCount = isManager ? 8 : 6;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Danh Sách Đơn Hàng Gần Đây</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người Yêu Cầu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dự Án</th>
              <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lấy/Giao Hàng</th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuyến Đường</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
              {isManager && <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà Cung Cấp</th>}
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi Chú</th>
              {isManager && <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const requester = userMap.get(order.requester);
              return (
                <React.Fragment key={order.id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${order.isUrgent && isManager ? 'bg-red-50 border-l-4 border-red-500' : ''}`}
                    onClick={() => handleRowClick(order.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2 text-gray-400">
                          {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{requester?.name || order.requester}</div>
                          <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {order.isUrgent && isManager && <FireIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" title="Đơn hàng khẩn" />}
                        <div>
                            <div className="text-sm text-gray-900">{order.projectName}</div>
                            <div className="text-sm text-gray-500">{order.projectCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Lấy: {new Date(order.pickupDate).toLocaleDateString('vi-VN')}</div>
                        <div>Giao: {new Date(order.deliveryDate).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.pickupWarehouse}</div>
                        <div className="text-sm text-gray-500">→ {order.deliveryWarehouse}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Assigned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                       <div className="flex items-center text-sm text-gray-500 mt-1">
                          <GoodsTypeIcon goodsType={order.goodsType} className="h-4 w-4 mr-1.5 text-gray-400" />
                          <span>{order.goodsType} (SL: {order.quantity})</span>
                       </div>
                    </td>
                    {isManager && (
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {order.supplier ? order.supplier : <span className="text-gray-400 italic">Chưa gán</span>}
                      </td>
                    )}
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate" title={order.notes}>
                            {order.notes ? order.notes : <span className="text-gray-400 italic">N/A</span>}
                        </div>
                    </td>
                    {isManager && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-4">
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignSupplier(order);
                              }}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              aria-label={`Gán nhà cung cấp cho đơn hàng của ${requester?.name || order.requester}`}
                          >
                              <AssignIcon className="h-5 w-5" />
                          </button>
                          <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteOrder(order.id);
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              aria-label={`Xóa đơn hàng của ${requester?.name || order.requester}`}
                          >
                              <DeleteIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  {isExpanded && (
                    <tr className="bg-gray-50">
                        <td colSpan={visibleColumnCount} className="p-0">
                           <OrderDetails order={order} users={users} />
                        </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;