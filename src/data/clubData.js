// Static club metadata, fallback events, services, team, news, initial slides and programs
// Sourced from CLUB_APP_REFERENCE.md and Universal Club mobile app specification

export const clubInfo = {
  name: 'Universal Sports & Arts Club',
  shortName: 'Universal Club',
  tagline: 'Fostering athletic mastery, wellness restoration & community synergy.',
  registrationNumber: 'REG/KL/MPM/2015/0428',
  affiliation: 'Affiliated with Kerala State Sports Council & District Sports Council',
  establishedYear: 2015,
  phone: '+91 98470 12345',
  email: 'universalclubkerala@gmail.com',
  address: 'Universal Sports Complex, Main Road, Malappuram, Kerala 676505',
  mapCoordinates: '11.0732° N, 76.0740° E',
  openingHours: {
    weekdays: '05:30 AM – 10:00 PM',
    weekends: '06:00 AM – 09:30 PM'
  },
  membershipFee: '₹200 / year',
  annualFee: 200,
};

export const defaultSlides = [
  {
    id: 'slide-1',
    title: 'State-of-the-Art Athletic Complex & Training Grounds',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85',
    ctaLabel: 'Explore Programs',
    ctaType: 'screen',
    ctaScreen: '/programs',
    order: 1,
    active: true,
  },
  {
    id: 'slide-2',
    title: 'Annual Kerala Championship 2026 Registration Open',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=85',
    ctaLabel: 'View Events',
    ctaType: 'screen',
    ctaScreen: '/events',
    order: 2,
    active: true,
  },
  {
    id: 'slide-3',
    title: 'Become an Official Member — ₹200 / Year',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=85',
    ctaLabel: 'Apply for Membership',
    ctaType: 'screen',
    ctaScreen: '/membership',
    order: 3,
    active: true,
  }
];

export const defaultPrograms = [
  {
    id: 'prog-1',
    title: 'All Kerala Inter-Club Badminton Open 2026',
    description: 'Premier regional tournament featuring singles and doubles categories for junior, senior, and master divisions. High-grade synthetic indoor courts with national-level officiating and cash prizes.',
    date: 'Oct 25, 2026',
    time: '08:30 AM',
    location: 'Universal Indoor Arena, Malappuram',
    category: 'Tournament',
    posterUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    status: 'coming_soon',
    registrationOpen: true
  },
  {
    id: 'prog-2',
    title: 'Elite Sprint & High-Performance Track Camp',
    description: 'A 2-week intensive conditioning and biomechanics workshop led by state coaches. Ideal for track athletes looking to refine sprint starts, interval pacing, and muscular endurance.',
    date: 'Nov 10, 2026',
    time: '06:00 AM',
    location: 'Main Synthetic Track',
    category: 'Athletic Camp',
    posterUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    status: 'coming_soon',
    registrationOpen: true
  },
  {
    id: 'prog-3',
    title: 'Community 7-a-Side Football Night Cup',
    description: 'Night floodlit tournament under FIFA-grade artificial turf. 16 local club squads competing for the prestigious Universal Rolling Trophy. Food stalls and fan seating available.',
    date: 'Nov 28, 2026',
    time: '06:30 PM',
    location: 'Universal Floodlit Turf Ground',
    category: 'Football Cup',
    posterUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    status: 'coming_soon',
    registrationOpen: true
  }
];

