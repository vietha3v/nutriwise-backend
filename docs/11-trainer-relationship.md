# 👨‍💼 11. Quản lý mối quan hệ Huấn luyện viên - Người dùng (Trainer-User Relationship)

## Chức năng:
- **Chế độ tìm kiếm huấn luyện viên**: Người dùng có thể bật chế độ "đang tìm huấn luyện viên"
- **Marketplace huấn luyện viên**: Chợ huấn luyện viên với khu vực, đặc điểm, profile sức khỏe
- **Hệ thống đăng ký huấn luyện viên**: Quy trình đăng ký và kiểm duyệt huấn luyện viên
- **Quảng cáo và khuyến mại**: Huấn luyện viên có thể tạo quảng cáo và kế hoạch khuyến mại
- **Tìm kiếm và kết nối**: Người dùng tìm kiếm và kết nối với huấn luyện viên
- **Hệ thống matching**: AI gợi ý huấn luyện viên phù hợp dựa trên mục tiêu, vị trí, ngân sách
- **Theo dõi tiến độ**: Huấn luyện viên theo dõi tiến độ của người dùng
- **Gửi gợi ý**: Huấn luyện viên gửi gợi ý dinh dưỡng và tập luyện
- **Quản lý danh sách**: Người dùng quản lý danh sách huấn luyện viên
- **Thu hồi quyền**: Người dùng có thể thu hồi quyền truy cập của huấn luyện viên
- **Đánh giá và review**: Hệ thống đánh giá huấn luyện viên

## Chế độ tìm kiếm huấn luyện viên:
- **Bật/tắt chế độ**: Người dùng có thể bật chế độ "đang tìm huấn luyện viên"
- **Thông tin hiển thị**: Profile sức khỏe, thông tin cá nhân, mục tiêu, khu vực
- **Đặc điểm cần thiết**: Yêu cầu về chuyên môn, giá cả, thời gian, phương pháp
- **Khu vực tìm kiếm**: Địa chỉ, bán kính tìm kiếm, hỗ trợ online/offline
- **Thời gian hiển thị**: Thời gian muốn hiển thị trong marketplace
- **Trạng thái**: ACTIVE, INACTIVE, PAUSED

## Marketplace huấn luyện viên:
- **Danh sách người dùng tìm kiếm**: Hiển thị người dùng đang tìm huấn luyện viên
- **Bộ lọc thông minh**: Lọc theo khu vực, đặc điểm, mục tiêu, ngân sách
- **Xem profile chi tiết**: Huấn luyện viên có thể xem profile sức khỏe và thông tin cá nhân
- **Gửi đề xuất**: Huấn luyện viên gửi đề xuất và giới thiệu dịch vụ
- **Chat trực tiếp**: Hệ thống chat để trao đổi trước khi kết nối
- **Đặt lịch tư vấn**: Sắp xếp buổi tư vấn miễn phí hoặc có phí

## Hệ thống đăng ký huấn luyện viên:
- **Đăng ký cơ bản**: Thông tin cá nhân, chuyên môn, kinh nghiệm
- **Tải chứng chỉ**: Upload các chứng chỉ chuyên môn và bằng cấp
- **Kiểm duyệt hồ sơ**: Admin kiểm duyệt thông tin và chứng chỉ
- **Phỏng vấn**: Buổi phỏng vấn online/offline để đánh giá năng lực
- **Chứng nhận**: Cấp chứng nhận huấn luyện viên chính thức
- **Đào tạo**: Khóa đào tạo về sử dụng hệ thống và quy trình làm việc
- **Trạng thái**: PENDING, APPROVED, REJECTED, SUSPENDED

## Quảng cáo và khuyến mại:
- **Tạo quảng cáo**: Huấn luyện viên tạo quảng cáo để nổi bật
- **Kế hoạch khuyến mại**: Giảm giá, gói dịch vụ, ưu đãi đặc biệt
- **Targeting**: Nhắm đối tượng theo khu vực, mục tiêu, ngân sách
- **Budget và bidding**: Thiết lập ngân sách quảng cáo và giá thầu
- **Thống kê hiệu quả**: Theo dõi lượt xem, click, chuyển đổi
- **A/B testing**: Thử nghiệm các nội dung quảng cáo khác nhau
- **Trạng thái quảng cáo**: ACTIVE, PAUSED, COMPLETED, REJECTED

## Phân quyền:
- **Trainer (Huấn luyện viên)**:
  - Xem profile và tiến độ của người dùng được kết nối
  - Gửi gợi ý dinh dưỡng và tập luyện
  - Theo dõi hoạt động ăn uống và tập luyện
  - Không thể xem danh sách huấn luyện viên khác của người dùng
  - Không thể xem thông tin cá nhân nhạy cảm
  - Tạo quảng cáo và khuyến mại
  - Xem marketplace người dùng tìm kiếm
  - Gửi đề xuất cho người dùng
