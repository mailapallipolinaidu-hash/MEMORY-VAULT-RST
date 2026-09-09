<p align="center">
  <img src="https://img.shields.io/badge/MemoryVault-❤️-ff4081?style=for-the-badge&labelColor=1e293b" alt="MemoryVault" />
</p>

<h1 align="center">MemoryVault ❤️</h1>

<p align="center">
  <strong>Your Memories. Your Story. Forever.</strong>
</p>

<p align="center">
  A private, secure, and beautifully crafted digital vault to preserve your photos, videos, diary entries, notes, and life's most unforgettable moments — all stored locally in your browser.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/IndexedDB-Storage-FF6F00?style=flat-square&logo=databricks&logoColor=white" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📖 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📱 Usage](#-usage)
- [🏗️ Architecture](#️-architecture)
- [🎨 Theming](#-theming)
- [🔐 Privacy & Security](#-privacy--security)
- [📦 Build & Deployment](#-build--deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Overview

**MemoryVault** is a fully client-side, privacy-first personal memory manager built with React and TypeScript. It allows users to store photos, videos, diary entries, and notes in an elegant, responsive interface — all without any server or cloud dependency. Every piece of data lives exclusively in the user's browser via **IndexedDB**.

Think of it as your digital time capsule — a place to capture and relive your most cherished moments.

---

## 🎯 Features

### 📸 Photo Gallery
- Upload and browse photos with a beautiful masonry/grid layout
- Full-screen lightbox viewer with navigation between photos
- Add captions, tags, and dates to each photo
- Mark photos as favorites

### 🎬 Video Library
- Upload and manage video memories
- Auto-generated video thumbnails
- Built-in video player modal
- Duration tracking and file size metadata

### 📓 Digital Diary
- Write rich diary entries with mood tracking
- 7 mood types: Happy, Loved, Peaceful, Sad, Angry, Excited, Tired
- Emoji-enhanced mood indicators with color coding
- Edit and update existing entries

### 📝 Notes
- Quick-capture notes with color-coded cards
- Tag support for easy organization
- Pin important notes to the top
- Edit and update notes inline

### ⭐ Favorites
- Mark any memory (photo, video, diary, note) as a favorite
- Dedicated Favorites view to quickly access your most loved memories

### 📅 Timeline
- Chronological timeline view across all memory types
- Visual representation of your life's journey over time

### 🔍 Search
- Full-text search across all memories
- Search by title, caption, content, tags, mood, and date
- Instant, real-time results

### 👤 User Profiles
- Multi-user support with fully isolated vaults
- Phone number + 4-digit PIN authentication
- Customizable profile with avatar and bio
- Switch between accounts seamlessly

### 📊 Dashboard
- At-a-glance statistics: total photos, videos, diary entries, notes
- Storage usage breakdown (photos, videos, other)
- Quick-add shortcuts for every memory type
- Recent memories overview

### 🎉 Delightful Extras
- Confetti celebration animation on new memory creation
- Toast notifications for user feedback
- Speed-dial floating action button for quick memory additions
- Smooth micro-animations throughout the UI

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI component library |
| **Language** | TypeScript 5.5 | Type-safe development |
| **Build Tool** | Vite 5.4 | Lightning-fast HMR & bundling |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Icons** | Lucide React | Beautiful, consistent icon set |
| **Storage** | IndexedDB | Client-side persistent database |
| **Animations** | Canvas Confetti | Celebration effects |
| **Fonts** | Inter, Outfit, Playfair Display | Premium typography via Google Fonts |

---

## 📁 Project Structure

```
memoryvault/
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.js           # PostCSS configuration
│
└── src/
    ├── main.tsx                # Application bootstrap
    ├── App.tsx                 # Root component with routing & modals
    ├── index.css               # Global styles & Tailwind directives
    │
    ├── types/
    │   └── index.ts            # TypeScript interfaces & type definitions
    │
    ├── context/
    │   ├── AuthContext.tsx      # Authentication state management
    │   ├── MemoryContext.tsx    # Memory CRUD operations & state
    │   └── ThemeContext.tsx     # Dark/Light theme toggle
    │
    ├── services/
    │   ├── db.ts               # IndexedDB database layer
    │   ├── authService.ts      # User authentication logic
    │   ├── storageService.ts   # File upload & blob management
    │   ├── cloudStorageAdapter.ts # Cloud storage adapter (extensible)
    │   └── sampleData.ts       # Demo seed data for first-time users
    │
    └── components/
        ├── auth/               # Login & signup modals
        ├── common/             # Shared components (SpeedDial, Toast)
        ├── dashboard/          # Dashboard overview view
        ├── diary/              # Diary entry components
        ├── favorites/          # Favorites collection view
        ├── landing/            # Landing/welcome page
        ├── layout/             # Navbar, Sidebar, MobileNav
        ├── notes/              # Notes components
        ├── photos/             # Photo gallery, lightbox, upload
        ├── profile/            # User profile management
        ├── search/             # Search view & results
        ├── timeline/           # Chronological timeline view
        └── videos/             # Video library, player, upload
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **yarn** / **pnpm**)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/memoryvault.git
   cd memoryvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

The app will start with demo data pre-loaded so you can explore all features immediately.

---

## 📱 Usage

### Demo Accounts

On first launch, MemoryVault seeds two demo users so you can explore the app instantly:

| User | Phone | PIN |
|------|-------|-----|
| **Elena Vance** | Pre-loaded | Pre-loaded |
| **Marcus Chen** | Pre-loaded | Pre-loaded |

Each user has their own completely isolated vault with sample photos, videos, diary entries, and notes.

### Creating Your Own Account

1. Click **Sign Up** on the landing page
2. Enter your **Full Name**
3. Provide a **Mobile Number** (7+ digits)
4. Set a **4-digit Security PIN**
5. You'll be taken to your brand-new, empty vault — start creating memories!

### Adding Memories

Use the **floating ➕ speed-dial button** (bottom-right) or the dashboard quick-add cards to:
- 📸 **Add Photo** — Upload an image with caption, tags, and date
- 🎬 **Add Video** — Upload a video with title, description, and tags
- 📓 **Write Diary** — Compose a diary entry with mood selection
- 📝 **Create Note** — Jot down a quick note with color and tags

### Navigation

- **Desktop**: Use the left sidebar to switch between views
- **Mobile**: Use the bottom navigation bar
- **Search**: Use the search bar in the top navbar or navigate to the Search tab

---

## 🏗️ Architecture

### State Management

MemoryVault uses **React Context API** for state management with three primary contexts:

```
ThemeProvider          → Dark/Light mode
  └── AuthProvider     → User authentication & session
       └── MemoryProvider  → Memory CRUD, search, stats
            └── App        → UI & routing
```

### Data Flow

```
User Action → Context Method → Service Layer → IndexedDB → State Update → UI Re-render
```

### Database Schema (IndexedDB)

The app uses three IndexedDB object stores:

| Store | Key | Indexes | Purpose |
|-------|-----|---------|---------|
| `users` | `id` | `phone` (unique) | User accounts |
| `memories` | `id` | `userId`, `type`, `date`, `isFavorite`, `[userId, type]` | All memory items |
| `mediaBlobs` | `id` | `userId` | Binary photo/video data |

### Memory Types

All memories extend a `BaseMemory` interface:

```typescript
interface BaseMemory {
  id: string;
  userId: string;
  type: 'photo' | 'video' | 'diary' | 'note';
  date: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}
```

Each type adds its own specific fields (e.g., `caption` & `tags` for photos, `mood` for diary entries, `isPinned` for notes).

### Extensibility

The storage layer is designed with an **adapter pattern** (`IStorageService` interface), making it straightforward to swap the local IndexedDB storage with cloud providers like Firebase Storage or Supabase.

---

## 🎨 Theming

MemoryVault supports both **Light** and **Dark** modes:

- **Auto-detection**: Respects your OS-level `prefers-color-scheme` setting on first visit
- **Manual toggle**: Switch themes from the navbar
- **Persistent**: Your preference is saved to `localStorage` and restored on reload

The dark theme uses a custom **Navy** palette for a premium, eye-friendly experience.

---

## 🔐 Privacy & Security

MemoryVault is designed with privacy as a core principle:

- **100% Client-Side**: All data is stored locally in your browser's IndexedDB. Nothing is ever sent to any server.
- **No Cloud Dependencies**: The app works entirely offline after initial load — no internet connection required.
- **User Isolation**: Each user account has a completely separate data vault. Cross-user data contamination is prevented at the database query level.
- **PIN Protection**: User accounts are protected with a 4-digit security PIN.
- **Data Portability**: Export your entire vault as JSON and import it on another device.
- **No Tracking**: Zero analytics, no cookies, no third-party scripts.

> ⚠️ **Note**: Since data is stored in the browser, clearing your browser data will delete your memories. Use the **Export** feature in your profile to back up your vault regularly.

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

This runs TypeScript type-checking and Vite bundling. Output is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy

The `dist/` folder contains static files that can be deployed to any static hosting provider:

- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag & drop the `dist/` folder or connect your Git repo
- **GitHub Pages**: Use `gh-pages` package or GitHub Actions
- **Firebase Hosting**: `firebase deploy`
- **Any Static Server**: Serve the `dist/` folder with any HTTP server

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing component structure under `src/components/`
- Use TypeScript for all new files
- Keep components focused and reusable
- Use the existing Context API patterns for state management
- Write descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <strong>Polinaidu</strong>
</p>

<p align="center">
  <em>Preserve what matters. Relive what inspires. Your vault, your rules.</em>
</p>
