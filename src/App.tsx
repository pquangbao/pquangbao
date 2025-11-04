import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Order, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateReportHTML } from './services/reportingService';
import Header from './components/Header';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import Filter from './components/Filter';
import { ToastContainer, Toast } from './components/Toast';
import Modal from './components/Modal';
import AssignSupplierModal from './components/AssignSupplierModal';
import Login from './components/Login';
import Tabs from './components/Tabs';
import UserManagement from './components/UserManagement';
import UserDetailsModal from './components/UserDetailsModal';
import EditUserModal from './components/EditUserModal';
import { createGist, getGist, updateGist } from './services/githubService';
import GithubSyncModal from './components/GithubSyncModal';


// --- Sample user data, used only if localStorage is empty ---
const initialUsers: User[] = [
    { id: 'ADMIN', name: 'Admin Supreme', role: 'Admin', email: 'admin@logistics.com', password: 'Bao231185', createdAt: new Date().toISOString(), address: 'Tổng kho Hà Nội' },
    { id: 'manager01', name: 'Manager User', role: 'Manager', email: 'manager@logistics.com', password: 'password123', createdAt: new Date().toISOString(), address: 'Văn phòng Đà Nẵng' },
    { id: 'alice01', name: 'Alice (Requester)', role: 'Requester', email: 'alice@company.com', password: 'password123', createdAt: new Date().toISOString(), address: 'Kho hàng Quận 9, TPHCM' },
    { id: 'bob01', name: 'Bob (Requester)', role: 'Requester', email: 'bob@company.com', password: 'password123', createdAt: new Date().toISOString(), address: 'Xưởng sản xuất Bình Dương' },
];

