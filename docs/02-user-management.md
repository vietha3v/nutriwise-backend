# 👥 2. Quản lý người dùng (User Management)

## Tổng quan

Module User Management quản lý việc đăng ký, đăng nhập và phân quyền người dùng trong hệ thống NutriWise. Module này đảm bảo người dùng có thể truy cập hệ thống một cách an toàn và được phân quyền phù hợp với vai trò của họ.

## Mục tiêu nghiệp vụ

### Mục tiêu chính
- Cho phép người dùng đăng ký và đăng nhập vào hệ thống
- Quản lý phân quyền theo vai trò khác nhau
- Đảm bảo bảo mật thông tin tài khoản
- Hỗ trợ đăng nhập bằng mạng xã hội

### Lợi ích kinh doanh
- Tăng trải nghiệm người dùng với đăng nhập đa dạng
- Giảm rủi ro bảo mật với xác thực an toàn
- Quản lý hiệu quả các loại người dùng khác nhau
- Tăng tỷ lệ chuyển đổi với quy trình đăng ký đơn giản

## Chức năng nghiệp vụ

### Đăng ký và Đăng nhập
- **Đăng ký tài khoản**: Người dùng có thể tạo tài khoản mới với thông tin cơ bản
- **Đăng nhập truyền thống**: Sử dụng email/username và mật khẩu
- **Đăng nhập mạng xã hội**: Sử dụng Google hoặc Facebook
- **Quên mật khẩu**: Khôi phục mật khẩu qua email
- **Xác thực tài khoản**: Xác minh email để kích hoạt tài khoản

### Quản lý Tài khoản
- **Tạo tài khoản**: Admin có thể tạo tài khoản cho người dùng khác
- **Xem danh sách**: Admin xem được tất cả người dùng trong hệ thống
- **Cập nhật thông tin**: Admin có thể chỉnh sửa thông tin người dùng
- **Xóa tài khoản**: Admin có thể xóa tài khoản không hoạt động

### Phân quyền và Bảo mật
- **Quản lý vai trò**: Phân chia người dùng theo 4 vai trò chính
- **Kiểm soát truy cập**: Mỗi vai trò có quyền truy cập khác nhau
- **Bảo mật thông tin**: Mã hóa mật khẩu và bảo vệ dữ liệu cá nhân

## Các vai trò người dùng

### SystemAdmin (Quản trị viên hệ thống)
- **Quyền hạn**: Quản lý toàn bộ hệ thống
- **Chức năng chính**:
  - Tạo, xem, cập nhật, xóa tất cả người dùng
  - Quản lý nội dung và cấu hình hệ thống
  - Theo dõi hoạt động và báo cáo
- **Đối tượng**: Nhân viên quản trị hệ thống

### Nutritionist (Chuyên gia dinh dưỡng)
- **Quyền hạn**: Tư vấn dinh dưỡng và tạo kế hoạch ăn uống
- **Chức năng chính**:
  - Tạo meal plans cho người dùng
  - Tư vấn dinh dưỡng cá nhân hóa
  - Theo dõi tiến độ dinh dưỡng của khách hàng
- **Đối tượng**: Chuyên gia dinh dưỡng, bác sĩ dinh dưỡng

### Trainer (Huấn luyện viên)
- **Quyền hạn**: Quản lý khách hàng và gửi gợi ý tập luyện
- **Chức năng chính**:
  - Quản lý danh sách khách hàng
  - Gửi gợi ý tập luyện và dinh dưỡng
  - Theo dõi tiến độ tập luyện
- **Đối tượng**: Huấn luyện viên thể hình, PT

### User (Người dùng thông thường)
- **Quyền hạn**: Sử dụng các tính năng cơ bản của hệ thống
- **Chức năng chính**:
  - Quản lý thông tin cá nhân
  - Ghi lại bữa ăn và tập luyện
  - Xem báo cáo tiến độ
  - Nhận gợi ý từ chuyên gia
- **Đối tượng**: Người dùng cuối, khách hàng

## Quy trình nghiệp vụ

### Quy trình đăng ký
1. **Người dùng truy cập trang đăng ký**
2. **Điền thông tin cơ bản**: Username, email, mật khẩu
3. **Hệ thống kiểm tra tính hợp lệ** của thông tin
4. **Tạo tài khoản** với vai trò mặc định là User
5. **Gửi email xác thực** để kích hoạt tài khoản
6. **Người dùng xác thực email** để hoàn tất đăng ký

### Quy trình đăng nhập
1. **Người dùng truy cập trang đăng nhập**
2. **Chọn phương thức đăng nhập**:
   - Đăng nhập truyền thống (email/username + password)
   - Đăng nhập Google
   - Đăng nhập Facebook
3. **Hệ thống xác thực thông tin**
4. **Chuyển hướng vào hệ thống** với quyền truy cập phù hợp

