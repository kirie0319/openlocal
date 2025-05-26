// OpenLocal JavaScript Application with i18n support

class OpenLocalApp {
    constructor() {
        this.currentUser = null;
        this.currentPostId = null;
        this.isLocalMode = false;
        this.searchQuery = '';
        this.posts = [];
        this.replies = [];
        
        // 地域データベース（階層構造）
        this.locationDatabase = {
            '北海道': [
                '札幌市中央区', '札幌市北区', '札幌市東区', '札幌市白石区', '札幌市豊平区',
                '札幌市南区', '札幌市西区', '札幌市厚別区', '札幌市手稲区', '札幌市清田区',
                '函館市', '旭川市', '釧路市', '帯広市', '北見市', '苫小牧市', '小樽市', '北海道その他'
            ],
            '青森県': ['青森市', '弘前市', '八戸市', '青森県その他'],
            '岩手県': ['盛岡市', '一関市', '奥州市', '岩手県その他'],
            '宮城県': [
                '仙台市青葉区', '仙台市宮城野区', '仙台市若林区', '仙台市太白区', '仙台市泉区',
                '石巻市', '塩竈市', '宮城県その他'
            ],
            '秋田県': ['秋田市', '横手市', '大館市', '秋田県その他'],
            '山形県': ['山形市', '鶴岡市', '酒田市', '山形県その他'],
            '福島県': ['福島市', '郡山市', 'いわき市', '会津若松市', '福島県その他'],
            
            '茨城県': ['水戸市', 'つくば市', '日立市', '土浦市', '茨城県その他'],
            '栃木県': ['宇都宮市', '小山市', '栃木市', '栃木県その他'],
            '群馬県': ['前橋市', '高崎市', '太田市', '群馬県その他'],
            '埼玉県': [
                'さいたま市大宮区', 'さいたま市浦和区', 'さいたま市中央区', 'さいたま市北区',
                'さいたま市見沼区', 'さいたま市緑区', 'さいたま市南区', 'さいたま市西区',
                'さいたま市桜区', 'さいたま市岩槻区',
                '川越市', '所沢市', '越谷市', '草加市', '春日部市', '埼玉県その他'
            ],
            '千葉県': [
                '千葉市中央区', '千葉市花見川区', '千葉市稲毛区', '千葉市若葉区', '千葉市緑区', '千葉市美浜区',
                '船橋市', '柏市', '市川市', '松戸市', '市原市', '浦安市', '千葉県その他'
            ],
            '東京都': [
                '千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区',
                '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区',
                '北区', '荒川区', '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区',
                '八王子市', '立川市', '武蔵野市', '三鷹市', '府中市', '調布市', '町田市', '小金井市', '東京都その他'
            ],
            '神奈川県': [
                '横浜市鶴見区', '横浜市神奈川区', '横浜市西区', '横浜市中区', '横浜市南区',
                '横浜市保土ケ谷区', '横浜市磯子区', '横浜市金沢区', '横浜市港北区', '横浜市戸塚区',
                '横浜市港南区', '横浜市旭区', '横浜市緑区', '横浜市瀬谷区', '横浜市栄区',
                '横浜市泉区', '横浜市青葉区', '横浜市都筑区',
                '川崎市川崎区', '川崎市幸区', '川崎市中原区', '川崎市高津区', '川崎市多摩区',
                '川崎市宮前区', '川崎市麻生区',
                '相模原市緑区', '相模原市中央区', '相模原市南区', '藤沢市', '茅ヶ崎市', '平塚市', '神奈川県その他'
            ],
            
            '新潟県': [
                '新潟市中央区', '新潟市東区', '新潟市西区', '新潟市南区', '新潟市北区',
                '新潟市江南区', '新潟市秋葉区', '新潟市西蒲区',
                '長岡市', '上越市', '新潟県その他'
            ],
            '富山県': ['富山市', '高岡市', '射水市', '富山県その他'],
            '石川県': ['金沢市', '小松市', '白山市', '石川県その他'],
            '福井県': ['福井市', '敦賀市', '小浜市', '福井県その他'],
            '山梨県': ['甲府市', '甲斐市', '南アルプス市', '山梨県その他'],
            '長野県': ['長野市', '松本市', '上田市', '飯田市', '長野県その他'],
            '岐阜県': ['岐阜市', '大垣市', '高山市', '岐阜県その他'],
            '静岡県': [
                '静岡市葵区', '静岡市駿河区', '静岡市清水区',
                '浜松市中区', '浜松市東区', '浜松市西区', '浜松市南区', '浜松市北区',
                '浜松市浜北区', '浜松市天竜区',
                '沼津市', '富士市', '静岡県その他'
            ],
            '愛知県': [
                '名古屋市千種区', '名古屋市東区', '名古屋市北区', '名古屋市西区', '名古屋市中村区',
                '名古屋市中区', '名古屋市昭和区', '名古屋市瑞穂区', '名古屋市熱田区', '名古屋市中川区',
                '名古屋市港区', '名古屋市南区', '名古屋市守山区', '名古屋市緑区', '名古屋市名東区', '名古屋市天白区',
                '豊田市', '岡崎市', '一宮市', '豊橋市', '春日井市', '愛知県その他'
            ],
            '三重県': ['津市', '四日市市', '伊勢市', '三重県その他'],
            
            '滋賀県': ['大津市', '草津市', '彦根市', '滋賀県その他'],
            '京都府': [
                '京都市北区', '京都市上京区', '京都市左京区', '京都市中京区', '京都市東山区',
                '京都市下京区', '京都市南区', '京都市右京区', '京都市伏見区', '京都市山科区', '京都市西京区',
                '宇治市', '亀岡市', '京都府その他'
            ],
            '大阪府': [
                '大阪市都島区', '大阪市福島区', '大阪市此花区', '大阪市西区', '大阪市港区',
                '大阪市大正区', '大阪市天王寺区', '大阪市浪速区', '大阪市西淀川区', '大阪市東淀川区',
                '大阪市東成区', '大阪市生野区', '大阪市旭区', '大阪市城東区', '大阪市阿倍野区',
                '大阪市住吉区', '大阪市東住吉区', '大阪市西成区', '大阪市淀川区', '大阪市鶴見区',
                '大阪市住之江区', '大阪市平野区', '大阪市北区', '大阪市中央区',
                '堺市堺区', '堺市中区', '堺市東区', '堺市西区', '堺市南区', '堺市北区', '堺市美原区',
                '豊中市', '吹田市', '高槻市', '枚方市', '茨木市', '大阪府その他'
            ],
            '兵庫県': [
                '神戸市東灘区', '神戸市灘区', '神戸市兵庫区', '神戸市長田区', '神戸市須磨区',
                '神戸市垂水区', '神戸市北区', '神戸市中央区', '神戸市西区',
                '姫路市', '尼崎市', '明石市', '西宮市', '兵庫県その他'
            ],
            '奈良県': ['奈良市', '橿原市', '生駒市', '奈良県その他'],
            '和歌山県': ['和歌山市', '田辺市', '橋本市', '和歌山県その他'],
            
            '鳥取県': ['鳥取市', '米子市', '倉吉市', '鳥取県その他'],
            '島根県': ['松江市', '出雲市', '浜田市', '島根県その他'],
            '岡山県': [
                '岡山市北区', '岡山市中区', '岡山市東区', '岡山市南区',
                '倉敷市', '津山市', '玉野市', '岡山県その他'
            ],
            '広島県': [
                '広島市中区', '広島市東区', '広島市南区', '広島市西区', '広島市安佐南区',
                '広島市安佐北区', '広島市安芸区', '広島市佐伯区',
                '呉市', '尾道市', '福山市', '広島県その他'
            ],
            '山口県': ['山口市', '下関市', '宇部市', '周南市', '山口県その他'],
            '徳島県': ['徳島市', '鳴門市', '阿南市', '徳島県その他'],
            '香川県': ['高松市', '丸亀市', '坂出市', '香川県その他'],
            '愛媛県': ['松山市', '今治市', '新居浜市', '愛媛県その他'],
            '高知県': ['高知市', '南国市', '四万十市', '高知県その他'],
            
            '福岡県': [
                '福岡市東区', '福岡市博多区', '福岡市中央区', '福岡市南区', '福岡市西区', '福岡市城南区', '福岡市早良区',
                '北九州市門司区', '北九州市若松区', '北九州市戸畑区', '北九州市小倉北区', '北九州市小倉南区',
                '北九州市八幡東区', '北九州市八幡西区',
                '久留米市', '大牟田市', '飯塚市', '福岡県その他'
            ],
            '佐賀県': ['佐賀市', '唐津市', '鳥栖市', '佐賀県その他'],
            '長崎県': ['長崎市', '佐世保市', '諫早市', '長崎県その他'],
            '熊本県': [
                '熊本市中央区', '熊本市東区', '熊本市西区', '熊本市南区', '熊本市北区',
                '八代市', '人吉市', '熊本県その他'
            ],
            '大分県': ['大分市', '別府市', '中津市', '大分県その他'],
            '宮崎県': ['宮崎市', '都城市', '延岡市', '宮崎県その他'],
            '鹿児島県': ['鹿児島市', '鹿屋市', '薩摩川内市', '鹿児島県その他'],
            '沖縄県': ['那覇市', '沖縄市', '浦添市', '宜野湾市', '糸満市', '沖縄県その他']
        };
        
        // フラットな地域リスト（検索用）
        this.flatLocationList = [];
        Object.keys(this.locationDatabase).forEach(prefecture => {
            // 都道府県名も検索対象に追加
            this.flatLocationList.push(prefecture);
            // 各地域も追加
            this.locationDatabase[prefecture].forEach(location => {
                this.flatLocationList.push(location);
            });
        });
        
        // Wait for i18n to be ready before initializing
        this.waitForI18n().then(() => {
            this.init();
        });
    }