- **User (Người dùng)**:
  - Tìm kiếm và kết nối với nhiều huấn luyện viên
  - Quản lý danh sách huấn luyện viên
  - Thu hồi quyền truy cập của huấn luyện viên
  - Đánh giá và review huấn luyện viên
  - Nhận gợi ý từ các huấn luyện viên
  - Bật/tắt chế độ tìm kiếm huấn luyện viên
- **Admin (Quản trị viên)**:
  - Kiểm duyệt đăng ký huấn luyện viên
  - Quản lý quảng cáo và khuyến mại
  - Xử lý khiếu nại và tranh chấp

## Thông tin mối quan hệ:
- **Trạng thái kết nối**: PENDING, ACTIVE, INACTIVE, BLOCKED
- **Quyền truy cập**: PROFILE_VIEW, MEAL_VIEW, EXERCISE_VIEW, GOAL_VIEW
- **Ghi chú**: Ghi chú của huấn luyện viên về người dùng
- **Đánh giá**: Rating và review của người dùng
- **Thời gian kết nối**: Ngày bắt đầu và kết thúc
- **Phí dịch vụ**: Chi phí dịch vụ và phương thức thanh toán

## Thông tin huấn luyện viên:
- **Chuyên môn**: Dinh dưỡng, tập luyện, giảm cân, tăng cơ, yoga, pilates
- **Chứng chỉ**: Các chứng chỉ chuyên môn và kinh nghiệm
- **Kinh nghiệm**: Số năm kinh nghiệm, số khách hàng đã hỗ trợ
- **Vị trí**: Địa chỉ, khoảng cách, hỗ trợ online/offline
- **Đánh giá**: Rating trung bình, số lượng review
- **Giá cả**: Phí dịch vụ theo tháng/buổi
- **Giờ làm việc**: Lịch làm việc và thời gian có sẵn
- **Phương pháp**: Cách tiếp cận và phương pháp huấn luyện
- **Đối tượng mục tiêu**: Nhóm người dùng phù hợp
- **Trạng thái kiểm duyệt**: PENDING, APPROVED, REJECTED, SUSPENDED
- **Quảng cáo**: Danh sách quảng cáo và khuyến mại đang chạy

## Loại gợi ý:
- **Gợi ý dinh dưỡng**: Thực đơn, thực phẩm, bữa ăn
- **Gợi ý tập luyện**: Bài tập, lịch tập, cường độ
- **Gợi ý lối sống**: Thói quen, giấc ngủ, stress management
- **Gợi ý mục tiêu**: Điều chỉnh mục tiêu dinh dưỡng
- **Đề xuất dịch vụ**: Giới thiệu gói dịch vụ và khuyến mại

## Tiêu chí matching:
- **Mục tiêu**: Phù hợp với mục tiêu của người dùng (giảm cân, tăng cơ, cải thiện sức khỏe)
- **Vị trí**: Khoảng cách địa lý và khả năng hỗ trợ online/offline
- **Ngân sách**: Phù hợp với khả năng tài chính của người dùng
- **Chuyên môn**: Chuyên môn phù hợp với nhu cầu cụ thể
- **Đánh giá**: Rating và review từ người dùng khác
- **Tính khả dụng**: Thời gian làm việc phù hợp với lịch của người dùng
- **Phương pháp**: Cách tiếp cận phù hợp với sở thích và khả năng
- **Quảng cáo**: Ưu tiên huấn luyện viên có quảng cáo phù hợp

## API Endpoints:

### Quản lý mối quan hệ:
- `POST /trainer-relationships` - Tạo mối quan hệ mới
- `GET /trainer-relationships` - Lấy danh sách mối quan hệ
- `GET /trainer-relationships/:id` - Xem chi tiết mối quan hệ
- `PATCH /trainer-relationships/:id` - Cập nhật mối quan hệ
- `DELETE /trainer-relationships/:id` - Xóa mối quan hệ

### API cho huấn luyện viên:
- `GET /trainer-relationships/my-clients` - Danh sách khách hàng
- `GET /trainer-relationships/:id/client-progress` - Tiến độ khách hàng
- `POST /trainer-relationships/:id/suggestions` - Gửi gợi ý
- `GET /trainer-relationships/:id/suggestions` - Lịch sử gợi ý

### API cho người dùng:
- `GET /trainer-relationships/my-trainers` - Danh sách huấn luyện viên
- `GET /trainer-relationships/:id/trainer-suggestions` - Gợi ý từ huấn luyện viên
- `POST /trainer-relationships/:id/review` - Đánh giá huấn luyện viên

