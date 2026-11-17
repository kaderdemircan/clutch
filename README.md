# 🎮 DESTINY — Esports Team & Coach Matchmaking Platform

[![Expo](https://img.shields.io/badge/Expo-SDK_58-black.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.88.1-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com)
[![Expo Router](https://img.shields.io/badge/Router-Expo_Router_58-000000.svg?style=flat)](https://docs.expo.dev/router/introduction/)

> **"Analyze. Adapt. Dominate."**  
> Rekabetçi oyuncuların oyun, rank ve rollerine uygun takım arkadaşları bulmasını, takım kurmasını, profesyonel koçlarla antrenman yapmasını ve turnuvalara katılmasını sağlayan yeni nesil mobil espor platformu.

---

## 📌 İçindekiler
- [Proje Özeti ve Amacı](#-proje-özeti-ve-amacı)
- [Temel Özellikler](#-temel-özellikler)
- [Figma Tasarımı ve Ekranlar](#-figma-tasarımı-ve-ekranlar)
- [Tasarım Sistemi (Design Tokens)](#-tasarım-sistemi-design-tokens)
- [Teknoloji Mimarisi (Tech Stack)](#-teknoloji-mimarisi-tech-stack)
- [Backend & Veritabanı Mimarisi (Database Schema)](#-backend--veritabanı-mimarisi-database-schema)
- [Veri Çekme ve Durum Yönetimi (Data Fetching & State)](#-veri-çekme-ve-durum-yönetimi-data-fetching--state)
- [Proje Dizin Yapısı](#-proje-dizin-yapısı)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [Geliştirme Yol Haritası (Roadmap)](#-geliştirme-yol-haritası-roadmap)

---

## 🎯 Proje Özeti ve Amacı

Rekabetçi çevrimiçi oyunlarda (özellikle **Mobile Legends: Bang Bang (MLBB)**, Valorant, Wild Rift vb.) oyuncuların karşılaştığı en büyük sorunlardan biri rastgele eşleşmelerde (solo queue) yaşanan uyumsuzluklar, rollerin çakışması ve takım içi iletişim eksikliğidir. 

**DESTINY**, bu probleme odaklanarak:
1. **Rol ve Rank Uyumlu Takım Bulma:** Takımların eksik pozisyonlarına (EXP Lane, Roamer, Jungler vb.) nokta atışı başvuru yapabilmesini sağlar.
2. **Koçluk Sistemi:** Oyuncuların gelişimlerini hızlandırmak için tecrübeli koçları inceleyip davet edebileceği bir pazar yeri sunar.
3. **Turnuva Katılımı:** Takımların ödüllü bölgesel turnuvaları listeleyip tek tıkla kaydolmalarını sağlar.
4. **Oyuncu & İstatistik Kartı:** Oyuncunun ligi, ana rolü, favori kahramanları, win-rate oranı ve son maç performanslarını sergiler.

---

## 🌟 Temel Özellikler

- **Dashboard / Ana Sayfa:** Son oynanan maç kartları (KDA, MVP, sonuç), genel galibiyet istatistikleri ve hızlı aksiyonlar.
- **Find a Team (Takım Bul):** Oyun, Rank, Rol ve Yaş filtreleme çipleri; takım detayları, puanları ve başvuru gönderme.
- **Find a Coach (Koç Bul):** Koçların uzmanlık alanları, deneyim yılları, seans ücretleri ve rezervasyon daveti.
- **My Team (Takımım):** 5 oyunculu ana kadro + koç rolleri, takım içi roller ve takımdan ayrılma/yönetim.
- **Tournaments (Turnuvalar):** Ödül havuzu, katılım şartları, slot doluluğu ve kayıt olma akışı.
- **Interactive Notifications (Bildirimler):** Takım davetleri, koç yanıtları ve turnuva hatırlatmaları için kategori bazlı bildirim merkezi.
- **Player Information & Profile:** Kapsamlı maç geçmişi, lig rozetleri ve favori şampiyonlar.
- **Settings (Ayarlar):** Dil seçimi (TR/EN), Bildirim tercihleri, Koyu Mod (Dark Theme) anahtarı ve Çıkış yapma.
- **Authentication (Giriş/Kayıt):** Google & Discord sosyal girişleri ve E-posta/Şifre ile kimlik doğrulama.

---

## 📱 Figma Tasarımı ve Ekranlar

Figma'da tasarlanan ekranlar, mobil standartlara ve **Expo Go SDK 58** altyapısına tam uyumlu hale getirilmiştir:

```
                  ┌──────────────────────┐
                  │    Splash Screen     │
                  └──────────┬───────────┘
                             │
                  ┌──────────▼───────────┐
                  │   Login / Register   │
                  └──────────┬───────────┘
                             │
     ┌───────────────────────┴───────────────────────┐
     │                                               │
┌────▼─────────────────┐                   ┌─────────▼────────────┐
│      (tabs)          │                   │     Sub-Screens      │
├──────────────────────┤                   ├──────────────────────┤
│ 🏠 Home (Dashboard)  │                   │ 🎯 Find Coach        │
│ 👥 Teams (Team List) │ ◄───────────────► │ 🛡️ My Team           │
│ 🏆 Tournaments       │                   │ 🔔 Notifications     │
│ 👤 Profile & Stats   │                   │ ℹ️ Player Info       │
└──────────────────────┘                   │ ⚙️ Settings          │
                                           └──────────────────────┘
```

---

## 🎨 Tasarım Sistemi (Design Tokens)

Tasarım sistemi `src/constants/theme.ts` içerisinde merkezi olarak yönetilir:

| Token | Değer | Kullanım Amacı |
| :--- | :--- | :--- |
| **`background`** | `#FFEBF3` | Figma pastel pembe soft oyun zemini |
| **`card`** | `#FFFFFF` | Konturlu beyaz kart yüzeyi |
| **`cardBorder`**| `#962B2B` | Koyu kiremit/bordo retro kontur |
| **`primary`** | `#FF5C9D` | Destiny neon pembe vurgu rengi |
| **`primaryDark`**| `#962B2B` | Butonlar, başlıklar ve aktif ikonlar |
| **`primaryLight`**|`#FFE1ED` | Çip arka planları ve aktif sekme kapsayıcısı |
| **`secondary`** | `#0004E4` | Figma mavi bağlantı/link vurguları |
| **`success`** | `#10B981` | Galibiyet (VICTORY) ve aktiflik durumu |
| **`gold`** | `#FFB800` | MVP ve Değerlendirme yıldızları (★★★★★) |
| **`retroShadow`**| `offset: -3, 4`| Figma tasarımındaki retro yükseltme gölgesi |

---

## 🏗️ Teknoloji Mimarisi (Tech Stack)

### Frontend (Mevcut)
- **Framework:** [React Native 0.88.1](https://reactnative.dev)
- **Platform:** [Expo SDK 58](https://expo.dev) (En güncel sürüm)
- **Routing:** [Expo Router v58](https://docs.expo.dev/router/introduction/) (Dosya tabanlı Stack & Native Tabs)
- **Dil:** TypeScript (~6.0)
- **İkonlar:** `@expo/vector-icons` (Ionicons)
- **Stil Yönetimi:** React Native `StyleSheet` & Merkezi `DestinyTheme`
- **Geliştirme Araçları:** ESLint 9 (Strict Hooks), TypeScript Compiler (`tsc`)

---

## 💾 Backend & Veritabanı Mimarisi (Database Schema)

Bu projenin eşzamanlı bildirimler, ilişkisel takım yapıları, koçluk randevuları ve kullanıcı kimlik doğrulaması gereksinimleri için en ideal backend çözümü **Supabase (PostgreSQL + Realtime + Auth)**'tur.

### 🌟 Neden Supabase?
1. **İlişkisel Veri Bütünlüğü (PostgreSQL):** Takım, kadro, oyuncu, koç ve turnuva ilişkileri NoSQL'e kıyasla ilişkisel SQL tablolarında çok daha tutarlı ve hatasız yönetilir.
2. **Yerleşik Auth & Sosyal Giriş:** Figma tasarımında bulunan **Google** ve **Discord** ile giriş entegrasyonu tek tıkla yapılandırılabilir.
3. **Realtime WebSockets:** Takım davetleri, maç çağrıları ve koçluk onayları anında (`realtime subscription`) telefona bildirim olarak düşer.
4. **Row Level Security (RLS):** Kullanıcıların yalnızca kendi takımlarını ve profillerini düzenleyebilmesini sağlayan veri güvenliği kuralları.

---

### 📊 Veritabanı Tablo Yapısı (PostgreSQL Schema)

```sql
-- 1. KULLANICI PROFİLLERİ (auth.users tablosunu genişletir)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    primary_game VARCHAR(50) DEFAULT 'MLBB',
    rank VARCHAR(50) DEFAULT 'Mythic',
    main_role VARCHAR(30) DEFAULT 'EXP Lane',
    total_matches INT DEFAULT 0,
    win_rate NUMERIC(5,2) DEFAULT 0.0,
    mvp_count INT DEFAULT 0,
    favorite_heroes TEXT[] DEFAULT ARRAY['Benedetta', 'Chou'],
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TAKIMLAR TABLOSU
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    tag VARCHAR(10),
    captain_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    game VARCHAR(50) NOT NULL DEFAULT 'MLBB',
    essential_roles TEXT[] NOT NULL, -- örn: ['Roamer', 'Jungler']
    rating NUMERIC(2,1) DEFAULT 5.0,
    description TEXT,
    max_members INT DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TAKIM KADROSU (Üyeler ve Rolleri)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_in_team VARCHAR(30) NOT NULL, -- 'EXP', 'Jungler', 'Mid', 'Gold', 'Roamer', 'Coach'
    is_captain BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 4. TAKIM BAŞVURULARI VE DAVETLER
CREATE TABLE team_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    applied_role VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. KOÇLAR TABLOSU
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    experience_years INT NOT NULL DEFAULT 1,
    hourly_fee VARCHAR(50) DEFAULT 'Free',
    specialty TEXT NOT NULL, -- 'Macro, Rotation & Draft'
    rating NUMERIC(2,1) DEFAULT 5.0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TURNUVALAR TABLOSU
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    game VARCHAR(50) NOT NULL DEFAULT 'MLBB',
    prize_pool VARCHAR(100) NOT NULL,
    entry_fee VARCHAR(50) DEFAULT 'Free',
    max_teams INT DEFAULT 16,
    registered_teams INT DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BİLDİRİMLER TABLOSU
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL, -- 'team', 'coach', 'invite', 'other'
    title TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MAÇ GEÇMİŞİ TABLOSU
CREATE TABLE match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hero_name VARCHAR(50) NOT NULL,
    result VARCHAR(10) NOT NULL, -- 'VICTORY', 'DEFEAT'
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    assists INT DEFAULT 0,
    role VARCHAR(30),
    is_mvp BOOLEAN DEFAULT FALSE,
    played_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚡ Veri Çekme ve Durum Yönetimi (Data Fetching & State)

Projeye veri katmanını bağlarken önerilen endüstri standardı kütüphaneler:

1. **`@supabase/supabase-js`:**
   - Kimlik doğrulama (Auth), veritabanı CRUD sorguları ve depolama (avatar yükleme) işlemleri için resmi SDK.
2. **`@tanstack/react-query` (TanStack Query v5):**
   - **Önbellekleme (Caching):** Kullanıcı sekmeler arasında gezinirken verileri tekrar tekrar sunucudan çekmeyip anında ekrana basar.
   - **Optimistic Updates:** Takıma başvurulduğunda veya bildirim okundu işaretlendiğinde sunucu cevabını beklemeden UI anında güncellenir.
   - **Loading / Error States:** Yüklenme animasyonları (`ActivityIndicator`) ve hata durumları temiz bir şekilde yönetilir.
3. **`zustand` (İstemci Durum Yönetimi):**
   - Aktif kullanıcı oturumu (session), seçili tema (Light/Dark) ve anlık filtreler (Game, Rank, Role) için hafif ve performanslı global state kütüphanesi.

---

## 📂 Proje Dizin Yapısı

```
clutch/
├── assets/                  # Görseller, ikonlar ve fontlar
├── src/
│   ├── app/                 # Expo Router Ekran Rotaları
│   │   ├── _layout.tsx      # Kök Stack Navigator (Modal & Sub-screen rotaları)
│   │   ├── (tabs)/          # Alt Sekme Navigasyonu
│   │   │   ├── _layout.tsx  # Özel Bottom Tab Bar tasarımı
│   │   │   ├── index.tsx    # 🏠 Home (Dashboard, son maçlar, istatistikler)
│   │   │   ├── teams.tsx    # 👥 Find a Team (Filtreler, takım kartları)
│   │   │   ├── tournaments.tsx # 🏆 Tournaments (Turnuva listesi & kayıt)
│   │   │   └── profile.tsx  # 👤 Profile (Oyuncu kartı & hesap menüsü)
│   │   ├── find-coach.tsx   # 🎯 Koç Bulma ve Rezervasyon ekranı
│   │   ├── my-team.tsx      # 🛡️ Takım Kadrosu ve Yönetimi
│   │   ├── notifications.tsx# 🔔 Bildirim Merkezi (Filtreli)
│   │   ├── player-info.tsx  # ℹ️ Detaylı Oyuncu İstatistik Kartı
│   │   ├── settings.tsx     # ⚙️ Ayarlar (Dil, Bildirim, Tema, Çıkış)
│   │   └── login.tsx        # 🔑 Giriş & Kayıt ekranı (Google/Discord)
│   ├── components/          # Yeniden Kullanılabilir Bileşenler
│   │   ├── destiny/
│   │   │   └── header.tsx   # Ortak Destiny Header (Avatar, Arama, Zil)
│   │   └── ui/              # Temel UI elemanları
│   ├── constants/
│   │   └── theme.ts         # Merkezi Renk, Tipografi ve Gölge Token'ları
│   └── hooks/               # Custom React Hook'ları
├── AGENTS.md                # Geliştirici ve Agent Kuralları
├── app.json                 # Expo Yapılandırması
├── package.json             # Bağımlılıklar ve Komutlar
├── tsconfig.json            # TypeScript Yapılandırması
└── README.md                # Proje Belgeleri
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
# Yerel ağda Expo Go ile çalıştırmak için (Önerilen):
npx expo start -c

# Farklı ağlar veya mobil veri için (Tünel modu):
npx expo start --tunnel -c
```

### 3. Kod Kalitesi ve Tip Kontrolleri
```bash
# TypeScript tip kontrolü:
npx tsc --noEmit

# Linter kontrolü:
npx eslint .

# Expo bağımlılık uyumluluk kontrolü:
npx expo-doctor
```

---

## 🗺️ Geliştirme Yol Haritası (Roadmap)

- [x] **Aşama 1: UI & Tasarım Sistemi:** Figma tasarımlarının nizami ve tutarlı olarak React Native/Expo SDK 58'e aktarılması.
- [x] **Aşama 2: Navigasyon & Ekran Akışları:** Stack ve Tabs ile tüm ekranlar arası yönlendirmelerin tamamlanması.
- [ ] **Aşama 3: Backend & Database Entegrasyonu:** Supabase projesinin açılması, tabloların oluşturulması ve `@supabase/supabase-js` bağlantısı.
- [ ] **Aşama 4: Gerçek Kimlik Doğrulama:** Supabase Auth ile E-posta, Google ve Discord girişlerinin canlıya alınması.
- [ ] **Aşama 5: Canlı Veri Akışı (TanStack Query):** Takım başvuruları, koç davetleri ve turnuva kayıtlarının veritabanına bağlanması.
- [ ] **Aşama 6: Realtime Bildirimler:** Supabase Realtime ile anlık bildirim iletimi.
