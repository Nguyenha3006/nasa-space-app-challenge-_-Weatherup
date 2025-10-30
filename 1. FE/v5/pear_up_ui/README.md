# weatherUP - Vue.js Application

Ứng dụng weatherUP được xây dựng bằng Vue.js 3 và Element UI để giúp người dùng lên kế hoạch các hoạt động ngoài trời dựa trên phân tích thời tiết.

## Tính năng chính

- **Hero Section**: Giao diện chào mừng với nút bắt đầu
- **Weather Trends**: Biểu đồ thời tiết theo thành phố và thời gian
- **Weather Conditions**: Hiển thị các điều kiện thời tiết được phân tích
- **Activities Selection**: Chọn các hoạt động ngoài trời
- **Location & Date Form**: Chọn địa điểm và thời gian với bản đồ tương tác
- **Risk Assessment**: Đánh giá rủi ro thời tiết cho các hoạt động đã chọn
- **Weather Trends Overview**: Tổng quan xu hướng thời tiết
- **Personalized Tips**: Lời khuyên cá nhân hóa theo hoạt động

## Công nghệ sử dụng

- **Vue.js 3**: Framework JavaScript reactive
- **Element Plus**: UI component library
- **Chart.js**: Thư viện biểu đồ
- **Leaflet**: Thư viện bản đồ tương tác
- **Font Awesome**: Icon library
- **Vite**: Build tool

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository** (nếu có):
```bash
git clone <repository-url>
cd vue-project-pearUp
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Chạy ứng dụng ở chế độ development**:
```bash
npm run dev
```

4. **Build cho production**:
```bash
npm run build
```

5. **Preview build**:
```bash
npm run preview
```

## Cấu trúc dự án

```
src/
├── components/           # Vue components
│   ├── HeroSection.vue
│   ├── WeatherTrendsSection.vue
│   ├── WeatherConditionsSection.vue
│   ├── ActivitiesSection.vue
│   ├── LocationDateForm.vue
│   └── ResultsSection.vue
├── assets/              # Static assets
│   ├── main.css
│   ├── weather-up.css
│   └── mf.png
├── App.vue              # Main app component
└── main.js              # Entry point
```

## Hướng dẫn sử dụng

1. **Mở ứng dụng**: Truy cập `http://localhost:5173` (hoặc port được hiển thị)

2. **Chọn hoạt động**: Scroll xuống phần "Choose Your Activities" và chọn các hoạt động bạn muốn thực hiện

3. **Nhập địa điểm**: Trong phần "Location & Date Selection", nhập địa điểm hoặc click trên bản đồ

4. **Chọn thời gian**: Chọn tháng và ngày bạn dự định thực hiện hoạt động

5. **Phân tích rủi ro**: Click nút "Analyze Weather Risk" để xem kết quả

6. **Xem kết quả**: Ứng dụng sẽ hiển thị:
   - Đánh giá rủi ro cho từng yếu tố thời tiết
   - Xu hướng thời tiết lịch sử
   - Lời khuyên cá nhân hóa

## API sử dụng

- **OpenStreetMap Nominatim**: Để geocoding địa điểm
- **Leaflet**: Hiển thị bản đồ tương tác

## Lưu ý

- Ứng dụng sử dụng dữ liệu mô phỏng cho biểu đồ và đánh giá rủi ro
- Để sử dụng trong production, cần tích hợp với API thời tiết thực tế
- Bản đồ yêu cầu kết nối internet để tải tile

## Troubleshooting

### Lỗi thường gặp

1. **Lỗi npm không tìm thấy**:
   - Đảm bảo Node.js đã được cài đặt
   - Kiểm tra PATH environment variable

2. **Lỗi Leaflet markers**:
   - Đã được sửa trong code bằng cách cấu hình marker URLs

3. **Lỗi Chart.js**:
   - Đảm bảo Chart.js được import và register đúng cách

4. **Lỗi styling**:
   - Kiểm tra file weather-up.css đã được import
   - Đảm bảo Font Awesome đã được cài đặt

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## License

MIT License