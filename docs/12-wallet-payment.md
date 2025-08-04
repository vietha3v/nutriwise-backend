# 💰 12. Hệ thống ví điện tử và thanh toán (Wallet & Payment System)

## Chức năng:
- **Ví điện tử tích hợp**: Quản lý tiền nội bộ cho người dùng và huấn luyện viên
- **Nạp tiền**: Nạp tiền qua ngân hàng, ví điện tử, thẻ tín dụng
- **Rút tiền**: Rút tiền về tài khoản ngân hàng
- **Thanh toán dịch vụ**: Thanh toán phí huấn luyện viên, thuê bao, dịch vụ
- **Thanh toán quảng cáo**: Thanh toán phí quảng cáo và khuyến mại
- **Hoa hồng hệ thống**: Thu phí hoa hồng từ các giao dịch
- **Lịch sử giao dịch**: Theo dõi tất cả giao dịch thanh toán
- **Báo cáo tài chính**: Báo cáo thu chi cho người dùng và huấn luyện viên
- **Khuyến mại và thưởng**: Hệ thống khuyến mại, thưởng, cashback
- **Lưu trữ dữ liệu**: Thanh toán cho dịch vụ lưu trữ và backup
- **Thuê bao premium**: Thanh toán cho các gói thuê bao cao cấp

## Loại giao dịch:
- **Nạp tiền**: Người dùng nạp tiền vào ví
- **Rút tiền**: Rút tiền về tài khoản ngân hàng
- **Thanh toán dịch vụ**: Phí huấn luyện viên, thuê bao, dịch vụ premium
- **Thanh toán quảng cáo**: Phí quảng cáo và khuyến mại
- **Hoa hồng**: Hệ thống thu hoa hồng từ giao dịch
- **Khuyến mại**: Thưởng, cashback, giảm giá
- **Phí lưu trữ**: Thanh toán cho dịch vụ lưu trữ dữ liệu
- **Chuyển khoản**: Chuyển tiền giữa các tài khoản

## Phân quyền:
- **User (Người dùng)**:
  - Nạp/rút tiền từ ví
  - Thanh toán các dịch vụ
  - Xem lịch sử giao dịch
  - Quản lý thông tin thanh toán
  - Nhận khuyến mại và thưởng
- **Trainer (Huấn luyện viên)**:
  - Nhận thanh toán từ khách hàng
  - Thanh toán phí quảng cáo
  - Rút tiền về tài khoản
  - Xem báo cáo thu nhập
- **Admin (Quản trị viên)**:
  - Quản lý toàn bộ hệ thống thanh toán
  - Xử lý khiếu nại giao dịch
  - Quản lý khuyến mại và thưởng
  - Báo cáo tài chính tổng hợp

## Thông tin ví:
- **Số dư hiện tại**: Số tiền có trong ví
- **Số dư khả dụng**: Số tiền có thể sử dụng
- **Số dư đang xử lý**: Số tiền đang trong quá trình xử lý
- **Lịch sử giao dịch**: Tất cả giao dịch nạp, rút, thanh toán
- **Thông tin ngân hàng**: Thông tin tài khoản ngân hàng liên kết
- **Cài đặt bảo mật**: 2FA, PIN, giới hạn giao dịch

## Loại dịch vụ thanh toán:
- **Thuê bao premium**: Gói thuê bao cao cấp với tính năng nâng cao
- **Dịch vụ huấn luyện viên**: Thanh toán phí dịch vụ PT
- **Quảng cáo**: Phí quảng cáo và khuyến mại
- **Lưu trữ dữ liệu**: Phí lưu trữ và backup dữ liệu
- **Dịch vụ AI nâng cao**: Các tính năng AI premium
- **Tư vấn chuyên gia**: Dịch vụ tư vấn từ chuyên gia dinh dưỡng
- **Báo cáo chi tiết**: Báo cáo sức khỏe và dinh dưỡng chi tiết

## Khuyến mại và thưởng:
- **Khuyến mại đăng ký**: Thưởng cho người dùng mới
- **Cashback**: Hoàn tiền theo tỷ lệ giao dịch
- **Thưởng giới thiệu**: Thưởng khi giới thiệu người dùng mới
- **Khuyến mại theo mùa**: Giảm giá theo thời điểm
- **Loyalty program**: Chương trình khách hàng thân thiết
- **Điểm tích lũy**: Tích điểm và đổi quà

## API Endpoints:

