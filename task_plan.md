# Task Plan: Clone, Giải mã JS & Tạo Hack Mod Menu Game "Tiệm Trà Nhỏ"

## 1. Mục tiêu
- Clone toàn bộ tài nguyên game về thư mục `_tiem_tra_nho`.
- Giải mã (deobfuscate) đoạn mã JavaScript core game thành `game.js`.
- Phân tích cơ chế trộm cắp, sự cố ngẫu nhiên, khách bùng tiền.
- Tạo Floating Hack Mod Menu hoàn chỉnh cho game.
- Can thiệp trực tiếp vào memory (RAM) và đồng bộ lưu đĩa (localStorage) tức thì.
- Notification Toast trực quan, nổi bật trên tất cả các tác vụ.
- Đóng gói chuẩn cho Cloudflare Pages (Direct Upload ZIP & dist folder).

## 2. Các giai đoạn thực hiện

- [x] **Giai đoạn 1: Khởi tạo hồ sơ & Tải toàn bộ tài nguyên**
  - [x] Tải 122/122 assets (hình ảnh, âm thanh, icon, fonts Baloo 2, manifest).
- [x] **Giai đoạn 2: Giải mã JavaScript & Gỡ khóa Host**
  - [x] Giải mã chuỗi Base64/XOR `D` thành `game.js` sạch (Prettier 9,600+ dòng).
  - [x] Gỡ bỏ kiểm tra hostname `tsHostOk`.
- [x] **Giai đoạn 3: Phân tích cơ chế trộm cắp & Sự cố trong game**
  - [x] Phát hiện hệ thống sự cố ngẫu nhiên `BAD` (Trộm cạy két, Thuế phạt, QLTT kiểm tra, Lừa đảo, Tiền ảo).
  - [x] Phát hiện cơ chế Anti-cheat `cheatHit()` phạt reset tiền nếu két vượt trần.
  - [x] Phát hiện hệ thống khách hãm `BRATS` (ôm ly bỏ chạy, trả giá, đổi ý, hối thúc).
  - [x] Phát hiện chức năng bảo vệ `guardLv()` bị bỏ dở trong code gốc.
- [x] **Giai đoạn 4: Xây dựng Floating Hack/Mod Menu**
  - [x] Tạo `mod_menu.css`: Nút nổi FAB draggable và bảng điều khiển Dark Glassmorphism.
  - [x] Tạo `mod_menu.js`: Đầy đủ tính năng 5 nhóm (An ninh, Tiền tệ, Mở khóa, Kho hàng, Gameplay).
  - [x] Tích hợp vào `game.js` và `index.html`.
- [x] **Giai đoạn 5: Nâng Cấp Can Thiệp Memory Trực Tiếp & Toast Notification**
  - [x] Tạo hook hai chiều `window.getS()`, `window.setS()`, `window.gameSave()`, `window.gameHead()`, `window.gameRenderPrep()`.
  - [x] Thêm cơ chế ép lưu trực tiếp `localStorage['tsShop2']` song song với `save()`.
  - [x] Thêm notification toast `#ttn-mod-toast` với z-index 99999999 (nổi trên modal).
  - [x] Unregister Service Worker để tránh nạp cache cũ.
  - [x] Sửa lỗi cấu trúc `S.hired` trong mở khóa nhân viên.
- [x] **Giai đoạn 6: Kiểm thử Tự Động Toàn Diện & Trình Khởi Chạy (Launcher)**
  - [x] Viết và chạy thành công bộ test 11/11 tính năng qua Node.js VM (100% PASS).
  - [x] Tạo `server.js` độc lập không phụ thuộc thư viện ngoài với header chống cache.
  - [x] Tạo launcher 1-click `Chay_Game_TiemTraNho.bat` (ngoài root) và `start_game.bat` (trong thư mục).
- [x] **Giai đoạn 7: Đóng Gói Phân Phối Chuẩn Cloudflare Pages**
  - [x] Tạo thư mục sạch `dist_tiem_tra_nho\` (chỉ chứa file tĩnh game và mod, loại bỏ dev tools).
  - [x] Bổ sung cấu hình `_headers` (CORS `*`, tối ưu `Cache-Control` cho Cloudflare).
  - [x] Bổ sung cấu hình `_redirects` (`/* /index.html 200`).
  - [x] Nén thành file `tiem_tra_nho_cloudflare.zip` (6.65 MB, 131 files, `index.html` tại root).