const App: React.FC = () => {
  const [orders, setOrders] = useLocalStorage<Order[]>('shippingOrders', []);
  const [users, setUsers] = useLocalStorage<User[]>('appUsers', initialUsers);
  const [suppliers, setSuppliers] = useLocalStorage<string[]>('suppliers', [
    'Viettel Post', 'GHTK', 'GHN', 'Proship'
  ]);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [filters, setFilters] = useState({
    requester: '',
    supplier: '',
    startDate: '',
    endDate: '',
  });
  const [globalSearch, setGlobalSearch] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orderToAssign, setOrderToAssign] = useState<Order | null>(null);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [dataToRestore, setDataToRestore] = useState<{orders: Order[], users: User[], suppliers: string[]} | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useLocalStorage<User | null>('authenticatedUser', null);
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');
  const [syncModalState, setSyncModalState] = useState<{ isOpen: boolean; mode: 'sync' | 'load' }>({
    isOpen: false,
    mode: 'sync'
  });
  const [syncCredentials, setSyncCredentials] = useLocalStorage('syncCredentials', { pat: '', gistId: '' });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  
  const debounceTimer = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  
  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  // Effect for automatic synchronization
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        if(syncCredentials.pat && syncCredentials.gistId) setSyncStatus('synced');
        return;
    }
    
    if (syncCredentials.pat && syncCredentials.gistId) {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        setSyncStatus('syncing');
        debounceTimer.current = window.setTimeout(async () => {
            try {
                const dataToSync = { orders, users, suppliers };
                await updateGist(syncCredentials.pat, syncCredentials.gistId, dataToSync);
                setSyncStatus('synced');
            } catch (error) {
                console.error("Auto-sync failed:", error);
                setSyncStatus('error');
                showToast('Lỗi tự động đồng bộ. Vui lòng kiểm tra lại thông tin.');
                setSyncCredentials({ pat: '', gistId: '' }); // Disable auto-sync on error
            }
        }, 2000); // 2-second debounce
    }
  }, [orders, users, suppliers, syncCredentials]);


  const showToast = (message: string) => {
    setToast({ id: Date.now(), message });
  };

  const handleLogin = (id: string, password: string): boolean => {
    const user = users.find(u => u.id.toLowerCase() === id.toLowerCase() && u.password === password);
    if (user) {
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
      );
      setUsers(updatedUsers);

      const { password, ...userToStore } = user; // Don't store password in state
      setAuthenticatedUser({ ...userToStore, lastLogin: new Date().toISOString() });
      showToast(`Chào mừng trở lại, ${user.name}!`);
      return true;
    }
    showToast('ID hoặc mật khẩu không đúng.');
    return false;
  };
  
  const handleLogout = () => {
    setAuthenticatedUser(null);
    showToast('Bạn đã đăng xuất thành công.');
  };

  const handleAddOrder = (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    if (!authenticatedUser) return;
    const newOrder: Order = {
      ...newOrderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: (authenticatedUser.role === 'Manager' || authenticatedUser.role === 'Admin') && newOrderData.supplier ? 'Assigned' : 'Pending',
      supplier: newOrderData.supplier || '',
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);

    if (newOrder.supplier && !suppliers.includes(newOrder.supplier)) {
      setSuppliers(prevSuppliers => [...prevSuppliers, newOrder.supplier]);
    }
    showToast('Đã gửi yêu cầu vận chuyển thành công!');
  };

  const handleCreateUser = (newUser: Omit<User, 'createdAt' | 'lastLogin'>): boolean => {
    if (users.some(user => user.id.toLowerCase() === newUser.id.toLowerCase())) {
        showToast('Lỗi: ID này đã tồn tại.');
        return false;
    }
    if (newUser.id.toUpperCase() === 'ADMIN') {
        showToast('Lỗi: ID "ADMIN" đã được bảo lưu.');
        return false;
    }
    const newUserWithDate: User = {
        ...newUser,
        createdAt: new Date().toISOString(),
    };
    setUsers(prevUsers => [...prevUsers, newUserWithDate]);
    showToast(`Đã tạo người dùng mới: ${newUser.name}`);
    return true;
  };
  
  const handleAssignSupplier = (orderId: string, supplier: string) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, supplier, status: 'Assigned' } : order
    ));
    if (supplier && !suppliers.includes(supplier)) {
      setSuppliers(prev => [...prev, supplier]);
    }
    showToast(`Đã gán nhà cung cấp ${supplier} thành công!`);
    setOrderToAssign(null);
  };

  const handleRequestDelete = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;

    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete));
    showToast('Đã xóa đơn hàng thành công!');
    setOrderToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setOrderToDelete(null);
  };

  const handleRequestDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete || !authenticatedUser) return;
    
    // Safety checks
    if (userToDelete.id === authenticatedUser.id) {
        showToast('Lỗi: Bạn không thể xóa tài khoản của chính mình.');
        setUserToDelete(null);
        return;
    }
    
    if (userToDelete.role === 'Admin') {
        showToast('Lỗi: Không thể xóa tài khoản Admin.');
        setUserToDelete(null);
        return;
    }

    if (authenticatedUser.role === 'Manager' && userToDelete.role === 'Manager') {
        showToast('Lỗi: Manager không có quyền xóa tài khoản cấp cao hơn hoặc tương đương.');
        setUserToDelete(null);
        return;
    }

    if (userToDelete.role === 'Manager' && users.filter(u => u.role === 'Manager').length <= 1) {
        showToast('Lỗi: Không thể xóa tài khoản Manager cuối cùng.');
        setUserToDelete(null);
        return;
    }

    if (orders.some(order => order.requester === userToDelete.id)) {
        showToast('Lỗi: Không thể xóa người dùng đã có đơn hàng. Vui lòng gán lại các đơn hàng trước.');
        setUserToDelete(null);
        return;
    }

    setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
    showToast(`Đã xóa người dùng "${userToDelete.name}" thành công!`);
    setUserToDelete(null);
  };

  const handleCancelDeleteUser = () => {
    setUserToDelete(null);
  };
  
  const handleRequestEditUser = (user: User) => {
    setUserToEdit(user);
  };
  
  const handleCancelEditUser = () => {
    setUserToEdit(null);
  };

  const handleUpdateUser = (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'address'>>): boolean => {
    if (updates.email && users.some(user => user.email.toLowerCase() === (updates.email || '').toLowerCase() && user.id !== userId)) {
      showToast('Lỗi: Email này đã được sử dụng bởi một tài khoản khác.');
      return false;
    }
  
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    showToast('Cập nhật thông tin người dùng thành công!');
    setUserToEdit(null);
    return true;
  };


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearch(e.target.value);
  };

  const handleClearFilters = () => {
    setFilters({
      requester: '',
      supplier: '',
      startDate: '',
      endDate: '',
    });
  };

  const filteredOrders = useMemo(() => {
    if (!authenticatedUser) return [];
    return orders.filter(order => {
      // Role-based filtering
      if (authenticatedUser.role === 'Requester' && order.requester !== authenticatedUser.id) {
        return false;
      }
  
      // Advanced Filters
      const orderDate = new Date(order.createdAt);
      const requesterName = userMap.get(order.requester)?.name || '';
      const requesterMatch = filters.requester
        ? requesterName.toLowerCase().includes(filters.requester.toLowerCase())
        : true;
      const supplierMatch = filters.supplier
        ? order.supplier === filters.supplier
        : true;
  
      let dateMatch = true;
      if (filters.startDate) {
        const startDate = new Date(filters.startDate + 'T00:00:00.000Z');
        if (orderDate < startDate) dateMatch = false;
      }
      if (dateMatch && filters.endDate) {
        const endDate = new Date(filters.endDate + 'T23:59:59.999Z');
        if (orderDate > endDate) dateMatch = false;
      }
  
      if (!requesterMatch || !supplierMatch || !dateMatch) {
        return false;
      }
  
      // Global Search
      if (globalSearch.trim() === '') {
        return true;
      }
  
      const searchTerm = globalSearch.toLowerCase();
      const searchableFields = [
        requesterName,
        order.projectCode,
        order.projectName,
        order.pickupWarehouse,
        order.deliveryWarehouse,
        order.vehicleType,
        order.goodsType,
        order.supplier || '',
        order.notes || '',
        String(order.quantity),
        order.status,
      ];
      
      return searchableFields.some(field => field.toLowerCase().includes(searchTerm));
    });
  }, [orders, filters, globalSearch, authenticatedUser, userMap]);
  
  const handleExport = () => {
    if (filteredOrders.length === 0) {
      showToast('Không có đơn hàng nào (phù hợp với bộ lọc) để xuất báo cáo.');
      return;
    }
    const reportHtml = generateReportHTML(filteredOrders, users);
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
      reportWindow.print();
    } else {
      showToast('Không thể mở cửa sổ mới. Vui lòng cho phép pop-up.');
    }
  };

  const handleBackupData = () => {
    const backupData = {
      orders,
      users, // Include passwords for a complete restore
      suppliers,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `logistics_backup_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Đang tải xuống bản sao lưu dữ liệu...');
  };

  const handleRestoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not a string.');
        }
        const data = JSON.parse(text);

        // Basic validation
        if (!data.orders || !data.users || !data.suppliers || !Array.isArray(data.orders) || !Array.isArray(data.users) || !Array.isArray(data.suppliers)) {
            throw new Error('Invalid backup file format.');
        }
        
        setDataToRestore(data);
      } catch (error) {
        console.error("Failed to parse backup file:", error);
        showToast('Lỗi: Tệp sao lưu không hợp lệ hoặc bị hỏng.');
      } finally {
        // Reset file input value to allow re-uploading the same file
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.onerror = () => {
      showToast('Lỗi: Không thể đọc tệp tin.');
      if (event.target) {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!dataToRestore) return;

    setOrders(dataToRestore.orders);
    setUsers(dataToRestore.users);
    setSuppliers(dataToRestore.suppliers);
    setAuthenticatedUser(null); // Force logout for security and state consistency
    setDataToRestore(null); // Close modal
    showToast('Khôi phục dữ liệu thành công! Vui lòng đăng nhập lại.');
  };

  const handleCancelRestore = () => {
    setDataToRestore(null);
  };

  const handleOpenSyncModal = (mode: 'sync' | 'load') => {
    setSyncModalState({ isOpen: true, mode });
  };

  const handleCloseSyncModal = () => {
      setSyncModalState({ isOpen: false, mode: 'sync' });
  };

  const handleGithubSync = async (pat: string, gistId: string, remember: boolean) => {
      const { mode } = syncModalState;
      setSyncStatus('syncing');
      try {
          if (mode === 'sync') {
              const backupData = { orders, users, suppliers };
              let finalGistId = gistId;
              if (gistId) {
                  await updateGist(pat, gistId, backupData);
                  showToast(`Đã cập nhật Gist ${gistId} thành công!`);
              } else {
                  const { id: newGistId } = await createGist(pat, backupData);
                  showToast(`Đã tạo Gist mới thành công! ID: ${newGistId}`);
                  finalGistId = newGistId;
              }
              if (remember) {
                  setSyncCredentials({ pat, gistId: finalGistId });
                  showToast('Đã bật tự động đồng bộ.');
              } else {
                  setSyncCredentials({ pat: '', gistId: '' });
              }
          } else { // mode === 'load'
              const data = await getGist(pat, gistId);
              if (!data.orders || !data.users || !data.suppliers) {
                  throw new Error('Invalid backup data format in Gist.');
              }
              setDataToRestore(data);
               if (remember) {
                  setSyncCredentials({ pat, gistId });
                  showToast('Đã bật tự động đồng bộ.');
              } else {
                  setSyncCredentials({ pat: '', gistId: '' });
              }
          }
          setSyncStatus('synced');
          handleCloseSyncModal();
      } catch (error) {
          setSyncStatus('error');
          console.error("GitHub Sync Error:", error);
          showToast(`Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
          if (remember) {
              setSyncCredentials({ pat: '', gistId: '' });
          }
      }
  };

  if (!authenticatedUser) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer>
          {toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />}
        </ToastContainer>
      </>
    );
  }

  const isPrivilegedUser = authenticatedUser.role === 'Manager' || authenticatedUser.role === 'Admin';

  return (
    <div className="min-h-screen bg-sky-50 text-gray-800">
      <Header
        onExport={handleExport}
        onBackup={handleBackupData}
        onRestore={handleRestoreData}
        orderCount={filteredOrders.length}
        globalSearch={globalSearch}
        onSearchChange={handleGlobalSearch}
        authenticatedUser={authenticatedUser}
        onLogout={handleLogout}
        onOpenSyncModal={handleOpenSyncModal}
        syncStatus={syncStatus}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {isPrivilegedUser && (
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'orders' || !isPrivilegedUser ? (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <OrderForm 
                  onSubmit={handleAddOrder} 
                  suppliers={suppliers} 
                  currentUser={authenticatedUser}
                  users={users}
                />
              </div>
              <div className="lg:col-span-8 space-y-6">
                <Filter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  users={users}
                  suppliers={suppliers}
                  currentUser={authenticatedUser}
                />
                <OrderList
                  orders={filteredOrders}
                  totalOrders={orders.length}
                  onDeleteOrder={handleRequestDelete}
                  currentUser={authenticatedUser}
                  onAssignSupplier={setOrderToAssign}
                  users={users}
                />
              </div>
            </div>
          ) : (
             <UserManagement 
                users={users} 
                onCreateUser={handleCreateUser} 
                onViewUser={setUserToView}
                onDeleteUser={handleRequestDeleteUser}
                onRequestEditUser={handleRequestEditUser}
                currentUser={authenticatedUser}
            />
          )}
        </div>
      </main>
      {orderToAssign && (
        <AssignSupplierModal
          isOpen={!!orderToAssign}
          onClose={() => setOrderToAssign(null)}
          onConfirm={handleAssignSupplier}
          order={orderToAssign}
          suppliers={suppliers}
        />
      )}
      {orderToDelete && (
        <Modal
            isOpen={!!orderToDelete}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Xác Nhận Xóa Đơn Hàng"
        >
            Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.
        </Modal>
      )}
       {dataToRestore && (
        <Modal
            isOpen={!!dataToRestore}
            onClose={handleCancelRestore}
            onConfirm={handleConfirmRestore}
            title="Xác Nhận Khôi Phục Dữ Liệu"
            confirmText="Khôi Phục"
        >
            Bạn có chắc chắn muốn khôi phục dữ liệu từ tệp này không? <strong>Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại và bạn sẽ bị đăng xuất.</strong>
        </Modal>
      )}
      {userToView && (
        <UserDetailsModal
            isOpen={!!userToView}
            onClose={() => setUserToView(null)}
            user={userToView}
        />
      )}
      {userToDelete && (
        <Modal
            isOpen={!!userToDelete}
            onClose={handleCancelDeleteUser}
            onConfirm={handleConfirmDeleteUser}
            title="Xác Nhận Xóa Người Dùng"
        >
            <>
              Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete.name}</strong>? Hành động này không thể hoàn tác.
            </>
        </Modal>
      )}
      {userToEdit && (
        <EditUserModal
          isOpen={!!userToEdit}
          onClose={handleCancelEditUser}
          onConfirm={handleUpdateUser}
          user={userToEdit}
        />
      )}
      {syncModalState.isOpen && (
        <GithubSyncModal
            isOpen={syncModalState.isOpen}
            onClose={handleCloseSyncModal}
            onConfirm={handleGithubSync}
            mode={syncModalState.mode}
            credentials={syncCredentials}
        />
      )}
      <ToastContainer>
        {toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />}
      </ToastContainer>
    </div>
  );
};

export default App;
