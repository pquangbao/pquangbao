import React, { useMemo } from 'react';
import { Order, User } from '../types';

interface OrderDetailsProps {
  order: Order;
  users: User[];
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
    </div>
);

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, users }) => {
    const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
    const requesterName = userMap.get(order.requester)?.name || order.requester;

    return (
        <div className="p-4">
            <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                <DetailItem label="ID Đơn Hàng" value={order.id} />
                <DetailItem label="Người Yêu Cầu" value={requesterName} />
                <DetailItem label="Ngày Tạo" value={new Date(order.createdAt).toLocaleString('vi-VN')} />
                <DetailItem 
                    label="Mức độ" 
                    value={
                        order.isUrgent 
                        ? <span className="font-bold text-red-600">Khẩn cấp</span> 
                        : 'Bình thường'
                    } 
                />
                
                <div className="col-span-2 sm:col-span-3 md:col-span-4 border-t border-gray-200 my-2"></div>
                
                <DetailItem label="Mã Dự Án" value={order.projectCode} />
                <DetailItem label="Tên Dự Án" value={order.projectName} />
                <DetailItem label="Nhà Cung Cấp" value={order.supplier} />
                <DetailItem label="Trạng thái" value={order.status} />
                <DetailItem label="Ngày Lấy Hàng" value={new Date(order.pickupDate).toLocaleDateString('vi-VN')} />
                <DetailItem label="Ngày Giao Hàng" value={new Date(order.deliveryDate).toLocaleDateString('vi-VN')} />
                <DetailItem label="Kho Lấy Hàng" value={order.pickupWarehouse} />
                <DetailItem label="Kho Giao Hàng" value={order.deliveryWarehouse} />

                <div className="col-span-2 sm:col-span-3 md:col-span-4 border-t border-gray-200 my-2"></div>

                <DetailItem label="Loại Xe" value={order.vehicleType} />
                <DetailItem label="Loại Hàng Hóa" value={order.goodsType} />
                <DetailItem label="Số Lượng" value={order.quantity} />

                <div className="col-span-2 sm:col-span-3 md:col-span-4 border-t border-gray-200 my-2"></div>
                
                <div className="col-span-2 sm:col-span-3 md:col-span-4">
                     <DetailItem label="Ghi Chú" value={<p className="whitespace-pre-wrap">{order.notes || 'Không có ghi chú'}</p>} />
                </div>
            </dl>
        </div>
    );
};

export default OrderDetails;