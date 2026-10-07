// Club content shown on the public site.
// Everything here is taken from the club's own public pages (checked 7 Oct 2026):
//   Facebook  — https://www.facebook.com/UniversalVelluruniversalclubvellur
//   Instagram — https://www.instagram.com/universal_arts_sports_club/
// Fields set to null are not published anywhere yet; pages hide them until the club fills them in.
// Photos, posters and videos are added from the Admin panel (slides, programs, gallery).

export const clubInfo = {
  name: 'Universal Arts & Sports Club Vellur',
  shortName: 'Universal Vellur',
  // Instagram bio, translated: "വെള്ളൂരിലെ യുവതലമുറയുടെ പ്രചോദനം · കലാകായിക രംഗത്തെ നിറസാന്നിധ്യം"
  tagline: "The inspiration of Vellur's young generation — a constant presence in arts and sports.",
  taglineMl: 'വെള്ളൂരിലെ യുവതലമുറയുടെ പ്രചോദനം · കലാകായിക രംഗത്തെ നിറസാന്നിധ്യം',
  location: 'Vellur, Kerala',
  address: 'Universal Arts & Sports Club, Vellur, Kerala',
  socials: {
    instagram: 'https://www.instagram.com/universal_arts_sports_club/',
    instagramHandle: '@universal_arts_sports_club',
    facebook: 'https://www.facebook.com/UniversalVelluruniversalclubvellur',
  },
  instagramFollowers: '3,000+',
  // Not published on the club's pages yet
  registrationNumber: null,
  affiliation: null,
  establishedYear: null,
  phone: null,
  email: null,
  openingHours: null,
  // Confirmed by the club
  membershipFee: '₹200 / year',
  annualFee: 200,
};

// Hero slides are managed from Admin → Slides (no seeded dummy slides).

// Upcoming programs are created from Admin → Programs.
export const defaultPrograms = [];

export const defaultEvents = [
  {
    id: 'onam-2k26',
    title: 'Universalonam — Onam 2K26',
    description:
      "The club's Onam celebration for Vellur. Games for everyone: filling water in a bottle, uriyadi, vadamvali (tug of war), duck catching, balloon walk, shoot-out, brick control and cup relay. " +
      'Special contests for kids: slow cycle race, balloon walk, lemon & spoon, pin-the-pottu, book balancing, musical chairs and cup relay.',
    date: '2026-08-30',
    time: 'Sunday',
    location: 'Vellur',
    category: 'Celebrations',
    image: '',
    price: 'Open to all',
  },
  {
    id: 'ente-vellur-2026',
    title: 'Ente Vellur, Sundara Vellur — Clean-up Mission',
    description:
      'Club members and the children of Vellur came out in safety vests and gloves to clean the roads and lanes of the village. "The mission starts ❤️ എന്റെ വെള്ളൂർ സുന്ദര വെള്ളൂർ."',
    date: '2026-08-17',
    time: '',
    location: 'Vellur',
    category: 'Community Service',
    image: '',
    price: 'Volunteers welcome',
  },
];

// Gallery photos are uploaded from Admin → Gallery.
export const defaultGallery = [];

// Committee members are not listed on the club's public pages yet.
export const defaultTeam = [];

export const defaultNews = [
  {
    id: 'samad-sl-kerala',
    title: 'Abdul Samad P.P. to play for Thrissur Magic FC in Super League Kerala',
    content:
      "A proud moment for Vellur — our own Abdul Samad P.P. will represent Thrissur Magic FC in the Super League Kerala. Congratulations from everyone at Universal!",
    date: '2026-09-19',
    category: 'Football',
    author: 'Universal Arts & Sports Club',
    image: '',
  },
  {
    id: 'danish-wako-gold',
    title: 'Gold for Muhammed Danish P.P. at the WAKO Kerala State Kickboxing Championship',
    content:
      'Muhammed Danish P.P. won the gold medal in the senior full-contact 51 kg category at the WAKO Kerala State Kickboxing Championship 2026, held at the IPM Academy indoor stadium, Vadakara.',
    date: '2026-08-26',
    category: 'Achievement',
    author: 'Universal Arts & Sports Club',
    image: '',
  },
  {
    id: 'ente-vellur-mission',
    title: 'The mission starts: Ente Vellur, Sundara Vellur',
    content:
      'Members and kids from the village teamed up for a clean-up drive across Vellur — the start of a mission to keep our village beautiful.',
    date: '2026-08-17',
    category: 'Community',
    author: 'Universal Arts & Sports Club',
    image: '',
  },
];

// What the club does — taken from its posts and Instagram highlights (no facility claims).
export const defaultServices = [
  {
    id: 'football',
    title: 'Football',
    category: 'Sports',
    description:
      'Football is at the heart of the club — and Vellur talent is going places, with Abdul Samad P.P. now playing in the Super League Kerala.',
    icon: 'football',
    features: ['Local matches & tournaments', 'Backing young players from Vellur'],
  },
  {
    id: 'cricket',
    title: 'Cricket',
    category: 'Sports',
    description: 'Cricket matches with the youngsters of Vellur.',
    icon: 'cricket',
    features: ['Friendly matches', 'Open to young players'],
  },
  {
    id: 'arts',
    title: 'Arts & Celebrations',
    category: 'Arts',
    description:
      'Onam celebrations every year (Onam 2K20, 2K23, Universalonam 2K26), colouring competitions for children and cultural programmes like AvaaZ.',
    icon: 'arts',
    features: ['Onam games for all ages', 'Competitions for kids', 'Cultural programmes'],
  },
  {
    id: 'community',
    title: 'Community Service',
    category: 'Community',
    description:
      'Environment Day activities, flag hoisting at the clubhouse and the “Ente Vellur, Sundara Vellur” clean-up mission.',
    icon: 'community',
    features: ['Clean-up drives', 'Environment Day', 'Flag hoisting'],
  },
];
