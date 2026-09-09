import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useMemories } from './context/MemoryContext';
import { ActiveTab, MemoryItem, PhotoMemory, VideoMemory, DiaryMemory, NoteMemory } from './types';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { PhotosView } from './components/photos/PhotosView';
import { VideosView } from './components/videos/VideosView';
import { DiaryView } from './components/diary/DiaryView';
import { NotesView } from './components/notes/NotesView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { TimelineView } from './components/timeline/TimelineView';
import { SearchView } from './components/search/SearchView';
import { ProfileView } from './components/profile/ProfileView';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { AddPhotoModal } from './components/photos/AddPhotoModal';
import { AddVideoModal } from './components/videos/AddVideoModal';
import { DiaryModal } from './components/diary/DiaryModal';
import { NoteModal } from './components/notes/NoteModal';
import { LightboxModal } from './components/photos/LightboxModal';
import { VideoPlayerModal } from './components/videos/VideoPlayerModal';
import { AddMemorySpeedDial } from './components/common/AddMemorySpeedDial';
import { ToastContainer, ToastMessage } from './components/common/Toast';

export const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { photos, toggleFavorite, deleteMemory } = useMemories();

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Active viewing modals
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoMemory | null>(null);
  const [activePlayerVideo, setActivePlayerVideo] = useState<VideoMemory | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Generic memory selector (e.g. from Timeline or Search)
  const handleSelectMemory = (memory: MemoryItem) => {
    if (memory.type === 'photo') {
      setActiveLightboxPhoto(memory);
    } else if (memory.type === 'video') {
      setActivePlayerVideo(memory);
    } else if (memory.type === 'diary') {
      setActiveTab('diary');
    } else if (memory.type === 'note') {
      setActiveTab('notes');
    }
  };

  // Loading indicator for initial database boot
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-purple-500/30 animate-pulse mb-4">
          ❤️
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Unlocking MemoryVault...
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Decryption and private vault initialization in progress
        </p>
      </div>
    );
  }

  // Not logged in -> Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onOpenSignup={() => {
            setAuthModalMode('signup');
            setIsAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => addToast('Welcome to your MemoryVault! ❤️', 'success')}
        />

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // Authenticated Dashboard & Vault Layout
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddModal={() => setIsAddPhotoOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                setActiveTab={setActiveTab}
                onOpenPhotoModal={() => setIsAddPhotoOpen(true)}
                onOpenVideoModal={() => setIsAddVideoOpen(true)}
                onOpenDiaryModal={() => setIsDiaryModalOpen(true)}
                onOpenNoteModal={() => setIsNoteModalOpen(true)}
                onSelectMemory={handleSelectMemory}
              />
            )}

            {activeTab === 'photos' && <PhotosView />}

            {activeTab === 'videos' && <VideosView />}

            {activeTab === 'diary' && <DiaryView />}

            {activeTab === 'notes' && <NotesView />}

            {activeTab === 'favorites' && (
              <FavoritesView onSelectMemory={handleSelectMemory} />
            )}

            {activeTab === 'timeline' && (
              <TimelineView onSelectMemory={handleSelectMemory} />
            )}

            {activeTab === 'search' && (
              <SearchView
                query={searchQuery}
                setQuery={setSearchQuery}
                onSelectMemory={handleSelectMemory}
              />
            )}

            {activeTab === 'profile' && <ProfileView />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Prominent Quick-Add Speed Dial ("+ Add Memory") */}
      <AddMemorySpeedDial
        onOpenPhoto={() => setIsAddPhotoOpen(true)}
        onOpenVideo={() => setIsAddVideoOpen(true)}
        onOpenDiary={() => setIsDiaryModalOpen(true)}
        onOpenNote={() => setIsNoteModalOpen(true)}
      />

      {/* Creation Modals */}
      <AddPhotoModal
        isOpen={isAddPhotoOpen}
        onClose={() => setIsAddPhotoOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <AddVideoModal
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <DiaryModal
        isOpen={isDiaryModalOpen}
        onClose={() => setIsDiaryModalOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />

      {/* Media Viewers (from Timeline, Search, or Dashboard) */}
      <LightboxModal
        photo={activeLightboxPhoto}
        allPhotos={photos}
        onClose={() => setActiveLightboxPhoto(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={(id) => {
          deleteMemory(id);
          setActiveLightboxPhoto(null);
          addToast('Photo deleted', 'info');
        }}
        onNavigate={(p) => setActiveLightboxPhoto(p)}
      />

      <VideoPlayerModal
        video={activePlayerVideo}
        onClose={() => setActivePlayerVideo(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={(id) => {
          deleteMemory(id);
          setActivePlayerVideo(null);
          addToast('Video deleted', 'info');
        }}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