### Marketplace và tìm kiếm:
- `GET /marketplace/users` - Danh sách người dùng đang tìm huấn luyện viên
- `GET /marketplace/trainers` - Danh sách huấn luyện viên có sẵn
- `POST /marketplace/search-mode` - Bật/tắt chế độ tìm kiếm
- `GET /marketplace/search-mode` - Xem trạng thái chế độ tìm kiếm
- `POST /marketplace/proposals` - Gửi đề xuất cho người dùng
- `GET /marketplace/proposals` - Xem đề xuất đã gửi

### Tìm kiếm và matching:
- `GET /trainers/search` - Tìm kiếm huấn luyện viên
- `GET /trainers/matching` - Gợi ý huấn luyện viên phù hợp
- `GET /trainers/:id` - Chi tiết huấn luyện viên
- `GET /trainers/:id/reviews` - Đánh giá huấn luyện viên
- `POST /trainers/:id/request-connection` - Yêu cầu kết nối

### Đăng ký huấn luyện viên:
- `POST /trainer-registration` - Đăng ký làm huấn luyện viên
- `GET /trainer-registration/status` - Xem trạng thái đăng ký
- `POST /trainer-registration/documents` - Upload chứng chỉ
- `GET /trainer-registration/documents` - Xem danh sách chứng chỉ
- `POST /trainer-registration/interview` - Đặt lịch phỏng vấn

### Quảng cáo và khuyến mại:
- `POST /advertisements` - Tạo quảng cáo mới
- `GET /advertisements` - Danh sách quảng cáo
- `GET /advertisements/:id` - Chi tiết quảng cáo
- `PATCH /advertisements/:id` - Cập nhật quảng cáo
- `DELETE /advertisements/:id` - Xóa quảng cáo
- `POST /promotions` - Tạo khuyến mại mới
- `GET /promotions` - Danh sách khuyến mại
- `GET /promotions/:id` - Chi tiết khuyến mại
- `PATCH /promotions/:id` - Cập nhật khuyến mại
- `DELETE /promotions/:id` - Xóa khuyến mại

## Workflow thực tế:

### Cho người dùng tìm huấn luyện viên:
1. **Bật chế độ tìm kiếm**: Người dùng bật chế độ "đang tìm huấn luyện viên"
2. **Cập nhật thông tin**: Điền đầy đủ thông tin cá nhân, mục tiêu, khu vực
3. **Hiển thị trong marketplace**: Profile xuất hiện trong chợ huấn luyện viên
4. **Nhận đề xuất**: Huấn luyện viên gửi đề xuất và giới thiệu
5. **Chat và tư vấn**: Trao đổi trực tiếp với huấn luyện viên
6. **Lựa chọn và kết nối**: Chọn huấn luyện viên phù hợp và kết nối
7. **Thanh toán**: Thanh toán phí dịch vụ qua hệ thống wallet
8. **Bắt đầu dịch vụ**: Huấn luyện viên bắt đầu theo dõi và tư vấn

### Cho huấn luyện viên:
1. **Đăng ký**: Điền thông tin và upload chứng chỉ
2. **Kiểm duyệt**: Admin kiểm duyệt hồ sơ và phỏng vấn
3. **Chứng nhận**: Nhận chứng nhận huấn luyện viên chính thức
4. **Tạo quảng cáo**: Tạo quảng cáo và khuyến mại để nổi bật
5. **Xem marketplace**: Xem danh sách người dùng đang tìm kiếm
6. **Gửi đề xuất**: Gửi đề xuất cho người dùng phù hợp
7. **Chat và tư vấn**: Trao đổi với người dùng tiềm năng
8. **Kết nối và thanh toán**: Kết nối và nhận thanh toán qua hệ thống wallet
9. **Cung cấp dịch vụ**: Theo dõi tiến độ và gửi gợi ý cho khách hàng

## Cấu trúc thư mục:
```
src/trainer-relationship/
├── trainer-relationship.controller.ts
├── trainer-relationship.module.ts
├── trainer-relationship.service.ts
├── dto/
│   ├── create-trainer-relationship.dto.ts
│   ├── create-advertisement.dto.ts
│   └── create-promotion.dto.ts
└── entities/
    ├── trainer-relationship.entity.ts
    ├── trainer-suggestion.entity.ts
    ├── advertisement.entity.ts
    └── promotion.entity.ts
```

## Database Schema:
- **trainer_relationships**: Mối quan hệ giữa huấn luyện viên và người dùng
- **trainer_suggestions**: Gợi ý từ huấn luyện viên cho người dùng
- **advertisements**: Quảng cáo của huấn luyện viên
- **promotions**: Khuyến mại và ưu đãi
- **trainer_registrations**: Hồ sơ đăng ký huấn luyện viên 