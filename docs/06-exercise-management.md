# 💪 6. Quản lý tập luyện (Exercise Management)

## **Mục tiêu nghiệp vụ:**
Hệ thống quản lý tập luyện giúp người dùng:
- **Chọn bài tập phù hợp**: Dựa trên mục tiêu, bộ phận cơ thể, mức độ kỹ năng
- **Tập luyện có hướng dẫn**: Video YouTube, hướng dẫn chi tiết từng bước
- **Theo dõi tiến độ**: Ghi lại lịch sử tập, tính calo đốt cháy
- **Đạt mục tiêu**: Giảm cân, tăng cơ, cải thiện sức khỏe

## **Quy trình nghiệp vụ:**

### **1. Người dùng chọn bài tập:**
- Xem danh sách bài tập mẫu (templates)
- Lọc theo: bộ phận cơ thể, loại tập, mức độ khó
- Xem video hướng dẫn và thông tin chi tiết
- Chọn bài tập phù hợp với mục tiêu

### **2. Bắt đầu phiên tập:**
- Chọn thời gian bắt đầu
- Tập theo video hướng dẫn
- Ghi lại thời gian tập thực tế
- Thêm ghi chú cá nhân

### **3. Kết thúc và lưu kết quả:**
- Hệ thống tự động tính calo đốt cháy
- Lưu vào lịch sử tập luyện
- Cập nhật thống kê tổng thể

### **4. Xem thống kê và tiến độ:**
- Tổng số buổi tập, thời gian, calo
- So sánh với mục tiêu đặt ra
- Theo dõi xu hướng cải thiện

## **Yêu cầu chức năng:**

### **1. Quản lý bài tập mẫu (Templates):**
- **Tạo bài tập**: Admin tạo bài tập với video, hướng dẫn, thông tin dinh dưỡng
- **Phân loại**: Theo bộ phận cơ thể, loại tập, mức độ khó
- **Video hướng dẫn**: Link YouTube với thumbnail tự động
- **Hướng dẫn chi tiết**: Các bước tập từng động tác
- **Thông tin dinh dưỡng**: Calo/phút, dụng cụ cần thiết

### **2. Phiên tập luyện (Sessions):**
- **Chọn bài tập**: Từ danh sách templates có sẵn
- **Bắt đầu tập**: Ghi lại thời gian bắt đầu
- **Theo dõi thời gian**: Ghi lại thời gian tập thực tế
- **Tính calo**: Tự động tính dựa trên thời gian và calo/phút
- **Lưu lịch sử**: Ghi chú, thời gian, calo đốt cháy

### **3. Tìm kiếm và lọc:**
- **Theo bộ phận**: Toàn thân, thân trên, thân dưới, cơ bụng, tay, chân, lưng, ngực
- **Theo loại tập**: Cardio, Strength, Flexibility, Balance, HIIT, Yoga, Pilates
- **Theo mức độ**: 1-5 (Beginner đến Expert)
- **Tìm kiếm**: Theo tên bài tập

### **4. Thống kê và báo cáo:**
- **Tổng phiên tập**: Số buổi tập trong khoảng thời gian
- **Tổng thời gian**: Tổng thời gian tập (phút)
- **Tổng calo**: Tổng calo đốt cháy
- **So sánh mục tiêu**: Với mục tiêu đặt ra
- **Xu hướng**: Biểu đồ tiến độ theo thời gian

## **Quy tắc nghiệp vụ:**

### **1. Bài tập mẫu (Templates):**
- **Chỉ admin tạo**: Người dùng không thể tạo/sửa/xóa templates
- **Thông tin bắt buộc**: Tên, loại tập, bộ phận cơ thể, mức độ khó, calo/phút
- **Video YouTube**: Phải có link video và thumbnail
- **Hướng dẫn**: Ít nhất 3 bước hướng dẫn chi tiết
- **Phân loại**: Mỗi bài tập phải có ít nhất 1 bộ phận cơ thể và 1 loại tập

### **2. Phiên tập luyện (Sessions):**
- **Dựa trên template**: Phải chọn từ templates có sẵn
- **Thời gian**: Bắt đầu và kết thúc phải hợp lý (không âm, không quá dài)
- **Calo tự động**: Tính theo công thức: `calo/phút × thời gian tập`
- **Ghi chú**: Tùy chọn, tối đa 500 ký tự
- **Lịch sử**: Không thể xóa, chỉ có thể cập nhật ghi chú

### **3. Tìm kiếm và lọc:**
- **Query params**: `?bodyPart=FullBody&exerciseType=Cardio&difficultyLevel=3&search=yoga&page=1&limit=20`
- **Lọc kết hợp**: Có thể lọc theo nhiều tiêu chí cùng lúc
- **Tìm kiếm**: Không phân biệt hoa thường, tìm trong tên và mô tả
- **Sắp xếp**: Mặc định theo tên A-Z, có thể sắp xếp theo mức độ khó
- **Phân trang**: Tối đa 20 bài tập/trang

