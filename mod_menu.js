/* ========== TIỆM TRÀ NHỎ - HACK MOD MENU v3.11 ========== */

(function () {
  'use strict';

  const MOD_STORAGE_KEY = 'ttn_mod_config';
  const POS_STORAGE_KEY = 'ttn_fab_pos';
  const GAME_SAVE_KEY = 'tsShop2';

  const defaultConfig = {
    antiTheft: true,
    superGuard: true,
    noBrats: true,
    unlimitedMoney: true,
    noSpoil: true,
    infinitePatience: true,
    zeroBills: false,
    zeroTax: false
  };

  let config = { ...defaultConfig };
  try {
    const saved = localStorage.getItem(MOD_STORAGE_KEY);
    if (saved) config = { ...config, ...JSON.parse(saved) };
  } catch (e) {}

  window.modConfig = config;

  function saveConfig() {
    try {
      localStorage.setItem(MOD_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {}
    applyDynamicMods();
  }

  // Lấy đối tượng Game State (S) trực tiếp trong memory
  function getS() {
    if (typeof window.getS === 'function') {
      const s = window.getS();
      if (s) return s;
    }
    if (window.gameHook && window.gameHook.S) {
      return window.gameHook.S;
    }
    return null;
  }

  // Lấy Runtime R
  function getR() {
    if (typeof window.getR === 'function') {
      const r = window.getR();
      if (r) return r;
    }
    if (window.gameHook && window.gameHook.R) {
      return window.gameHook.R;
    }
    return null;
  }

  function getHook() {
    return window.gameHook || {};
  }

  // Hiển thị Notification Toast nổi bật siêu cấp (z-index 99999999)
  function modToast(msg, type = 'success') {
    let t = document.getElementById('ttn-mod-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ttn-mod-toast';
      document.body.appendChild(t);
    }
    const icon = type === 'warn' ? '⚠️' : type === 'danger' ? '❌' : '⚡';
    t.innerHTML = `<span style="font-size:1.2rem">${icon}</span> <span>${msg}</span>`;
    t.className = 'show ' + (type || 'success');

    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.classList.remove('show');
    }, 2800);
  }

  // Cập nhật DOM và lưu dữ liệu trực tiếp vào memory + localStorage
  function commitState(customToast) {
    const S = getS();
    const h = getHook();

    // 1. Can thiệp trực tiếp vào memory
    if (S) {
      // 2. Lưu trực tiếp qua hàm save của game
      try {
        if (typeof window.gameSave === 'function') window.gameSave();
        else if (typeof window.save === 'function') window.save();
        else if (h.save) h.save();
      } catch (e) {
        console.warn('[MOD] save() error:', e);
      }
    }

    // 3. Dự phòng can thiệp trực tiếp vào localStorage disk
    try {
      if (S) {
        let raw = localStorage.getItem(GAME_SAVE_KEY);
        if (raw) {
          let parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            parsed.money = S.money;
            parsed.stock = S.stock;
            parsed.unlocked = S.unlocked;
            parsed.upg = S.upg;
            parsed.reviews = S.reviews;
            parsed.day = S.day;
            if (S.loan == null) delete parsed.loan;
            if (S.hot == null) delete parsed.hot;
            localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(parsed));
          }
        }
      }
    } catch (e) {
      console.warn('[MOD] localStorage direct sync error:', e);
    }

    // 4. Cập nhật ngay lập tức lên Header UI
    try {
      if (typeof window.gameHead === 'function') window.gameHead();
      else if (typeof window.head === 'function') window.head();
      else if (h.head) h.head();
    } catch (e) {}

    // 5. Cập nhật DOM #hMoney trực tiếp
    try {
      const el = document.getElementById('hMoney');
      if (el && S && S.money != null) {
        const fmtFn = h.fmt || window.fmt;
        el.textContent = fmtFn ? fmtFn(S.money) : Number(S.money).toLocaleString('vi-VN') + 'đ';
      }
    } catch (e) {}

    // 6. Cập nhật Prep Board
    try {
      if (typeof window.gameRenderPrep === 'function') window.gameRenderPrep();
      else if (typeof window.renderPrep === 'function') window.renderPrep();
      else if (h.renderPrep) h.renderPrep();
    } catch (e) {}

    // 7. Cập nhật Street nếu đang bán
    try {
      if (typeof window.renderStreet === 'function') window.renderStreet();
      else if (h.renderStreet) h.renderStreet();
    } catch (e) {}

    if (customToast) {
      modToast(customToast);
    }
  }

  function applyDynamicMods() {
    const h = getHook();
    if (!h || !h.CFG) return;

    if (config.zeroBills) {
      h.CFG.rent = 0;
      h.CFG.utilBase = 0;
      h.CFG.utilPerUpg = 0;
    }
    if (config.zeroTax) {
      h.CFG.vat = 0;
      h.CFG.pit = 0;
    }
  }

  // Khởi tạo giao diện
  function initModUI() {
    if (document.getElementById('ttn-fab-btn')) return;

    // 1. Nút nổi (Floating Button)
    const fab = document.createElement('div');
    fab.id = 'ttn-fab-btn';
    fab.innerHTML = '⚡<span class="badge">MOD</span>';
    fab.title = 'Tiệm Trà Nhỏ Hack Mod Menu';

    try {
      const savedPos = JSON.parse(localStorage.getItem(POS_STORAGE_KEY));
      if (savedPos && savedPos.top && savedPos.left) {
        fab.style.top = savedPos.top;
        fab.style.left = savedPos.left;
        fab.style.right = 'auto';
      }
    } catch (e) {}

    document.body.appendChild(fab);

    // 2. Modal Dashboard
    const modal = document.createElement('div');
    modal.id = 'ttn-mod-modal';
    modal.innerHTML = `
      <div class="ttn-mod-container">
        <!-- Header -->
        <div class="ttn-mod-header">
          <div class="ttn-mod-title">
            <span>⚡</span>
            <span>TIỆM TRÀ NHỎ - HACK MOD MENU</span>
          </div>
          <button class="ttn-mod-close" id="ttn-close-btn">&times;</button>
        </div>

        <!-- Navigation Tabs -->
        <div class="ttn-mod-tabs">
          <button class="ttn-tab-btn active" data-tab="security">🛡️ An Ninh</button>
          <button class="ttn-tab-btn" data-tab="money">💰 Tiền Tệ</button>
          <button class="ttn-tab-btn" data-tab="unlock">🔓 Mở Khóa</button>
          <button class="ttn-tab-btn" data-tab="stock">📦 Kho Hàng</button>
          <button class="ttn-tab-btn" data-tab="gameplay">⚡ Gameplay</button>
        </div>

        <!-- Modal Body Content -->
        <div class="ttn-mod-body">
          <!-- TAB 1: AN NINH & BẢO VỆ -->
          <div class="ttn-mod-pane active" id="pane-security">
            <div class="ttn-sec-box">
              <div class="ttn-sec-title">🛡️ Phòng Chống Trộm Cắp & Tai Họa</div>
              
              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Khiên Chống Trộm & Phạt (Anti-Theft)</div>
                  <div class="ttn-toggle-desc">Chống trộm cạy két đêm, chặn phạt thuế, quản lý thị trường kiểm tra, lừa đảo điện thoại và sàn tiền ảo sập.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-antiTheft" ${config.antiTheft ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Bảo Vệ VIP (100% Bắt Trộm & Bùng Tiền)</div>
                  <div class="ttn-toggle-desc">Tóm gọn 100% khách ôm ly chạy trốn (bùng tiền) và khách kì kèo trả giá, thu hồi đủ 100% tiền.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-superGuard" ${config.superGuard ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Chặn Hoàn Toàn Khách Hãm (No Brats)</div>
                  <div class="ttn-toggle-desc">Tắt sạch khách hối thúc, khách đổi ý, khách trả giá, khách khó tính và khách bùng.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-noBrats" ${config.noBrats ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Kho Hàng Vĩnh Viễn Không Thiu Hỏng</div>
                  <div class="ttn-toggle-desc">Nguyên liệu trong kho không bao giờ hết hạn, ly pha không bao giờ bị hỏng.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-noSpoil" ${config.noSpoil ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- TAB 2: TIỀN TỆ & CHI PHÍ -->
          <div class="ttn-mod-pane" id="pane-money">
            <div class="ttn-sec-box">
              <div class="ttn-sec-title">💰 Cộng Tiền & Giới Hạn Két</div>
              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Tắt Giới Hạn Két (Anti Money Reset)</div>
                  <div class="ttn-toggle-desc">Ngăn game tự động trừ hoặc trộm cạy két khi két vượt ngưỡng kiểm tra.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-unlimitedMoney" ${config.unlimitedMoney ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <div class="ttn-btn-grid grid-3">
                <button class="ttn-act-btn success" id="btn-add-10m">+10 Triệu</button>
                <button class="ttn-act-btn success" id="btn-add-100m">+100 Triệu</button>
                <button class="ttn-act-btn success" id="btn-add-1b">+1 Tỷ VNĐ</button>
              </div>

              <div class="ttn-input-row">
                <input type="number" class="ttn-input" id="inp-custom-money" placeholder="Nhập số tiền VNĐ..." value="50000000">
                <button class="ttn-act-btn pri" id="btn-set-money">Đặt Tiền</button>
              </div>
            </div>

            <div class="ttn-sec-box">
              <div class="ttn-sec-title">💳 Nợ & Miễn Phí Vận Hành</div>
              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Miễn Phí Mặt Bằng & Điện Nước (0đ)</div>
                  <div class="ttn-toggle-desc">Không bao giờ bị trừ tiền thuê nhà và tiền điện nước mỗi ngày.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-zeroBills" ${config.zeroBills ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Miễn 100% Thuế Kinh Doanh (0%)</div>
                  <div class="ttn-toggle-desc">Không phải nộp thuế GTGT & TNCN cuối ngày.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-zeroTax" ${config.zeroTax ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <button class="ttn-act-btn warn" id="btn-clear-debts">💳 Xoá Sạch Mọi Khoản Nợ (Ngân Hàng & Nợ Nóng)</button>
            </div>
          </div>

          <!-- TAB 3: MỞ KHÓA -->
          <div class="ttn-mod-pane" id="pane-unlock">
            <div class="ttn-sec-box">
              <div class="ttn-sec-title">⭐ Mở Khóa Siêu Tốc</div>
              <button class="ttn-act-btn success full-w" id="btn-unlock-all">🌟 SIÊU MỞ KHÓA TẤT CẢ (MENU, MÁY, STAFF, BRAND)</button>
              
              <div class="ttn-btn-grid">
                <button class="ttn-act-btn pri" id="btn-unlock-bases">🧋 Mở Toàn Bộ Cốt Trà</button>
                <button class="ttn-act-btn pri" id="btn-unlock-flavs">🍓 Mở Toàn Bộ Hương Vị</button>
                <button class="ttn-act-btn pri" id="btn-unlock-tops">🧀 Mở Toàn Bộ Topping</button>
                <button class="ttn-act-btn pri" id="btn-unlock-upg">⚙️ Mở Tất Cả Máy Móc</button>
                <button class="ttn-act-btn pri" id="btn-unlock-staff">👥 Thuê Full Nhân Viên</button>
                <button class="ttn-act-btn pri" id="btn-unlock-brand">🏷️ Mở Tem Brand & Online</button>
              </div>
            </div>
          </div>

          <!-- TAB 4: KHO HÀNG -->
          <div class="ttn-mod-pane" id="pane-stock">
            <div class="ttn-sec-box">
              <div class="ttn-sec-title">📦 Nạp Kho Nguyên Liệu</div>
              <button class="ttn-act-btn success full-w" id="btn-fill-stock">📦 NẠP 999 MẺ TẤT CẢ NGUYÊN LIỆU (HẠN VĨNH VIỄN)</button>
              <button class="ttn-act-btn danger full-w" id="btn-clear-stock">🧹 Dọn Sạch Toàn Bộ Kho Hàng</button>
            </div>
          </div>

          <!-- TAB 5: GAMEPLAY -->
          <div class="ttn-mod-pane" id="pane-gameplay">
            <div class="ttn-sec-box">
              <div class="ttn-sec-title">⚡ Tốc Độ & Sự Hài Lòng Khách Hàng</div>
              
              <div class="ttn-toggle-row">
                <div class="ttn-toggle-label">
                  <div class="ttn-toggle-title">Khách Vô Hạn Kiên Nhẫn (100% Full)</div>
                  <div class="ttn-toggle-desc">Khách tại quán và tài xế online chờ mãi mãi, không bao giờ giận hay huỷ đơn.</div>
                </div>
                <label class="ttn-switch">
                  <input type="checkbox" id="mod-infinitePatience" ${config.infinitePatience ? 'checked' : ''}>
                  <span class="ttn-slider"></span>
                </label>
              </div>

              <div class="ttn-btn-grid">
                <button class="ttn-act-btn pri" id="btn-auto-serve">🤖 Tự Động Pha & Giao Toàn Bộ Đơn</button>
                <button class="ttn-act-btn pri" id="btn-set-5stars">⭐ Đặt Danh Tiếng 5.0 Sao</button>
                <button class="ttn-act-btn warn" id="btn-clear-badrev">🧹 Xoá Hết Đánh Giá Xấu (1-2 Sao)</button>
                <button class="ttn-act-btn warn" id="btn-skip-day">⏩ Nhảy Sang Ngày Tiếp Theo</button>
              </div>
            </div>

            <div class="ttn-sec-box">
              <div class="ttn-sec-title">🌤️ Chọn Sự Kiện / Thời Tiết Hôm Nay</div>
              <div class="ttn-btn-grid grid-3">
                <button class="ttn-act-btn" data-ev="hot">☀️ Nắng Nóng</button>
                <button class="ttn-act-btn" data-ev="rain">🌧️ Trời Mưa</button>
                <button class="ttn-act-btn" data-ev="students">🎒 Học Sinh</button>
                <button class="ttn-act-btn" data-ev="reviewer">📸 Reviewer</button>
                <button class="ttn-act-btn" data-ev="trend">🔥 Món Hot</button>
                <button class="ttn-act-btn" data-ev="holiday">🎊 Ngày Lễ</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="ttn-mod-footer">
          <span>Tiệm Trà Nhỏ Mod v3.11</span>
          <span class="ttn-status-tag">● Trạng thái: Bộ Nhớ Sẵn Sàng</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Kéo thả FAB
    setupDraggable(fab);

    // Toggle Modal
    fab.addEventListener('click', () => {
      if (fab.dataset.wasDragged === 'true') return;
      modal.classList.add('show');
    });

    document.getElementById('ttn-close-btn').addEventListener('click', () => {
      modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });

    // Tab chuyển đổi
    const tabBtns = modal.querySelectorAll('.ttn-tab-btn');
    const panes = modal.querySelectorAll('.ttn-mod-pane');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        panes.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        const targetPane = document.getElementById(`pane-${target}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Setup Toggles
    setupToggle('mod-antiTheft', 'antiTheft', 'Khiên Chống Trộm & Phạt Thuế, QLTT');
    setupToggle('mod-superGuard', 'superGuard', 'Bảo Vệ VIP Tự Động Bắt 100% Khách Bùng Tiền');
    setupToggle('mod-noBrats', 'noBrats', 'Chặn Hoàn Toàn Khách Hối, Đổi Ý, Bùng Tiền');
    setupToggle('mod-noSpoil', 'noSpoil', 'Nguyên Liệu Tươi Mới Vĩnh Viễn Không Thiu Hỏng');
    setupToggle('mod-unlimitedMoney', 'unlimitedMoney', 'Tắt Giới Hạn Két (Anti Money Reset)');
    setupToggle('mod-zeroBills', 'zeroBills', 'Miễn Phí Mặt Bằng & Điện Nước (0đ/ngày)');
    setupToggle('mod-zeroTax', 'zeroTax', 'Miễn 100% Thuế GTGT & TNCN');
    setupToggle('mod-infinitePatience', 'infinitePatience', 'Khách Hàng & Tài Xế Vô Hạn Kiên Nhẫn');

    // Setup Action Buttons
    setupActions();
  }

  function setupDraggable(el) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let moved = false;

    function onPointerDown(e) {
      isDragging = true;
      moved = false;
      el.dataset.wasDragged = 'false';
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      const rect = el.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        moved = true;
        el.dataset.wasDragged = 'true';
      }

      const newLeft = Math.max(10, Math.min(window.innerWidth - 60, initialLeft + dx));
      const newTop = Math.max(10, Math.min(window.innerHeight - 60, initialTop + dy));

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
      el.style.right = 'auto';
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (moved) {
        localStorage.setItem(
          POS_STORAGE_KEY,
          JSON.stringify({ left: el.style.left, top: el.style.top })
        );
      }
    }

    el.addEventListener('pointerdown', onPointerDown);
  }

  function setupToggle(elementId, configKey, label) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('change', () => {
      config[configKey] = el.checked;
      saveConfig();
      modToast(el.checked ? `🟢 ĐÃ BẬT: ${label}!` : `⚪ ĐÃ TẮT: ${label}!`, el.checked ? 'success' : 'warn');
    });
  }

  function setupActions() {
    const h = getHook();

    // 1. Nạp Tiền Trực Tiếp
    const addCash = (amount) => {
      const S = getS();
      if (!S) {
        modToast('Lỗi: Chưa kết nối được Memory Game!', 'warn');
        return;
      }
      S.money = (Number(S.money) || 0) + Number(amount);
      S.totalRev = (Number(S.totalRev) || 0) + Number(amount);
      S.totalProfit = (Number(S.totalProfit) || 0) + Number(amount);
      commitState(`💰 Đã cộng +${amount.toLocaleString('vi-VN')}đ vào két! (Két: ${S.money.toLocaleString('vi-VN')}đ)`);
    };

    document.getElementById('btn-add-10m').onclick = () => addCash(10000000);
    document.getElementById('btn-add-100m').onclick = () => addCash(100000000);
    document.getElementById('btn-add-1b').onclick = () => addCash(1000000000);

    document.getElementById('btn-set-money').onclick = () => {
      const val = parseInt(document.getElementById('inp-custom-money').value, 10);
      if (isNaN(val) || val < 0) return modToast('Số tiền không hợp lệ!', 'warn');
      const S = getS();
      if (!S) return modToast('Lỗi kết nối Game State!', 'warn');
      S.money = val;
      commitState(`💰 Đã đặt két thành: ${val.toLocaleString('vi-VN')}đ`);
    };

    document.getElementById('btn-clear-debts').onclick = () => {
      const S = getS();
      if (!S) return;
      S.loan = null;
      S.hot = null;
      commitState('💳 Đã xoá sạch toàn bộ nợ ngân hàng & nợ nóng!');
    };

    // 2. Mở Khóa
    document.getElementById('btn-unlock-bases').onclick = () => {
      const S = getS();
      if (!S || !h.BASE_KEYS) return;
      h.BASE_KEYS.forEach((k) => (S.unlocked[k] = true));
      commitState('🧋 Đã mở khóa toàn bộ cốt trà!');
    };

    document.getElementById('btn-unlock-flavs').onclick = () => {
      const S = getS();
      if (!S || !h.FLAV_KEYS) return;
      h.FLAV_KEYS.forEach((k) => {
        S.unlocked[k] = true;
        if (!S.stock[k] || S.stock[k].length === 0) {
          S.stock[k] = [{ q: 99, exp: 99999 }];
        }
      });
      if (h.syncFlav) h.syncFlav();
      commitState('🍓 Đã mở khóa toàn bộ hương vị trái cây!');
    };

    document.getElementById('btn-unlock-tops').onclick = () => {
      const S = getS();
      if (!S || !h.TOP_KEYS) return;
      h.TOP_KEYS.forEach((k) => (S.unlocked[k] = true));
      commitState('🧀 Đã mở khóa toàn bộ topping!');
    };

    document.getElementById('btn-unlock-upg').onclick = () => {
      const S = getS();
      if (!S || !h.UPG) return;
      h.UPG.forEach((u) => (S.upg[u.id] = true));
      commitState('⚙️ Đã mở khóa toàn bộ máy móc & nâng cấp!');
    };

    document.getElementById('btn-unlock-staff').onclick = () => {
      const S = getS();
      if (!S || !h.STAFF) return;
      h.STAFF.forEach((s) => {
        S.upg[s.id] = true;
        if (S.hired) S.hired[s.id] = true;
      });
      S.upg.staff1 = false;
      S.upg.staff3 = true;
      commitState('👥 Đã tuyển dụng đầy đủ toàn bộ nhân viên!');
    };

    document.getElementById('btn-unlock-brand').onclick = () => {
      const S = getS();
      if (!S) return;
      S.online = true;
      S.tablets = 1;
      S.upg.brandKit = true;
      S.brand = {
        i: 'b00',
        c: '#ffffff',
        t: '#5a4030',
        fr: 'round',
        s: 'Ngon từ giọt đầu'
      };
      commitState('🏷️ Đã kích hoạt Tem Thương Hiệu & Bán Online!');
    };

    document.getElementById('btn-unlock-all').onclick = () => {
      const S = getS();
      if (!S) return;
      if (h.BASE_KEYS) h.BASE_KEYS.forEach((k) => (S.unlocked[k] = true));
      if (h.FLAV_KEYS) {
        h.FLAV_KEYS.forEach((k) => {
          S.unlocked[k] = true;
          if (!S.stock[k] || S.stock[k].length === 0) {
            S.stock[k] = [{ q: 99, exp: 99999 }];
          }
        });
        if (h.syncFlav) h.syncFlav();
      }
      if (h.TOP_KEYS) h.TOP_KEYS.forEach((k) => (S.unlocked[k] = true));
      if (h.UPG) h.UPG.forEach((u) => (S.upg[u.id] = true));
      if (h.STAFF) {
        h.STAFF.forEach((s) => {
          S.upg[s.id] = true;
          if (S.hired) S.hired[s.id] = true;
        });
        S.upg.staff1 = false;
        S.upg.staff3 = true;
      }
      S.online = true;
      S.tablets = 1;
      S.upg.brandKit = true;
      S.brand = {
        i: 'b00',
        c: '#ffffff',
        t: '#5a4030',
        fr: 'round',
        s: 'Ngon từ giọt đầu'
      };
      commitState('🌟 ĐÃ MỞ KHÓA TOÀN BỘ 100% GAME!');
    };

    // 3. Kho Hàng
    document.getElementById('btn-fill-stock').onclick = () => {
      const S = getS();
      if (!S || !h.ITEMS) return;
      Object.keys(h.ITEMS).forEach((k) => {
        S.stock[k] = [{ q: 999, exp: 99999 }];
      });
      if (h.syncFlav) h.syncFlav();
      commitState('📦 Đã nạp đầy kho: 999 mẻ tất cả nguyên liệu (Hạn vĩnh viễn)!');
    };

    document.getElementById('btn-clear-stock').onclick = () => {
      const S = getS();
      if (!S || !h.ITEMS) return;
      Object.keys(h.ITEMS).forEach((k) => {
        S.stock[k] = [];
      });
      if (h.syncFlav) h.syncFlav();
      commitState('🧹 Đã dọn dẹp sạch toàn bộ kho hàng!');
    };

    // 4. Gameplay
    document.getElementById('btn-set-5stars').onclick = () => {
      const S = getS();
      if (!S) return;
      S.reviews = S.reviews || [];
      S.reviews = S.reviews.filter((r) => r.s >= 4);
      for (let i = 0; i < 30; i++) {
        S.reviews.unshift({
          s: 5,
          t: 'Trà sữa ngon xuất sắc, phục vụ chu đáo 5 sao!',
          k: 'mod5_' + Math.random(),
          d: S.day,
          o: false,
          n: 'Khách VIP',
          f: '😍',
          b: 'tra',
          sz: 'L'
        });
      }
      commitState('⭐ Đã thiết lập uy tín quán đạt 5.0 SAO hoàn hảo!');
    };

    document.getElementById('btn-clear-badrev').onclick = () => {
      const S = getS();
      if (!S) return;
      const prevLen = S.reviews.length;
      S.reviews = (S.reviews || []).filter((r) => r.s >= 4);
      commitState(`🧹 Đã xoá ${prevLen - S.reviews.length} đánh giá tiêu cực!`);
    };

    document.getElementById('btn-auto-serve').onclick = () => {
      const S = getS();
      const R = getR();
      if (!S || !R) return modToast('Lỗi: Chưa vào màn hình bán hàng!', 'warn');

      let servedCount = 0;
      if (R.slots && R.slots.length) {
        R.slots.forEach((c, idx) => {
          if (!c) return;
          c.cups.forEach((cupReq, cupIdx) => {
            if (c.done[cupIdx]) return;
            c.done[cupIdx] = true;
            let p = 35000;
            try { p = h.price ? h.price(cupReq) : 35000; } catch (e) {}
            S.money = (Number(S.money) || 0) + p;
            if (R.today) {
              R.today.rev = (R.today.rev || 0) + p;
              R.today.served = (R.today.served || 0) + 1;
            }
            S.served = (S.served || 0) + 1;
            servedCount++;
          });
          c.pat = c.max;
          if (h.addReview) h.addReview(5, 'good', false, c);
          R.slots[idx] = null;
        });
      }

      if (R.online && R.online.length) {
        R.online.forEach((c) => {
          c.cups.forEach((cupReq) => {
            let p = 35000;
            try { p = h.price ? h.price(cupReq) : 35000; } catch (e) {}
            S.money = (Number(S.money) || 0) + p;
            if (R.today) {
              R.today.rev = (R.today.rev || 0) + p;
              R.today.served = (R.today.served || 0) + 1;
            }
            S.served = (S.served || 0) + 1;
            servedCount++;
          });
          if (h.addReview) h.addReview(5, 'good', true, c);
        });
        R.online = [];
      }

      commitState(`🤖 Đã tự động pha & giao ${servedCount} ly nước (5 sao)!`);
    };

    document.getElementById('btn-skip-day').onclick = () => {
      const S = getS();
      if (!S) return;
      S.day++;
      if (h.rollDay) h.rollDay(S.day);
      commitState(`⏩ Đã nhảy sang Ngày ${S.day}!`);
    };

    // Sự kiện thời tiết
    document.querySelectorAll('[data-ev]').forEach((btn) => {
      btn.onclick = () => {
        const evId = btn.dataset.ev;
        const S = getS();
        if (!S) return;
        S.ev = { id: evId };
        if (evId === 'trend') S.ev.k = 'tra';
        if (evId === 'sale') S.ev.k = 'matcha';
        commitState(`🌤️ Đã đổi sự kiện hôm nay: ${btn.innerText.trim()}`);
      };
    });
  }

  // Khởi động
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initModUI();
      applyDynamicMods();
    });
  } else {
    initModUI();
    applyDynamicMods();
  }
})();