    async waitForI18n() {
        // Wait for i18n to be available
        while (!window.i18n) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // Wait for initial language to be loaded
        while (!window.i18n.translations[window.i18n.currentLanguage]) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    init() {
        this.bindEvents();
        this.updateLanguageDisplay();
        this.checkStoredUser();
    }

    updateLanguageDisplay() {
        // 現在の言語名を表示
        document.getElementById('currentLanguage').textContent = window.i18n.getLanguageName(window.i18n.currentLanguage);
    }

    bindEvents() {
        // Authentication events
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Post events
        document.getElementById('newPostBtn').addEventListener('click', () => this.showNewPostModal());
        document.getElementById('submitPostBtn').addEventListener('click', () => this.handleCreatePost());
        document.getElementById('localModeToggle').addEventListener('change', (e) => this.toggleLocalMode(e));
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Reply events
        document.getElementById('replyForm').addEventListener('submit', (e) => this.handleCreateReply(e));

        // Language events
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeUILanguage(e.target.dataset.lang));
        });

        // Preferred Language change event
        document.getElementById('preferredLanguage').addEventListener('change', (e) => {
            this.updateFormLanguage(e.target.value);
        });

        // Location search events
        this.setupLocationSearch('location', 'locationDropdown', 'selectedLocation');
        this.setupLocationSearch('postLocation', 'postLocationDropdown', 'selectedPostLocation');

        // Modal events
        document.getElementById('newPostModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('newPostForm').reset();
            this.clearLocationSearch('postLocation', 'postLocationDropdown');
        });

        document.getElementById('postDetailModal').addEventListener('hidden.bs.modal', () => {
            this.currentPostId = null;
            document.getElementById('replyForm').reset();
        });
    }

    setupLocationSearch(inputId, dropdownId, hiddenInputId) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        const hiddenInput = document.getElementById(hiddenInputId);

        input.addEventListener('input', (e) => {
            this.handleLocationSearch(e.target.value, dropdown, hiddenInput);
        });

        input.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.handleLocationSearch(e.target.value, dropdown, hiddenInput);
            }
        });

        input.addEventListener('blur', (e) => {
            // ドロップダウンのクリックを処理するために少し遅延
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        });
    }

    handleLocationSearch(query, dropdown, hiddenInput) {
        if (!query.trim()) {
            dropdown.style.display = 'none';
            hiddenInput.value = '';
            return;
        }

        let filteredLocations = [];
        const queryLower = query.toLowerCase();

        // 都道府県名での完全一致または部分一致をチェック
        Object.keys(this.locationDatabase).forEach(prefecture => {
            if (prefecture.toLowerCase().includes(queryLower)) {
                // 都道府県名がマッチした場合、その都道府県の全地域を追加
                filteredLocations.push(prefecture);
                filteredLocations.push(...this.locationDatabase[prefecture]);
            } else {
                // 都道府県内の地域での部分一致をチェック
                this.locationDatabase[prefecture].forEach(location => {
                    if (location.toLowerCase().includes(queryLower)) {
                        filteredLocations.push(location);
                    }
                });
            }
        });

        // 重複を除去
        filteredLocations = [...new Set(filteredLocations)];

        this.displayLocationResults(filteredLocations, dropdown, hiddenInput, query);
    }

    displayLocationResults(locations, dropdown, hiddenInput, query) {
        dropdown.innerHTML = '';

        if (locations.length === 0) {
            dropdown.innerHTML = `<div class="no-results">${window.i18n.t('messages.noResults') || '検索結果がありません'}</div>`;
            dropdown.style.display = 'block';
            return;
        }

        locations.slice(0, 10).forEach(location => {
            const item = document.createElement('div');
            item.className = 'location-dropdown-item';
            item.textContent = location;
            
            item.addEventListener('click', () => {
                const input = dropdown.previousElementSibling;
                input.value = location;
                hiddenInput.value = location;
                dropdown.style.display = 'none';
            });

            dropdown.appendChild(item);
        });

        dropdown.style.display = 'block';
    }

    clearLocationSearch(inputId, dropdownId) {
        document.getElementById(inputId).value = '';
        document.getElementById(dropdownId).style.display = 'none';
        const hiddenInputId = inputId === 'location' ? 'selectedLocation' : 'selectedPostLocation';
        document.getElementById(hiddenInputId).value = '';
    }

    checkStoredUser() {
        const storedUser = localStorage.getItem('openlocal_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            // ユーザーの言語設定でUIを初期化
            window.i18n.changeLanguage(this.currentUser.preferred_language).then(() => {
                this.showMainContent();
                this.loadPosts();
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        
        if (!username) {
            this.showToast(window.i18n.formatMessage('usernameRequired'), 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('username', username);
            
            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('openlocal_user', JSON.stringify(this.currentUser));
                
                // ユーザーの言語設定でUIを更新
                await window.i18n.changeLanguage(this.currentUser.preferred_language);
                
                this.showMainContent();
                this.loadPosts();
                this.showToast(window.i18n.formatMessage('loginSuccess'), 'success');
            } else {
                this.showToast(result.error || window.i18n.formatMessage('loginError'), 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast(window.i18n.formatMessage('loginError'), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value.trim();
        const preferredLanguage = document.getElementById('preferredLanguage').value;
        const location = document.getElementById('selectedLocation').value; // hidden inputから取得
        
        if (!username) {
            this.showToast(window.i18n.formatMessage('usernameRequired'), 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('preferred_language', preferredLanguage);
            if (location) formData.append('location', location);
            
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('openlocal_user', JSON.stringify(this.currentUser));
                
                // ユーザーの言語設定でUIを更新
                await window.i18n.changeLanguage(this.currentUser.preferred_language);
                
                this.showMainContent();
                this.loadPosts();
                this.showToast(window.i18n.formatMessage('registerSuccess'), 'success');
            } else {
                this.showToast(result.error || window.i18n.formatMessage('registerError'), 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showToast(window.i18n.formatMessage('registerError'), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('openlocal_user');
        this.showAuthSection();
        this.showToast(window.i18n.formatMessage('logoutSuccess'), 'info');
    }

    showMainContent() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
        
        // Update language display
        this.updateLanguageDisplay();
    }

    showAuthSection() {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        
        // Update language display
        this.updateLanguageDisplay();
    }

    showNewPostModal() {
        const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
        modal.show();
    }

    async handleCreatePost() {
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const location = document.getElementById('selectedPostLocation').value; // hidden inputから取得
        const isLocalOnly = document.getElementById('isLocalOnly').checked;
        
        if (!title || !content) {
            this.showToast(window.i18n.formatMessage('titleContentRequired'), 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('user_uuid', this.currentUser.uuid);
            formData.append('title', title);
            formData.append('content', content);
            if (location) formData.append('location', location);
            formData.append('is_local_only', isLocalOnly);
            
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
                modal.hide();
                this.loadPosts();
                this.showToast(window.i18n.formatMessage('postCreated'), 'success');
            } else {
                this.showToast(window.i18n.formatMessage('postError'), 'error');
            }
        } catch (error) {
            console.error('Create post error:', error);
            this.showToast(window.i18n.formatMessage('postError'), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadPosts() {
        this.showLoading(true);
        
        try {
            const params = new URLSearchParams({
                user_uuid: this.currentUser.uuid,
                local_only: this.isLocalMode,
                user_location: this.currentUser.location || ''
            });
            
            const response = await fetch(`/api/posts?${params}`);
            this.posts = await response.json();
            this.renderPosts();
        } catch (error) {
            console.error('Load posts error:', error);
            this.showToast(window.i18n.formatMessage('loadError'), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderPosts() {
        const container = document.getElementById('postsContainer');
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">${window.i18n.t('main.noPosts')}</h5>
                    <p class="text-muted">${window.i18n.t('main.noPostsSubtext')}</p>
                </div>
            `;
            return;
        }

        let filteredPosts = this.posts;
        if (this.searchQuery) {
            filteredPosts = this.posts.filter(post => 
                post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        container.innerHTML = filteredPosts.map(post => this.renderPostCard(post)).join('');
        
        // Add click events to post cards
        container.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', () => {
                const postId = card.dataset.postId;
                this.showPostDetail(postId);
            });
        });
    }

    renderPostCard(post) {
        const createdAt = new Date(post.created_at).toLocaleString(window.i18n.currentLanguage);
        const title = post.translated_title || post.title;
        const content = post.translated_content || post.content;
        
        return `
            <div class="card post-card fade-in" data-post-id="${post.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="post-meta">
                            <i class="fas fa-user"></i>${post.author_username}
                            <i class="fas fa-clock ms-2"></i>${createdAt}
                            ${post.location ? `<i class="fas fa-map-marker-alt ms-2"></i>${post.location}` : ''}
                        </div>
                        <div>
                            ${post.is_local_only ? `<span class="badge badge-local">${window.i18n.getBadgeText('local')}</span>` : ''}
                            ${post.translated_title ? `<span class="badge badge-translated ms-1">${window.i18n.getBadgeText('translated')}</span>` : ''}
                        </div>
                    </div>
                    <h5 class="post-title">${this.escapeHtml(title)}</h5>
                    <p class="post-content text-truncate-3">${this.escapeHtml(content)}</p>
                    <div class="post-stats">
                        <span><i class="fas fa-comments"></i>${post.reply_count}</span>
                        <span><i class="fas fa-language"></i>${post.original_language.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    async showPostDetail(postId) {
        this.currentPostId = postId;
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) return;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('postDetailModal'));
        modal.show();

        // Set post content
        const title = post.translated_title || post.title;
        const content = post.translated_content || post.content;
        const createdAt = new Date(post.created_at).toLocaleString(window.i18n.currentLanguage);
        
        document.getElementById('postDetailTitle').textContent = title;
        document.getElementById('postDetailContent').innerHTML = `
            <div class="mb-3">
                <div class="post-meta mb-2">
                    <i class="fas fa-user"></i>${post.author_username}
                    <i class="fas fa-clock ms-2"></i>${createdAt}
                    ${post.location ? `<i class="fas fa-map-marker-alt ms-2"></i>${post.location}` : ''}
                    ${post.is_local_only ? `<span class="badge badge-local ms-2">${window.i18n.getBadgeText('local')}</span>` : ''}
                    ${post.translated_title ? `<span class="badge badge-translated ms-1">${window.i18n.getBadgeText('translated')}</span>` : ''}
                </div>
                <p class="post-content">${this.escapeHtml(content)}</p>
            </div>
        `;

        // Load replies
        await this.loadReplies(postId);
    }

    async loadReplies(postId) {
        try {
            const params = new URLSearchParams({
                user_uuid: this.currentUser.uuid
            });
            
            const response = await fetch(`/api/posts/${postId}/replies?${params}`);
            this.replies = await response.json();
            this.renderReplies();
        } catch (error) {
            console.error('Load replies error:', error);
            this.showToast(window.i18n.formatMessage('loadError'), 'error');
        }
    }

    renderReplies() {
        const container = document.getElementById('repliesContainer');
        
        if (this.replies.length === 0) {
            container.innerHTML = `<p class="text-muted">${window.i18n.t('main.noPosts')}</p>`;
            return;
        }

        container.innerHTML = this.replies.map(reply => this.renderReplyCard(reply)).join('');
    }

    renderReplyCard(reply) {
        const createdAt = new Date(reply.created_at).toLocaleString(window.i18n.currentLanguage);
        const content = reply.translated_content || reply.content;
        const replyClass = reply.is_gpt_response ? 'reply-card gpt-reply' : 'reply-card';
        
        return `
            <div class="${replyClass} slide-in">
                <div class="reply-meta">
                    <i class="fas fa-user"></i>${reply.author_username}
                    <i class="fas fa-clock ms-2"></i>${createdAt}
                    ${reply.is_gpt_response ? `<span class="badge badge-gpt ms-2">${window.i18n.getBadgeText('gpt')}</span>` : ''}
                    ${reply.translated_content ? `<span class="badge badge-translated ms-1">${window.i18n.getBadgeText('translated')}</span>` : ''}
                </div>
                <div class="reply-content">${this.escapeHtml(content)}</div>
            </div>
        `;
    }

    async handleCreateReply(e) {
        e.preventDefault();
        const content = document.getElementById('replyContent').value.trim();
        
        if (!content) {
            this.showToast(window.i18n.formatMessage('replyContentRequired'), 'error');
            return;
        }

        if (!this.currentPostId) {
            this.showToast(window.i18n.formatMessage('postError'), 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('user_uuid', this.currentUser.uuid);
            formData.append('content', content);
            
            const response = await fetch(`/api/posts/${this.currentPostId}/replies`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('replyContent').value = '';
                await this.loadReplies(this.currentPostId);
                await this.loadPosts(); // Refresh posts to update reply count
                this.showToast(window.i18n.formatMessage('replyCreated'), 'success');
            } else {
                this.showToast(window.i18n.formatMessage('replyError'), 'error');
            }
        } catch (error) {
            console.error('Create reply error:', error);
            this.showToast(window.i18n.formatMessage('replyError'), 'error');
        } finally {
            this.showLoading(false);
        }
    }

    toggleLocalMode(e) {
        this.isLocalMode = e.target.checked;
        this.loadPosts();
        
        const mode = this.isLocalMode ? 'local' : 'open';
        const modeText = window.i18n.getModeText(mode);
        this.showToast(window.i18n.formatMessage('modeChanged', { mode: modeText }), 'info');
    }

    handleSearch() {
        this.searchQuery = document.getElementById('searchInput').value.trim();
        this.renderPosts();
        
        if (this.searchQuery) {
            this.showToast(window.i18n.formatMessage('searchPerformed', { query: this.searchQuery }), 'info');
        }
    }

    async changeUILanguage(language) {
        await window.i18n.changeLanguage(language);
        
        // Update current language display
        this.updateLanguageDisplay();
        
        // Update user's content language preference if logged in
        if (this.currentUser) {
            this.currentUser.preferred_language = language;
            localStorage.setItem('openlocal_user', JSON.stringify(this.currentUser));
            
            // Reload posts and replies with new language preference
            await this.loadPosts();
            if (this.currentPostId) {
                await this.loadReplies(this.currentPostId);
            }
            
            // Re-render posts and replies with new language
            this.renderPosts();
            if (this.currentPostId) {
                this.renderReplies();
            }
        } else {
            // 認証画面でも地域検索のプレースホルダーを更新
            this.updateAuthFormLanguage(language);
        }
        
        this.showToast(window.i18n.formatMessage('languageChanged', { 
            language: window.i18n.getLanguageName(language) 
        }), 'info');
    }

    updateAuthFormLanguage(language) {
        // 認証画面の地域検索プレースホルダーを更新
        const locationInput = document.getElementById('location');
        if (locationInput) {
            const searchLocationText = window.i18n.t('auth.searchLocation');
            locationInput.setAttribute('placeholder', searchLocationText);
        }
    }

    async changeLanguage(language) {
        // This method is for changing user's content language preference
        if (this.currentUser && this.currentUser.preferred_language === language) return;
        
        if (this.currentUser) {
            this.currentUser.preferred_language = language;
            localStorage.setItem('openlocal_user', JSON.stringify(this.currentUser));
            
            // Reload posts with new language preference
            await this.loadPosts();
            if (this.currentPostId) {
                await this.loadReplies(this.currentPostId);
            }
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = show ? 'block' : 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastBody = document.getElementById('toastBody');
        
        // Set message and style
        toastBody.textContent = message;
        toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : 
                                   type === 'success' ? 'bg-success text-white' : 
                                   type === 'warning' ? 'bg-warning text-dark' : 
                                   'bg-info text-white'}`;
        
        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async updateFormLanguage(language) {
        // 一時的に言語を変更してプレースホルダーを更新
        const currentLang = window.i18n.currentLanguage;
        await window.i18n.changeLanguage(language);
        
        // プレースホルダーテキストを更新
        const locationInput = document.getElementById('location');
        const searchLocationText = window.i18n.t('auth.searchLocation');
        locationInput.setAttribute('placeholder', searchLocationText);
        locationInput.setAttribute('data-i18n-placeholder', 'auth.searchLocation');
        
        // 元の言語に戻す（UIは変更しない）
        await window.i18n.changeLanguage(currentLang);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OpenLocalApp();
}); 