export const defaultEvents = [
  {
    id: 'e-1',
    title: 'Universal Annual Summer Marathon',
    description: 'Join us for our signature athletic event of the year! A 10K / 21K Half-Marathon course running through scenic trail routes in Malappuram. Open to all fitness levels with hydration stations, medical aid, chip timing, and completion medals.',
    date: '2026-07-25',
    time: '06:00 AM',
    location: 'Universal Complex Trailhead',
    category: 'Competitions',
    image: 'https://images.unsplash.com/photo-1526676096777-b65d49bb93c7?auto=format&fit=crop&w=800&q=80',
    price: 'Free for Members (₹150 Guests)',
    registrationsCount: 42
  },
  {
    id: 'e-2',
    title: 'High-Performance Cardio & Conditioning Masterclass',
    description: 'A 3-hour masterclass on optimizing cardiovascular stamina led by our head coach. Includes heart-rate training zones analysis, breathing mechanics, and high-intensity workout design.',
    date: '2026-08-12',
    time: '09:00 AM',
    location: 'Main Gym Hall A',
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    price: 'Free (Members Only)',
    registrationsCount: 28
  },
  {
    id: 'e-3',
    title: 'Mindfulness & Athletic Yoga Sanctuary',
    description: 'Relax, restore, and reset with an evening of deep stretching, pranayama breathing, and guided meditation. Ideal for reducing muscular stiffness and enhancing focus.',
    date: '2026-08-28',
    time: '06:30 PM',
    location: 'Open-Air Zen Deck',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    price: 'Free for Members',
    registrationsCount: 35
  },
  {
    id: 'e-4',
    title: 'Community Charity Volleyball Cup',
    description: 'A friendly community volleyball tournament to support local sports clinics. Squads of six competing in round-robin and knockout formats. Refreshments and evening BBQ provided.',
    date: '2026-09-05',
    time: '08:30 AM',
    location: 'Universal Sand Courts',
    category: 'Community Activities',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    price: 'Free Entry',
    registrationsCount: 16
  }
];