### Quy trình quên mật khẩu
1. **Người dùng chọn "Quên mật khẩu"**
2. **Nhập email đã đăng ký**
3. **Hệ thống gửi email** chứa link reset mật khẩu
4. **Người dùng click link** và đặt mật khẩu mới
5. **Xác nhận thay đổi** và đăng nhập lại

### Quy trình quản lý người dùng (Admin)
1. **Admin đăng nhập** vào hệ thống quản trị
2. **Xem danh sách tất cả người dùng**
3. **Thực hiện các thao tác**:
   - Tạo tài khoản mới
   - Cập nhật thông tin người dùng
   - Thay đổi vai trò người dùng
   - Xóa tài khoản không hoạt động

## Thông tin người dùng

### Thông tin cơ bản
- **ID**: Mã định danh duy nhất
- **Username**: Tên đăng nhập (không trùng lặp)
- **Email**: Địa chỉ email (không trùng lặp)
- **Vai trò**: User, Trainer, Nutritionist, SystemAdmin
- **Trạng thái xác thực**: Đã xác thực hay chưa
- **Trạng thái tài khoản**: Hoạt động hay đã xóa

### Thông tin mạng xã hội
- **Google ID**: ID từ tài khoản Google (nếu có)
- **Facebook ID**: ID từ tài khoản Facebook (nếu có)
- **Ảnh đại diện**: URL ảnh từ mạng xã hội
- **Tên hiển thị**: Tên từ mạng xã hội
- **Ngôn ngữ**: Ngôn ngữ ưa thích
- **Múi giờ**: Múi giờ địa phương

### Thông tin bảo mật
- **Token reset mật khẩu**: Mã để khôi phục mật khẩu
- **Thời gian hết hạn token**: Thời gian token có hiệu lực
- **Thời gian tạo tài khoản**: Ngày đăng ký
- **Thời gian cập nhật cuối**: Lần chỉnh sửa gần nhất

## Yêu cầu nghiệp vụ

### Yêu cầu chức năng
- Hệ thống phải hỗ trợ đăng ký bằng email và mật khẩu
- Hệ thống phải hỗ trợ đăng nhập bằng Google và Facebook
- Hệ thống phải có chức năng quên mật khẩu
- Hệ thống phải phân quyền theo vai trò
- Admin phải có thể quản lý tất cả người dùng

### Yêu cầu phi chức năng
- **Bảo mật**: Mật khẩu phải được mã hóa
- **Hiệu suất**: Thời gian đăng nhập < 3 giây
- **Khả năng sử dụng**: Giao diện đơn giản, dễ hiểu
- **Tính sẵn sàng**: Hệ thống hoạt động 99.9% thời gian
- **Khả năng mở rộng**: Hỗ trợ 10,000+ người dùng đồng thời

### Yêu cầu nghiệp vụ
- **Tuân thủ quy định**: Tuân thủ GDPR về bảo vệ dữ liệu
- **Báo cáo**: Cung cấp báo cáo về hoạt động người dùng
- **Kiểm toán**: Ghi log tất cả thao tác quan trọng
- **Sao lưu**: Sao lưu dữ liệu người dùng định kỳ

## KPI và Metrics

### KPI chính
- **Tỷ lệ đăng ký thành công**: > 95%
- **Tỷ lệ đăng nhập thành công**: > 98%
- **Thời gian phản hồi**: < 2 giây
- **Tỷ lệ sử dụng OAuth**: 30-40%

### Metrics theo dõi
- **Số lượng đăng ký mới** theo ngày/tuần/tháng
- **Số lượng đăng nhập** theo phương thức
- **Phân bố vai trò người dùng**
- **Tỷ lệ người dùng hoạt động**
- **Số lượng yêu cầu reset mật khẩu**

## Rủi ro và Giải pháp

### Rủi ro bảo mật
- **Rủi ro**: Tài khoản bị hack
- **Giải pháp**: Mã hóa mật khẩu, xác thực 2 yếu tố
- **Rủi ro**: Dữ liệu bị rò rỉ
- **Giải pháp**: Mã hóa dữ liệu, tuân thủ GDPR

### Rủi ro kỹ thuật
- **Rủi ro**: Hệ thống quá tải
- **Giải pháp**: Tối ưu hiệu suất, mở rộng hệ thống
- **Rủi ro**: Mất dữ liệu
- **Giải pháp**: Sao lưu định kỳ, khôi phục dữ liệu

### Rủi ro nghiệp vụ
- **Rủi ro**: Người dùng không hài lòng
- **Giải pháp**: Giao diện thân thiện, hỗ trợ khách hàng
- **Rủi ro**: Vi phạm quy định
- **Giải pháp**: Tuân thủ pháp luật, kiểm toán định kỳ 