export interface Order {
  id: string;
  requester: string; // Stores the User['id']
  pickupDate: string;
  projectCode: string;
  projectName: string;
  deliveryDate: string;
  pickupWarehouse: string;
  deliveryWarehouse: string;
  vehicleType: string;
  goodsType: string;
  supplier?: string;
  createdAt: string;
  notes?: string;
  quantity: number;
  status: 'Pending' | 'Assigned';
  isUrgent: boolean;
}

export type Role = 'Admin' | 'Manager' | 'Requester';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    password?: string; // Only used for simulation, not stored in state
    createdAt: string;
    lastLogin?: string;
    address?: string;
}