### Quản lý ví:
- `POST /wallet/deposit` - Nạp tiền vào ví
- `POST /wallet/withdraw` - Rút tiền từ ví
- `GET /wallet/balance` - Xem số dư ví
- `GET /wallet/transactions` - Lịch sử giao dịch
- `GET /wallet/transactions/:id` - Chi tiết giao dịch
- `POST /wallet/transfer` - Chuyển tiền giữa các tài khoản

### Thanh toán dịch vụ:
- `POST /payments/trainer-fee` - Thanh toán phí huấn luyện viên
- `POST /payments/subscription` - Thanh toán thuê bao
- `POST /payments/advertisement-fee` - Thanh toán phí quảng cáo
- `POST /payments/storage-fee` - Thanh toán phí lưu trữ
- `POST /payments/ai-premium` - Thanh toán dịch vụ AI nâng cao
- `POST /payments/consultation` - Thanh toán tư vấn chuyên gia

### Hóa đơn và báo cáo:
- `GET /payments/invoices` - Danh sách hóa đơn
- `GET /payments/invoices/:id` - Chi tiết hóa đơn
- `GET /payments/reports` - Báo cáo tài chính
- `GET /payments/reports/income` - Báo cáo thu nhập
- `GET /payments/reports/expenses` - Báo cáo chi tiêu

### Khuyến mại và thưởng:
- `GET /promotions/available` - Danh sách khuyến mại có sẵn
- `POST /promotions/claim` - Nhận khuyến mại
- `GET /promotions/my-promotions` - Khuyến mại đã nhận
- `GET /loyalty/points` - Điểm tích lũy
- `POST /loyalty/redeem` - Đổi điểm lấy quà

### Bảo mật và cài đặt:
- `POST /wallet/setup-security` - Thiết lập bảo mật
- `POST /wallet/update-bank-info` - Cập nhật thông tin ngân hàng
- `GET /wallet/security-settings` - Cài đặt bảo mật
- `POST /wallet/verify-transaction` - Xác minh giao dịch

## Workflow thực tế:

### Nạp tiền:
1. **Chọn phương thức**: Chọn ngân hàng, ví điện tử, thẻ tín dụng
2. **Nhập số tiền**: Nhập số tiền muốn nạp
3. **Xác minh**: Xác minh thông tin và OTP
4. **Xử lý**: Hệ thống xử lý giao dịch
5. **Cập nhật**: Cập nhật số dư ví
6. **Thông báo**: Gửi thông báo xác nhận

### Thanh toán dịch vụ:
1. **Chọn dịch vụ**: Chọn dịch vụ cần thanh toán
2. **Xem chi tiết**: Xem thông tin và giá dịch vụ
3. **Xác nhận**: Xác nhận thông tin thanh toán
4. **Thanh toán**: Trừ tiền từ ví và thanh toán
5. **Kích hoạt**: Kích hoạt dịch vụ cho người dùng
6. **Thông báo**: Gửi thông báo xác nhận

### Rút tiền:
1. **Nhập thông tin**: Nhập số tiền và thông tin ngân hàng
2. **Xác minh**: Xác minh thông tin và bảo mật
3. **Gửi yêu cầu**: Gửi yêu cầu rút tiền
4. **Xử lý**: Hệ thống xử lý trong 1-3 ngày làm việc
5. **Chuyển tiền**: Chuyển tiền về tài khoản ngân hàng
6. **Thông báo**: Gửi thông báo xác nhận

## Cấu trúc thư mục:
```
src/wallet/
├── wallet.controller.ts
├── wallet.module.ts
├── wallet.service.ts
├── dto/
│   ├── create-deposit.dto.ts
│   ├── create-withdrawal.dto.ts
│   ├── create-payment.dto.ts
│   └── create-transfer.dto.ts
└── entities/
    ├── wallet.entity.ts
    ├── transaction.entity.ts
    ├── invoice.entity.ts
    └── promotion.entity.ts
```

## Database Schema:
- **wallets**: Thông tin ví của người dùng và huấn luyện viên
- **transactions**: Lịch sử tất cả giao dịch
- **invoices**: Hóa đơn thanh toán
- **promotions**: Khuyến mại và thưởng
- **loyalty_points**: Điểm tích lũy của người dùng

## Bảo mật:
- **2FA**: Xác thực 2 yếu tố cho giao dịch lớn
- **PIN**: Mã PIN cho giao dịch nhanh
- **Giới hạn giao dịch**: Giới hạn số tiền giao dịch/ngày
- **Mã hóa**: Mã hóa thông tin thanh toán
- **Audit log**: Ghi log tất cả hoạt động
- **Fraud detection**: Phát hiện giao dịch bất thường 