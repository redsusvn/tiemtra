# Findings: Kiến trúc và Cơ chế bảo vệ Game "Tiệm Trà Nhỏ"

## 1. Thông tin tổng quan
- **Tên game:** Tiệm Trà Nhỏ (Quán trà sữa mô phỏng kinh doanh).
- **Phiên bản:** `trasua-3.11.1` (theo Service Worker cache version).
- **Nguồn gốc:** Chạy trên Cloudflare Workers tại `https://trongnhi.trongnhi110266.workers.dev/`.
- **Cơ chế lưu trữ:** LocalStorage / Cache Storage (PWA).

## 2. Cơ chế bảo vệ & Obfuscation
1. **Kiểm tra Host (Anti-Clone):**
   - Nằm trong `<script>` đầu trang `index.html`.
   - Sử dụng hàm băm chuỗi ký tự theo thuật toán DJB2 biến thể:
     ```javascript
     function H(t){
       var a=5381,b=52711;
       for(var i=0;i<t.length;i++){
         var c=t.charCodeAt(i);
         a=((a*33)^c)>>>0;
         b=(b*31+c)>>>0;
       }
       return a.toString(36)+"-"+b.toString(36);
     }
     ```
   - Đã gỡ bỏ và bypass bằng `window.tsHostOk = () => true`.

2. **Mã hóa Payload JavaScript Core:**
   - Đã giải mã chuỗi Base64/XOR `D` thành file `game.js` sạch sẽ với 9.612 dòng code.

## 3. Danh mục tài nguyên (Full Asset List)
- Đầy đủ 122 assets (ảnh, icon, font Baloo 2, âm thanh 4 mùa, manifest).

## 4. Phát hiện về Cơ chế Trộm Cắp, Khách Hãm & Sự Cố Trong Game
Khi phân tích sâu `game.js`, phát hiện nhiều cơ chế thú vị được tác giả cài cắm:
1. **Trộm cạy két đêm & Tai hoạ ngẫu nhiên (`BAD` array & `mkBadPlan`):**
   - Game có mảng sự kiện xấu `BAD`:
     - `trom`: Đêm qua trộm cạy két, lấy sạch tiền / một phần tiền.
     - `thue`: Cơ quan thuế phát hiện doanh thu không khớp sổ sách, tịch thu tài sản hoặc phạt tiền.
     - `qltt`: Quản lý thị trường kiểm tra tiền mặt lớn không rõ nguồn gốc hoặc nhắc lỗi vệ sinh, phạt tiền.
     - `lua`: Kẻ gian giả danh ngân hàng gọi tới, lừa chuyển tiền.
     - `coin`: Đầu tư sàn tiền ảo lạ bị sập, mất trắng.
2. **Cơ chế Anti-Cheat bí mật của tác giả (`cheatHit()` & `sanitize()`):**
   - Trong `sanitize()`, game tính `cap = CFG.startMoney + S.day * 15000000`.
   - Nếu két tiền `S.money > cap` (người chơi sửa tiền hoặc két quá lớn trước ngày 30), game sẽ tự kích hoạt `cheatHit()` - trộm cạy két lấy sạch tiền và chỉ chừa lại 100k - 900k!
3. **Khách Hãm (`BRATS`):**
   - `bung`: Khách ôm ly bỏ chạy không trả tiền.
   - `mac`: Khách nhận ly xong ép trả giá rẻ hơn 20%.
   - `doi`: Khách đổi ý liên tục khi thanh kiên nhẫn tụt.
   - `hoi`: Khách hối thúc làm giảm kiên nhẫn.
   - `kho`: Khách khó tính bắt bẻ lỗi nhỏ.
4. **Bảo vệ (`guardLv()`):**
   - Trong code gốc tác giả để dở dang `const guardLv = () => 0; /* bảo vệ: chưa dùng */`.
   - Đã được Mod kích hoạt thành `guardLv = () => 2` (Bảo vệ VIP tóm 100% khách bùng và khách trả giá, thu hồi tiền đủ 100%).