### **4. Thống kê:**
- **Thời gian**: Có thể xem theo ngày, tuần, tháng, năm
- **So sánh**: Với mục tiêu đặt ra (nếu có)
- **Xu hướng**: Hiển thị biểu đồ tiến độ
- **Báo cáo**: Có thể export PDF/Excel

## **Kịch bản sử dụng:**

### **Kịch bản 1: Người dùng mới bắt đầu tập**
1. **Mở app** → Chọn "Tập luyện"
2. **Xem danh sách** → Lọc theo "Beginner" + "FullBody"
3. **Chọn bài tập** → "Cardio cơ bản 20 phút"
4. **Xem video** → Xem hướng dẫn chi tiết
5. **Bắt đầu tập** → Ghi lại thời gian bắt đầu
6. **Tập theo video** → Thực hiện các động tác
7. **Kết thúc** → Ghi lại thời gian kết thúc
8. **Lưu kết quả** → Hệ thống tính calo tự động

### **Kịch bản 2: Người dùng có kinh nghiệm**
1. **Lọc nâng cao** → "Advanced" + "UpperBody" + "Strength"
2. **Chọn bài tập** → "Tập tạ tay 45 phút"
3. **Xem hướng dẫn** → Đọc kỹ các bước tập
4. **Bắt đầu tập** → Ghi lại thời gian
5. **Tập luyện** → Thực hiện theo hướng dẫn
6. **Ghi chú** → "Tập tốt, tăng tạ lên 2kg"
7. **Kết thúc** → Lưu kết quả

### **Kịch bản 3: Xem thống kê tiến độ**
1. **Vào lịch sử** → Chọn "Lịch sử tập luyện"
2. **Xem thống kê** → Tổng số buổi, thời gian, calo
3. **So sánh mục tiêu** → Với mục tiêu đặt ra
4. **Xem xu hướng** → Biểu đồ tiến độ theo thời gian
5. **Export báo cáo** → Tải PDF/Excel

## **Yêu cầu kỹ thuật:**

### **1. Database:**
- **2 bảng chính**: `exercise_templates` và `exercise_sessions`
- **Quan hệ**: Sessions liên kết với Templates qua `templateId`
- **Index**: Tối ưu cho tìm kiếm theo `bodyPart`, `exerciseType`, `difficultyLevel`
- **Constraints**: Đảm bảo tính toàn vẹn dữ liệu

### **2. API Endpoints:**
- **Templates**: GET (với query params cho filter), POST (admin), PATCH (admin), DELETE (admin)
- **Sessions**: GET, POST, PATCH, DELETE
- **Stats**: GET thống kê theo thời gian

### **3. Tính toán:**
- **Calo**: Tự động tính theo công thức `calo/phút × thời gian`
- **Thời gian**: Sử dụng ISO timestamp để đảm bảo tính nhất quán
- **Validation**: Kiểm tra thời gian hợp lệ, không âm, không quá dài

### **4. Performance:**
- **Caching**: Cache danh sách templates (ít thay đổi)
- **Pagination**: Phân trang cho danh sách lớn
- **Search**: Tối ưu tìm kiếm với full-text search

## **Rủi ro và giảm thiểu:**

### **1. Rủi ro nghiệp vụ:**
- **Video không hoạt động**: Kiểm tra link YouTube trước khi lưu
- **Thông tin sai**: Validation nghiêm ngặt cho templates
- **Calo không chính xác**: Sử dụng công thức khoa học đã được kiểm chứng
- **Người dùng không hiểu**: Hướng dẫn chi tiết, video minh họa

### **2. Rủi ro kỹ thuật:**
- **Performance**: Cache templates, tối ưu database
- **Security**: Validate input, prevent SQL injection
- **Data loss**: Backup thường xuyên, transaction
- **Scalability**: Phân trang, lazy loading

### **3. Rủi ro người dùng:**
- **Khó sử dụng**: UI/UX thân thiện, hướng dẫn rõ ràng
- **Không có bài tập phù hợp**: Đa dạng templates, lọc linh hoạt
- **Mất động lực**: Thống kê tiến độ, mục tiêu, khuyến khích

## **Kế hoạch triển khai:**

### **Phase 1: Core Features (2 tuần)**
- Tạo entities và database
- API cơ bản cho templates và sessions
- Tính toán calo tự động
- UI cơ bản cho người dùng

### **Phase 2: Advanced Features (1 tuần)**
- Tìm kiếm và lọc nâng cao
- Thống kê và báo cáo
- Admin panel quản lý templates
- Tối ưu performance

### **Phase 3: Polish (1 tuần)**
- UI/UX cải thiện
- Testing và bug fix
- Documentation
- Deployment

## **Success Metrics:**
- **Người dùng**: 80% người dùng tạo ít nhất 1 session/tuần
- **Engagement**: Trung bình 3 buổi tập/tuần
- **Retention**: 70% người dùng tiếp tục sau 1 tháng
- **Satisfaction**: 4.5/5 rating từ người dùng 