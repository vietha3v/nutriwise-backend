# 📧 10. Gửi email

## Chức năng:
- **Email chào mừng**: Email chào mừng người dùng mới
- **Email quên mật khẩu**: Gửi link reset mật khẩu
- **Email nhắc nhở**: Nhắc nhở uống nước, tập luyện
- **Email báo cáo**: Báo cáo tuần/tháng

## Cấu trúc thư mục:
```
src/email/
├── email.module.ts
└── email.service.ts
```

## Loại email:
- **Welcome Email**: Chào mừng người dùng mới đăng ký
- **Password Reset**: Gửi link reset mật khẩu
- **Reminder Email**: Nhắc nhở các hoạt động hàng ngày
- **Weekly Report**: Báo cáo tổng hợp tuần
- **Monthly Report**: Báo cáo chi tiết tháng
- **Goal Achievement**: Chúc mừng khi đạt mục tiêu
- **Health Alert**: Cảnh báo sức khỏe khi cần thiết

## Template email:
- **HTML Template**: Template đẹp với logo và branding
- **Text Template**: Template đơn giản cho email client cũ
- **Personalization**: Tùy chỉnh theo thông tin người dùng
- **Multi-language**: Hỗ trợ tiếng Việt và tiếng Anh

## Cấu hình SMTP:
- **Gmail SMTP**: Sử dụng Gmail App Password
- **SMTP Settings**: Host, port, username, password
- **Security**: TLS/SSL encryption
- **Rate Limiting**: Giới hạn số email gửi/phút 