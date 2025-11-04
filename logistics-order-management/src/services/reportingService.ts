import { Order, User } from '../types';

const generateSummary = (orders: Order[], userMap: Map<string, User>) => {
  const summaryByRequester: { [key: string]: number } = {};
  const summaryBySupplier: { [key: string]: number } = {};

  orders.forEach(order => {
    const requesterName = userMap.get(order.requester)?.name || 'Không rõ';
    summaryByRequester[requesterName] = (summaryByRequester[requesterName] || 0) + 1;
    if (order.supplier) {
      summaryBySupplier[order.supplier] = (summaryBySupplier[order.supplier] || 0) + 1;
    }
  });

  let requesterHtml = '<ul>';
  for (const requester in summaryByRequester) {
    requesterHtml += `<li>${requester}: ${summaryByRequester[requester]} chuyến</li>`;
  }
  requesterHtml += '</ul>';

  let supplierHtml = '<ul>';
  for (const supplier in summaryBySupplier) {
    supplierHtml += `<li>${supplier}: ${summaryBySupplier[supplier]} chuyến</li>`;
  }
  supplierHtml += '</ul>';

  return `
    <div class="summary-section">
      <h2>Tóm Tắt Theo Người Đặt Hàng</h2>
      ${requesterHtml}
    </div>
    <div class="summary-section">
      <h2>Tóm Tắt Theo Nhà Cung Cấp</h2>
      ${supplierHtml}
    </div>
  `;
};

export const generateReportHTML = (orders: Order[], users: User[]): string => {
  const userMap = new Map(users.map(u => [u.id, u]));
  const summary = generateSummary(orders, userMap);
  
  const tableRows = orders.map(order => {
    const requesterName = userMap.get(order.requester)?.name || order.requester;
    return `
    <tr>
      <td>${new Date(order.createdAt).toLocaleString('vi-VN')}</td>
      <td>${order.isUrgent ? '<strong>KHẨN</strong>' : 'Thường'}</td>
      <td>${requesterName}</td>
      <td>${new Date(order.pickupDate).toLocaleDateString('vi-VN')}</td>
      <td>${order.projectCode}</td>
      <td>${order.projectName}</td>
      <td>${new Date(order.deliveryDate).toLocaleDateString('vi-VN')}</td>
      <td>${order.pickupWarehouse}</td>
      <td>${order.deliveryWarehouse}</td>
      <td>${order.vehicleType}</td>
      <td>${order.goodsType}</td>
      <td>${order.quantity}</td>
      <td>${order.supplier}</td>
      <td>${order.notes || ''}</td>
    </tr>
  `}).join('');

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Báo Cáo Vận Chuyển</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          margin: 20px;
        }
        h1, h2 {
          text-align: center;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .summary-container {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
        }
        .summary-section {
            width: 45%;
        }
        .summary-section h2 {
            font-size: 16px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
        @media print {
            body { -webkit-print-color-adjust: exact; }
            button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Báo Cáo Vận Chuyển Chi Tiết</h1>
      <p>Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}</p>
      
      <div class="summary-container">
        ${summary}
      </div>

      <h2>Chi Tiết Các Chuyến Hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Ngày Tạo Đơn</th>
            <th>Mức Độ</th>
            <th>Người Yêu Cầu</th>
            <th>Ngày Lấy Hàng</th>
            <th>Mã Dự Án</th>
            <th>Tên Dự Án</th>
            <th>Ngày Nhận Hàng</th>
            <th>Kho Lấy Hàng</th>
            <th>Kho Giao Hàng</th>
            <th>Loại Xe</th>
            <th>Loại Hàng</th>
            <th>Số Lượng</th>
            <th>Nhà Cung Cấp</th>
            <th>Ghi Chú</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
};