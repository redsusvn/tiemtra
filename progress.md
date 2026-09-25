# Progress: Nhật Ký Tiến Độ Dự Án "Tiệm Trà Nhỏ"

- **2026-09-25 21:43:** Hoàn thành phân tích cấu trúc, mã hóa, cơ chế bảo vệ và lập kế hoạch.
- **2026-09-25 21:45:** Tải thành công 122/122 assets từ server gốc về thư mục dự án.
- **2026-09-25 21:46:** Giải mã thành công payload JavaScript `D` bằng key trích xuất từ mảng `W` và protocol `file:`.
- **2026-09-25 21:47:** Định dạng chuẩn mã nguồn `game.js`, gỡ bỏ host checking `tsHostOk`.
- **2026-09-25 21:54:** Phân tích mã nguồn chuyên sâu:
  - Tìm ra cơ chế trộm cắp `trom`, phạt thuế `thue`, quản lý thị trường `qltt`, lừa đảo `lua`, sàn tiền ảo `coin`.
  - Tìm ra cơ chế anti-cheat của tác giả `cheatHit()` tự động tịch thu tiền nếu két quá lớn.
  - Tìm ra cơ chế khách bùng tiền `bung`, khách trả giá `mac`, khách hối `hoi`, khách đổi ý `doi`.
  - Kích hoạt cơ chế bảo vệ `guardLv = 2` vốn bị tác giả bỏ dở.
- **2026-09-25 21:58:**
  - Xây dựng hoàn tất `mod_menu.css` và `mod_menu.js` với Floating Button kéo thả và Dashboard 5 tab tính năng.
  - Vô hiệu hoá cơ chế phạt `cheatHit()` và giới hạn tiền két.
  - Tích hợp thành công vào `index.html`.
- **2026-09-25 22:08 - 22:14:**
  - Giải quyết dứt điểm các nguyên nhân gốc:
    1. Hàm cập nhật tiền header trong game là `head()`, không phải `renderHeader()`. Đã map đầy đủ vào `window.gameHook` và `window.gameHead`.
    2. Service Worker cache file cũ: Đã unregister và dọn dẹp sạch sẽ trong `index.html`.
    3. Tránh modal che khuất thông báo: Tạo riêng notification toast `#ttn-mod-toast` với `z-index: 99999999 !important`.
    4. Sửa lỗi gán thuộc tính `S.hired` trong `mod_menu.js` (nhân viên chỉ quản lý qua `S.upg`).
  - Kiểm thử tự động trên môi trường giả lập (Node.js VM): **11/11 bài test PASS 100%**:
    - Nạp +10M, +100M, +1 Tỷ, Đặt tiền tuỳ ý.
    - Xoá sạch nợ ngân hàng & nợ nóng.
    - Nạp đầy kho 999 mẻ hạn vĩnh viễn.
    - Siêu mở khóa toàn bộ cốt trà, topping, hương vị hoa quả, nâng cấp, nhân viên, bán online.
    - Thiết lập đánh giá 5 sao.
    - Dọn kho.
    - Đồng bộ trực tiếp vào Memory `window.S` và lưu xuống `localStorage['tsShop2']`.
  - Viết máy chủ Node.js không phụ thuộc package ngoài `server.js` (header no-cache).
  - Tạo các file khởi chạy 1-click `Chay_Game_TiemTraNho.bat` và `_tiem_tra_nho\start_game.bat`.
- **2026-09-25 22:20:**
  - Tạo gói phân phối tĩnh chuẩn cho Cloudflare Pages:
    - Thư mục sạch: `d:\game\html\dist_tiem_tra_nho\` (chỉ giữ lại các tài nguyên cần thiết cho game và mod, đã lọc sạch các script dev/test/bat).
    - Cấu hình Cloudflare: `_headers` (CORS `*`, `must-revalidate` cho html/js/css, `immutable` cho assets) và `_redirects`.
    - Tệp nén sẵn sàng tải lên: `d:\game\html\tiem_tra_nho_cloudflare.zip` (6.65 MB, 131 files, cấu trúc phẳng chuẩn `index.html` tại root).
