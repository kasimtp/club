// Mock Database Service for Club Management Website
// Persists data in localStorage so that CRUD operations survive page refreshes.

const KEYS = {
  MEMBERS: 'club_members',
  EVENTS: 'club_events',
  GALLERY: 'club_gallery',
  NEWS: 'club_news',
  TEAM: 'club_team',
  REQUESTS: 'club_membership_requests',
  ADMIN_PROFILE: 'club_admin_profile'
};

// Default seed data
const defaultMembers = [
  { id: 'm-1', name: 'Alexander Wright', email: 'alex.wright@universalclub.com', role: 'Member', status: 'Active', phone: '+1 (555) 123-4567', joinedDate: '2025-01-15' },
  { id: 'm-2', name: 'Sophia Martinez', email: 'sophia.m@universalclub.com', role: 'Coach', status: 'Active', phone: '+1 (555) 987-6543', joinedDate: '2025-02-10' },
  { id: 'm-3', name: 'Marcus Vance', email: 'marcus.v@universalclub.com', role: 'Member', status: 'Inactive', phone: '+1 (555) 246-8135', joinedDate: '2025-03-22' },
  { id: 'm-4', name: 'Elena Rostova', email: 'elena.r@universalclub.com', role: 'Secretary', status: 'Active', phone: '+1 (555) 369-1470', joinedDate: '2024-11-05' },
  { id: 'm-5', name: 'Jonathan Cole', email: 'j.cole@universalclub.com', role: 'Member', status: 'Active', phone: '+1 (555) 852-9630', joinedDate: '2025-05-18' }
];

const defaultEvents = [
  {
    id: 'e-1',
    title: 'Universal Annual Summer Marathon',
    description: 'Join us for our signature athletic event of the year! A 10K/Half-Marathon course running through the beautiful scenic forest trail. Open to all fitness levels with water stations, medical aid, and completion medals.',
    date: '2026-07-25',
    time: '07:00 AM',
    location: 'Central Park Trailhead',
    category: 'Competition',
    image: 'https://images.unsplash.com/photo-1526676096777-b65d49bb93c7?auto=format&fit=crop&w=800&q=80',
    price: '$25.00',
    registrations: [
      { name: 'David Smith', email: 'david@gmail.com', phone: '+1 (555) 999-8888' },
      { name: 'Sarah Connor', email: 'sarah@resistance.org', phone: '+1 (555) 777-6666' }
    ]
  },
  {
    id: 'e-2',
    title: 'High-Performance Cardio Workshop',
    description: 'A 3-hour masterclass on optimizing cardiovascular stamina led by our head coach. Includes personal heart-rate training zones analysis, breathing techniques, and high-intensity workout design.',
    date: '2026-08-12',
    time: '10:00 AM',
    location: 'Main Gym Hall A',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    price: 'Free (Members Only)',
    registrations: []
  },
  {
    id: 'e-3',
    title: 'Mindfulness & Yoga Sanctuary',
    description: 'Relax, restore, and reset with an evening of deep stretching, breathing work, and guided meditation. Ideal for stress reduction and restoring muscular balance after high-intensity training.',
    date: '2026-06-28',
    time: '06:30 PM',
    location: 'Zen Studio Patio',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    price: '$15.00',
    registrations: [
      { name: 'Elena Rostova', email: 'elena.r@universalclub.com', phone: '+1 (555) 369-1470' }
    ]
  },
  {
    id: 'e-4',
    title: 'Universal Charity Volleyball Cup',
    description: 'A friendly community volleyball tournament to raise funds for local sports clinics. Form a team of six or join as an individual agent to be placed in a squad. Barbecue and refreshments provided.',
    date: '2026-09-05',
    time: '09:00 AM',
    location: 'Beach Courts Arena',
    category: 'Community Activities',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    price: '$10.00',
    registrations: []
  }
];