export const defaultGallery = [
  {
    id: 'g-1',
    title: 'Olympic Weightlifting & Strength Zone',
    category: 'Facilities',
    description: 'High-end Eleiko barbells, rubber bumper plates, and reinforced lifting platforms.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-2',
    title: 'Kerala State Athletic Relay Champions',
    category: 'Sports',
    description: 'Our under-19 sprint squad receiving gold at the regional sports summit.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-3',
    title: 'Evening Badminton League Finals',
    category: 'Events',
    description: 'Packed spectator stands during the men’s doubles championship game.',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-4',
    title: 'Universal Youth Summer Sports Camp',
    category: 'Community',
    description: 'Over 80 youngsters participating in multi-sport skills drills.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-5',
    title: 'All-Weather Floodlit Football Turf',
    category: 'Facilities',
    description: 'Night football tournament matches under high-lumen LED illumination.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-6',
    title: 'Community Yoga & Wellness Session',
    category: 'Training',
    description: 'Weekend morning group restorative yoga led by certified instructors.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  }
];

export const defaultTeam = [
  {
    id: 't-1',
    name: 'Nicholas Vance',
    position: 'President',
    bio: 'Former competitive decathlete with over 15 years in sports governance. Dedicated to expanding grassroots athletics and youth infrastructure.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    email: 'president@universalclub.com'
  },
  {
    id: 't-2',
    name: 'Elena Rostova',
    position: 'General Secretary',
    bio: 'Oversees membership registrations, inter-club compliance, and state council liaison. Passionate about community engagement.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'secretary@universalclub.com'
  },
  {
    id: 't-3',
    name: 'Sophia Martinez',
    position: 'Head Coach & Athletic Director',
    bio: 'National sprint medalist. Specializes in youth track development, conditioning periodization, and athletic psychology.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'coach@universalclub.com'
  },
  {
    id: 't-4',
    name: 'Marcus Sterling',
    position: 'Treasurer & Facility Coordinator',
    bio: 'Chartered accountant with a passion for badminton and sports facility maintenance. Ensures transparent club accounting.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    email: 'treasurer@universalclub.com'
  }
];

export const defaultNews = [
  {
    id: 'n-1',
    title: 'Universal Club Unveils Upgraded Olympic Fitness Zone',
    content: 'We are thrilled to announce complete renovation of our main conditioning wing, featuring new Eleiko platforms, cardiovascular monitors, and dedicated stretching bays. Open to all active members.',
    date: '2026-06-12',
    category: 'Announcement',
    author: 'President Vance',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-2',
    title: 'Universal Junior Track Relay Team Claims Gold',
    content: 'Congratulations to our Under-18 track relay squad who dominated the District Athletic Championships, securing Gold in the 4x100m sprint. Coach Sophia commended their hard work.',
    date: '2026-06-05',
    category: 'Achievement',
    author: 'Coach Martinez',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'n-3',
    title: 'Universal Club Web Portal & Companion App Rolled Out',
    content: 'Members can now easily register for club programs, track upcoming tournaments, view their official Digital Membership ID Card, and explore our photo gallery online.',
    date: '2026-06-15',
    category: 'Club Update',
    author: 'Secretary Rostova',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80'
  }
];

export const defaultServices = [
  {
    id: 's-1',
    title: 'Strength & Conditioning Complex',
    category: 'Gym & Fitness',
    description: 'Fully equipped fitness arena with Olympic bars, plate-loaded machinery, free weights, and cardio stations.',
    icon: 'dumbbell',
    features: ['High-performance free weights', 'Treadmills, rowers & assault bikes', 'Certified trainers on floor', 'Locker & shower facilities']
  },
  {
    id: 's-2',
    title: 'Indoor Badminton & Synthetic Courts',
    category: 'Racquet Sports',
    description: 'Four championship-standard synthetic badminton courts with anti-glare high bay LED illumination.',
    icon: 'badminton',
    features: ['BWF-approved court flooring', 'Court booking system', 'Professional coaching sessions', 'Equipment rental & restringing']
  },
  {
    id: 's-3',
    title: 'Floodlit Artificial Turf Arena',
    category: 'Football & Cricket',
    description: '7-a-side FIFA standard artificial turf ground ideal for evening football leagues and box cricket games.',
    icon: 'football',
    features: ['All-weather artificial grass', 'High-mast LED floodlights', 'Spectator seating & team dugout', 'Organized weekend tournaments']
  },
  {
    id: 's-4',
    title: 'Youth Athletic Development Academy',
    category: 'Training',
    description: 'Specialized physical training for aspiring athletes aged 8–18, focusing on speed, agility, and sportsmanship.',
    icon: 'trophy',
    features: ['Certified athletics coaches', 'Quarterly fitness assessments', 'Dietary guidance for athletes', 'State tournament preparation']
  }
];

export const initialMembers = [
  {
    id: 'mem_001',
    documentId: 'mem_001',
    userId: null,
    name: 'Alexander Wright',
    fullName: 'Alexander Wright',
    email: 'alex.wright@universalclub.com',
    phone: '9847011223',
    mobile: '9847011223',
    dateOfBirth: '1994-05-12',
    gender: 'Male',
    bloodGroup: 'O+',
    address: 'Green Valley, Malappuram',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authProvider: 'manual',
    source: 'old_record',
    status: 'approved',
    membershipId: 'CLUB-000001',
    membershipNumber: 'CLUB-000001',
    membershipType: '1 Year Membership',
    joiningDate: '2025-06-01T00:00:00.000Z',
    expiryDate: '2027-06-01T00:00:00.000Z',
    appliedAt: '2025-05-28T00:00:00.000Z',
    approvedAt: '2025-06-01T00:00:00.000Z',
    approvedBy: 'Admin'
  },
  {
    id: 'mem_002',
    documentId: 'mem_002',
    userId: null,
    name: 'Sophia Martinez',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@universalclub.com',
    phone: '9847044556',
    mobile: '9847044556',
    dateOfBirth: '1991-08-20',
    gender: 'Female',
    bloodGroup: 'A+',
    address: 'Palm Grove, Manjeri, Malappuram',
    photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    authProvider: 'manual',
    source: 'old_record',
    status: 'approved',
    membershipId: 'CLUB-000002',
    membershipNumber: 'CLUB-000002',
    membershipType: '1 Year Membership',
    joiningDate: '2025-08-15T00:00:00.000Z',
    expiryDate: '2027-08-15T00:00:00.000Z',
    appliedAt: '2025-08-10T00:00:00.000Z',
    approvedAt: '2025-08-15T00:00:00.000Z',
    approvedBy: 'Admin'
  }
];

export const initialRequests = [
  {
    id: 'req_001',
    documentId: 'req_001',
    userId: null,
    name: 'Rahul Krishnan',
    fullName: 'Rahul Krishnan',
    email: 'rahul.krishnan@gmail.com',
    phone: '9847098765',
    mobile: '9847098765',
    dateOfBirth: '1998-11-24',
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Sunrise Villa, Kottakkal, Malappuram',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authProvider: 'google',
    source: 'new_application',
    status: 'pending',
    membershipType: '1 Year Membership',
    appliedAt: '2026-06-14T10:30:00.000Z'
  }
];
