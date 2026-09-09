import { User, PhotoMemory, VideoMemory, DiaryMemory, NoteMemory } from '../types';

export const DEMO_USER_1: User = {
  id: 'user_elena_vance',
  name: 'Elena Vance',
  phone: '+1 (555) 234-5678',
  pinHash: '1234',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  createdAt: '2025-01-15T08:30:00Z',
  bio: 'Photographer, explorer & memory collector. Living life one sunset at a time.'
};

export const DEMO_USER_2: User = {
  id: 'user_marcus_chen',
  name: 'Marcus Chen',
  phone: '+1 (555) 987-6543',
  pinHash: '4321',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  createdAt: '2025-04-10T14:15:00Z',
  bio: 'Software architect & coffee enthusiast. Documenting the little moments.'
};

export const SAMPLE_PHOTOS_USER_1: PhotoMemory[] = [
  {
    id: 'photo_elena_1',
    userId: 'user_elena_vance',
    type: 'photo',
    title: 'Sunrise above the Clouds',
    caption: 'Hiked up Mt. Rainier before dawn. The alpine glow across the horizon was truly breathtaking.',
    date: '2026-09-02',
    tags: ['hiking', 'sunrise', 'nature', 'pnw'],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    isFavorite: true,
    fileSize: 3420000,
    createdAt: '2026-09-02T06:15:00Z'
  },
  {
    id: 'photo_elena_2',
    userId: 'user_elena_vance',
    type: 'photo',
    title: 'Santorini Sunset Over Oia',
    caption: 'Golden hour in Greece with the best breeze. Never want this summer evening to end.',
    date: '2026-08-20',
    tags: ['travel', 'greece', 'santorini', 'sunset'],
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85',
    isFavorite: true,
    fileSize: 4150000,
    createdAt: '2026-08-20T19:40:00Z'
  },
  {
    id: 'photo_elena_3',
    userId: 'user_elena_vance',
    type: 'photo',
    title: 'Maya’s 7th Birthday Surprise',
    caption: 'She saw the puppy cake and couldn’t stop jumping for 10 minutes straight!',
    date: '2026-07-14',
    tags: ['family', 'birthday', 'celebration', 'maya'],
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
    isFavorite: false,
    fileSize: 2800000,
    createdAt: '2026-07-14T16:00:00Z'
  },
  {
    id: 'photo_elena_4',
    userId: 'user_elena_vance',
    type: 'photo',
    title: 'Quiet Morning with Lavender Tea',
    caption: 'Rainy Sunday morning reading Oliver Sacks on the balcony.',
    date: '2026-06-11',
    tags: ['cozy', 'books', 'peace', 'home'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
    isFavorite: true,
    fileSize: 1950000,
    createdAt: '2026-06-11T09:20:00Z'
  },
  {
    id: 'photo_elena_5',
    userId: 'user_elena_vance',
    type: 'photo',
    title: 'Road Trip through Big Sur',
    caption: 'Stopped by Bixby Bridge right as the fog started rolling over the Pacific.',
    date: '2026-05-04',
    tags: ['california', 'roadtrip', 'ocean', 'adventure'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    isFavorite: false,
    fileSize: 3880000,
    createdAt: '2026-05-04T15:30:00Z'
  }
];

export const SAMPLE_VIDEOS_USER_1: VideoMemory[] = [
  {
    id: 'video_elena_1',
    userId: 'user_elena_vance',
    type: 'video',
    title: 'Waves Crashing at Ruby Beach',
    description: 'Slow motion footage of the Pacific tide rolling against the sea stacks.',
    date: '2026-08-30',
    tags: ['ocean', 'rubybeach', 'nature'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    duration: 15,
    fileSize: 15400000,
    isFavorite: true,
    createdAt: '2026-08-30T17:10:00Z'
  },
  {
    id: 'video_elena_2',
    userId: 'user_elena_vance',
    type: 'video',
    title: 'Golden Retriever First Snow Day',
    description: 'Oliver sprinting through 6 inches of fresh powder without looking back!',
    date: '2026-02-12',
    tags: ['pets', 'dog', 'winter', 'snow'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    duration: 15,
    fileSize: 18200000,
    isFavorite: false,
    createdAt: '2026-02-12T11:45:00Z'
  }
];

export const SAMPLE_DIARY_USER_1: DiaryMemory[] = [
  {
    id: 'diary_elena_1',
    userId: 'user_elena_vance',
    type: 'diary',
    title: 'Reflections from the Summit',
    date: '2026-09-02',
    mood: 'peaceful',
    content: `Standing at 7,000 feet this morning, all the frantic noise of modern life simply dissolved. 
    
There is something sacred about looking down onto a sea of mist that covers the valleys while the sunlight warms your frostbitten fingers. I realized today that I spend so much time worrying about the next milestone that I forget how far we've already climbed. 

Promise to myself: take more slow mornings. Breathe deeply before answering emails. Remember who you are when nobody is watching.`,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    isFavorite: true,
    createdAt: '2026-09-02T20:30:00Z'
  },
  {
    id: 'diary_elena_2',
    userId: 'user_elena_vance',
    type: 'diary',
    title: 'A Heart Full of Gratitude',
    date: '2026-08-21',
    mood: 'loved',
    content: `Yesterday was one of those days where everything seemed illuminated with kindness. Shared a three-hour dinner under the fig trees with Mom, Dad, and Chris. We talked about Grandpa's old boat stories until our sides hurt from laughing.

Life is fragile and brief, but these evenings feel immortal.`,
    isFavorite: true,
    createdAt: '2026-08-21T22:15:00Z'
  },
  {
    id: 'diary_elena_3',
    userId: 'user_elena_vance',
    type: 'diary',
    title: 'New Studio Space Unlocked!',
    date: '2026-07-01',
    mood: 'excited',
    content: `Signed the lease on the brick warehouse studio today! 14-foot ceilings, north-facing skylights, and that unmistakable scent of old hardwood and new beginnings. 

Next week: painting the feature wall a deep midnight indigo and bringing in the drafting table. Can't wait to start the gallery prints.`,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    isFavorite: false,
    createdAt: '2026-07-01T18:00:00Z'
  },
  {
    id: 'diary_elena_4',
    userId: 'user_elena_vance',
    type: 'diary',
    title: 'Dealing with Creative Burnout',
    date: '2026-05-18',
    mood: 'tired',
    content: `Stared at blank canvases for three hours today. Felt completely drained and uninspired. Instead of forcing it, I put down the brushes, put Oliver on his leash, and took a two-hour walk in the rain.

Rest is not wasted time; it is fertile soil.`,
    isFavorite: false,
    createdAt: '2026-05-18T19:00:00Z'
  }
];

export const SAMPLE_NOTES_USER_1: NoteMemory[] = [
  {
    id: 'note_elena_1',
    userId: 'user_elena_vance',
    type: 'note',
    date: '2026-01-10',
    title: '🌿 Life Principles & Mantras',
    content: `• Never trade your inner peace for temporary approval.
• Document your parents' stories before they become memories.
• Invest in comfortable shoes, good bedding, and high-quality cameras.
• When in doubt, go outside and touch cedar or ocean water.`,
    tags: ['wisdom', 'mindset', 'core'],
    color: '#8b5cf6', // Violet
    isPinned: true,
    isFavorite: true,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'note_elena_2',
    userId: 'user_elena_vance',
    type: 'note',
    date: '2026-03-15',
    title: '🏔️ Bucket List Adventures 2026-2027',
    content: `1. Trekking the Torres del Paine W-Circuit in Patagonia
2. Northern Lights cabin in Tromsø, Norway
3. Sea kayaking with humpback whales in Vancouver Island
4. Cooking masterclass in Bologna, Italy`,
    tags: ['travel', 'bucketlist', 'goals'],
    color: '#0ea5e9', // Sky Blue
    isPinned: true,
    isFavorite: false,
    createdAt: '2026-03-15T14:20:00Z'
  },
  {
    id: 'note_elena_3',
    userId: 'user_elena_vance',
    type: 'note',
    date: '2026-04-22',
    title: '📖 Favorite Books That Changed My Perspective',
    content: `• The Salt Path by Raynor Winn
• Braiding Sweetgrass by Robin Wall Kimmerer
• The Creative Act by Rick Rubin
• Man's Search for Meaning by Viktor Frankl`,
    tags: ['books', 'reading'],
    color: '#10b981', // Emerald
    isPinned: false,
    isFavorite: true,
    createdAt: '2026-04-22T08:50:00Z'
  },
  {
    id: 'note_elena_4',
    userId: 'user_elena_vance',
    type: 'note',
    date: '2026-08-05',
    title: '☕ Grandma’s Spiced Apple Galette Recipe',
    content: `Ingredients:
- 2 cups unbleached flour, chilled butter, ice water
- 4 Honeycrisp apples sliced thinly
- 2 tbsp brown sugar, 1 tsp cinnamon, pinch of cardamom
- Bake at 375°F for 42 minutes until crust is deep gold.`,
    tags: ['recipe', 'family', 'baking'],
    color: '#f59e0b', // Amber
    isPinned: false,
    isFavorite: false,
    createdAt: '2026-08-05T17:40:00Z'
  }
];

// SAMPLE DATA FOR MARCUS (To verify absolute data isolation)
export const SAMPLE_PHOTOS_USER_2: PhotoMemory[] = [
  {
    id: 'photo_marcus_1',
    userId: 'user_marcus_chen',
    type: 'photo',
    title: 'Tokyo Neon Shinjuku Walk',
    caption: 'Rainy reflection after dusk in Shinjuku alleys. Neon glow everywhere.',
    date: '2026-08-15',
    tags: ['tokyo', 'street', 'night', 'japan'],
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
    isFavorite: true,
    fileSize: 3900000,
    createdAt: '2026-08-15T21:00:00Z'
  },
  {
    id: 'photo_marcus_2',
    userId: 'user_marcus_chen',
    type: 'photo',
    title: 'Custom Mechanical Keyboard Build',
    caption: 'Lubed Holy Panda switches on a custom brass plate with GMK Laser caps.',
    date: '2026-07-28',
    tags: ['keyboards', 'hardware', 'diy'],
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85',
    isFavorite: false,
    fileSize: 2400000,
    createdAt: '2026-07-28T14:30:00Z'
  }
];

export const SAMPLE_DIARY_USER_2: DiaryMemory[] = [
  {
    id: 'diary_marcus_1',
    userId: 'user_marcus_chen',
    type: 'diary',
    title: 'First Open Source Milestone',
    date: '2026-08-10',
    mood: 'excited',
    content: `Our telemetry library hit 1,000 stars on GitHub today. It felt surreal seeing engineers from across the world submitting pull requests and finding utility in code I started in my bedroom.`,
    isFavorite: true,
    createdAt: '2026-08-10T19:00:00Z'
  }
];

export const SAMPLE_NOTES_USER_2: NoteMemory[] = [
  {
    id: 'note_marcus_1',
    userId: 'user_marcus_chen',
    type: 'note',
    date: '2026-06-20',
    title: '🚀 Microservice Architecture Notes',
    content: `• Keep service boundaries aligned with business domains.
• Asynchronous event-driven messaging with idempotent consumers.
• Zero shared database tables between microservices.`,
    tags: ['engineering', 'architecture'],
    color: '#8b5cf6',
    isPinned: true,
    isFavorite: false,
    createdAt: '2026-06-20T11:00:00Z'
  }
];