const defaultGallery = [
  { id: 'g-1', title: 'Morning Cardio Drills', type: 'photo', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', category: 'Training' },
  { id: 'g-2', title: 'Olympic Weightlifting Class', type: 'photo', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', category: 'Training' },
  { id: 'g-3', title: 'Universal Summer Run Start Line', type: 'photo', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80', category: 'Events' },
  { id: 'g-4', title: 'Annual Community Gala Dinner', type: 'photo', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', category: 'Social' },
  { id: 'g-5', title: 'Strength Training Highlight Reel', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', category: 'Training' },
  { id: 'g-6', title: 'Core Stability Workshops', type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', category: 'Workshops' }
];

const defaultNews = [
  {
    id: 'n-1',
    title: 'Universal Club Unveils New Olympic Pool Renovations',
    content: 'We are thrilled to announce that our Olympic-size swimming pool facility will undergo a premium upgrade starting next week. The renovation will include state-of-the-art filtration systems, anti-slip porcelain decking, and premium LED illumination. Estimated reopening is set for early August.',
    date: '2026-06-12',
    category: 'Announcement',
    author: 'President Vance',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-2',
    title: 'Universal Youth Relay Team Claims State Gold',
    content: 'A massive congratulations to our Under-18 track relay team who dominated the State Athletic Championships last Saturday, securing the Gold medal in the 4x100m sprint. Head Coach Sophia Martinez praised the athletes dedication and relentless spirit.',
    date: '2026-06-05',
    category: 'Achievement',
    author: 'Coach Martinez',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-3',
    title: 'Membership Portal Transition & Mobile App Release',
    content: 'To enhance members administrative ease, we are launching our fully-featured dashboard portal today. Members can register for upcoming events, view media galleries, and request updates. Look out for our upcoming iOS & Android companion applications next month!',
    date: '2026-06-15',
    category: 'Event Update',
    author: 'Secretary Rostova',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80'
  }
];

const defaultTeam = [
  { id: 't-1', name: 'Nicholas Vance', position: 'President', bio: 'Former competitive decathlete with over 15 years of community sports management experience. Dedicated to fostering high standards of athletic development and inclusivity.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', email: 'nicholas.vance@universalclub.com' },
  { id: 't-2', name: 'Elena Rostova', position: 'Secretary', bio: 'Brings structural efficiency and corporate communication background. Manages all membership portals, schedules, and compliance protocols with passion.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', email: 'elena.rostova@universalclub.com' },
  { id: 't-3', name: 'Sophia Martinez', position: 'Head Coach / Committee', bio: 'Olympic track medalist in sprint relays. Specializes in youth athletic development, strength, conditioning, and sports psychology.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', email: 'sophia.martinez@universalclub.com' },
  { id: 't-4', name: 'Marcus Sterling', position: 'Treasurer / Committee', bio: 'Chartered Financial Analyst. Oversees the clubs investments, budgeting, and sponsorship management to ensure sustainable expansion.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', email: 'marcus.sterling@universalclub.com' }
];

const defaultRequests = [
  { id: 'r-1', name: 'Ethan Hunt', email: 'ethan@impossible.org', phone: '+1 (555) 007-9999', plan: 'Universal Membership', status: 'Pending', message: 'Looking forward to utilizing the high-performance gym area.', date: '2026-06-14' },
  { id: 'r-2', name: 'Lois Lane', email: 'lois@dailyplanet.com', phone: '+1 (555) 321-4321', plan: 'Universal Membership', status: 'Approved', message: 'Super excited to join the yoga workshops!', date: '2026-06-11' }
];

const defaultAdminProfile = {
  username: 'clubadmin',
  name: 'Club Administrator',
  email: 'clubadmin@universalclub.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
};

// Database utilities
const readFromStore = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading database key: ${key}`, error);
    return defaultValue;
  }
};

const writeToStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving database key: ${key}`, error);
  }
};

// Initialize DB elements if they do not exist
export const initDb = () => {
  if (!localStorage.getItem(KEYS.MEMBERS)) writeToStore(KEYS.MEMBERS, defaultMembers);
  if (!localStorage.getItem(KEYS.EVENTS)) writeToStore(KEYS.EVENTS, defaultEvents);
  if (!localStorage.getItem(KEYS.GALLERY)) writeToStore(KEYS.GALLERY, defaultGallery);
  if (!localStorage.getItem(KEYS.NEWS)) writeToStore(KEYS.NEWS, defaultNews);
  if (!localStorage.getItem(KEYS.TEAM)) writeToStore(KEYS.TEAM, defaultTeam);
  if (!localStorage.getItem(KEYS.REQUESTS)) writeToStore(KEYS.REQUESTS, defaultRequests);
  
  // Initialize admin profile or migrate from legacy 'admin' username
  const existingProfile = localStorage.getItem(KEYS.ADMIN_PROFILE);
  if (!existingProfile) {
    writeToStore(KEYS.ADMIN_PROFILE, defaultAdminProfile);
  } else {
    try {
      const parsed = JSON.parse(existingProfile);
      if (parsed.username === 'admin') {
        writeToStore(KEYS.ADMIN_PROFILE, defaultAdminProfile);
      }
    } catch {
      writeToStore(KEYS.ADMIN_PROFILE, defaultAdminProfile);
    }
  }
};

// Clear DB functionality for dev reset
export const resetDb = () => {
  localStorage.setItem(KEYS.MEMBERS, JSON.stringify(defaultMembers));
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(defaultEvents));
  localStorage.setItem(KEYS.GALLERY, JSON.stringify(defaultGallery));
  localStorage.setItem(KEYS.NEWS, JSON.stringify(defaultNews));
  localStorage.setItem(KEYS.TEAM, JSON.stringify(defaultTeam));
  localStorage.setItem(KEYS.REQUESTS, JSON.stringify(defaultRequests));
  localStorage.setItem(KEYS.ADMIN_PROFILE, JSON.stringify(defaultAdminProfile));
};

// Interface getters & setters
export const db = {
  // Members CRUD
  getMembers: () => readFromStore(KEYS.MEMBERS, defaultMembers),
  saveMembers: (members) => writeToStore(KEYS.MEMBERS, members),
  
  // Events CRUD
  getEvents: () => readFromStore(KEYS.EVENTS, defaultEvents),
  saveEvents: (events) => writeToStore(KEYS.EVENTS, events),
  
  // Gallery CRUD
  getGallery: () => readFromStore(KEYS.GALLERY, defaultGallery),
  saveGallery: (gallery) => writeToStore(KEYS.GALLERY, gallery),
  
  // News CRUD
  getNews: () => readFromStore(KEYS.NEWS, defaultNews),
  saveNews: (news) => writeToStore(KEYS.NEWS, news),
  
  // Team CRUD
  getTeam: () => readFromStore(KEYS.TEAM, defaultTeam),
  saveTeam: (team) => writeToStore(KEYS.TEAM, team),

  // Requests CRUD
  getRequests: () => readFromStore(KEYS.REQUESTS, defaultRequests),
  saveRequests: (requests) => writeToStore(KEYS.REQUESTS, requests),

  // Admin Profile CRUD
  getAdminProfile: () => readFromStore(KEYS.ADMIN_PROFILE, defaultAdminProfile),
  saveAdminProfile: (profile) => writeToStore(KEYS.ADMIN_PROFILE, profile)
};
