import React from 'react';
import {
  Sparkles,
  Shield,
  Heart,
  Lock,
  ArrowRight,
  Camera,
  Film,
  BookMarked,
  StickyNote,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USER_1, DEMO_USER_2 } from '../../services/sampleData';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenSignup }) => {
  const { switchUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <span className="text-xl">❤️</span>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Memory<span className="text-purple-500">Vault</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenLogin}
            className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={onOpenSignup}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            Create Your Memory Space
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your private, encrypted personal sanctuary</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
          Your Memories.{' '}
          <span className="text-gradient">Your Story.</span>{' '}
          <br className="hidden sm:inline" />
          Forever.
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Keep your favorite photos, videos, thoughts, and unforgettable moments in one private digital space. 
          Isolated, encrypted, and preserved with care.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onOpenSignup}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 text-white font-bold text-base shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Your Memory Space</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-850 font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Login to Your Vault</span>
          </button>
        </div>

        {/* Quick Demo Preview Switcher */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl max-w-xl mx-auto shadow-xl">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>Instant 1-Click Demo Accounts (Test User Isolation):</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => switchUser(DEMO_USER_1.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold border border-purple-500/20 transition-all hover:scale-105"
            >
              <img
                src={DEMO_USER_1.avatarUrl}
                alt="Elena"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Enter as Elena (Photographer)</span>
            </button>
            <button
              onClick={() => switchUser(DEMO_USER_2.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 text-xs font-semibold border border-sky-500/20 transition-all hover:scale-105"
            >
              <img
                src={DEMO_USER_2.avatarUrl}
                alt="Marcus"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Enter as Marcus (Engineer)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Visual Showcase - Interactive Memory Cards Layout */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Photo & Lightbox Preview */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-navy-900/60 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
                alt="Santorini"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white font-medium flex items-center gap-1">
                <Camera className="w-3 h-3 text-purple-400" />
                <span>Photo Vault</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md p-3 rounded-xl text-white">
                <h4 className="text-sm font-bold">Santorini Sunset Over Oia</h4>
                <p className="text-[11px] text-slate-300">August 20, 2026 • #greece #sunset</p>
              </div>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              High-Res Photo Albums & Lightbox
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload memories in pristine resolution. Zoom, tag, favorite, and browse through smooth masonry galleries.
            </p>
          </div>

          {/* Card 2: Digital Diary with Mood Badges */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-navy-900/60 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent border border-purple-500/20 mb-4 h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center gap-1.5">
                    <span>❤️</span> Loved
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">August 21, 2026</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  A Heart Full of Gratitude
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  Shared a three-hour dinner under the fig trees with Mom, Dad, and Chris. We talked about Grandpa's old boat stories until our sides hurt from laughing...
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-purple-500/15">
                <BookMarked className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] text-slate-400 font-medium">Digital Mood Journal</span>
              </div>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Emotional Digital Diary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Track your emotional landscape with 7 intuitive moods. Write intimate thoughts with photo attachments.
            </p>
          </div>

          {/* Card 3: Memory Timeline & Video Storage */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-navy-900/60 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 mb-4 h-[220px] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>2026 Timeline Tree</span>
                </div>
                <div className="pl-3 border-l-2 border-purple-500/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <span>📸</span> <span>Mt. Rainier Sunrise Hike</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <span>🎥</span> <span>Ruby Beach Ocean Waves</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <span>📔</span> <span>Reflections from Summit</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-sky-400" /> Video & Timeline
                </span>
                <span className="text-emerald-500 font-semibold">100% Chronological</span>
              </div>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Interactive Memory Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Travel back in time through an elegant Year → Month → Day chronological roadmap of your life.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Designed for Privacy & Longevity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Your life story belongs only to you. MemoryVault is built from the ground up with strict data isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800/80 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">User Isolation</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each user operates in a segregated vault partition. Zero cross-visibility between accounts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800/80 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
              <Film className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Video & Audio Storage</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Play your clips smoothly with custom video player controls, thumbnail frame generation, and tagging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800/80 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <StickyNote className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Productivity Notes</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jot down quick thoughts, checklists, bucket lists, and color-coded ideas with pin-to-top support.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800/80 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">⭐ Starred Favorites</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instantly star cherished photos, heartfelt diary notes, and memorable videos for quick nostalgia.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>❤️</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">MemoryVault</span>
          <span>— Your life, beautifully preserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Encrypted Local Vault</span>
          <span>•</span>
          <span>Cloud-Ready Architecture</span>
        </div>
      </footer>
    </div>
  );
};
