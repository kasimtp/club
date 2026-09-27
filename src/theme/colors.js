// Design System: Color Palette & Semantic Tokens
// Sourced directly from CLUB_APP_REFERENCE.md

export const palette = {
  black: '#0A0A0B',
  ink: '#121214',
  slate800: '#2B2B30',
  slate600: '#5C5C66',
  slate500: '#8A8A94',
  slate400: '#A8A8B0',
  slate300: '#D6D6DC',
  slate200: '#E9E9ED',
  slate100: '#F2F2F4',
  slate50: '#F8F8F9',
  white: '#FFFFFF',
};

export const accents = {
  amber: { fg: '#F5B92B', bg: '#FFF6E0', name: 'Amber' },
  sky: { fg: '#1FA2F0', bg: '#E6F4FE', name: 'Sky' },
  mint: { fg: '#33D19B', bg: '#E3F9F0', name: 'Mint' },
  coral: { fg: '#FF5B4C', bg: '#FFECEA', name: 'Coral' },
  violet: { fg: '#8B5CF6', bg: '#F1EBFE', name: 'Violet' },
  rose: { fg: '#FF7A9C', bg: '#FFF0F4', name: 'Rose' },
};

export const semanticColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F2F4',
  surfaceSunken: '#F8F8F9',
  overlay: 'rgba(10, 10, 11, 0.65)',
  
  text: '#121214',
  textMuted: '#5C5C66',
  textSubtle: '#8A8A94',
  textDisabled: '#A8A8B0',
  textInverse: '#FFFFFF',
  
  border: '#E9E9ED',
  borderStrong: '#D6D6DC',
  
  success: '#0FA968',
  successSoft: '#E3F9F0',
  warning: '#D98A00',
  warningSoft: '#FFF6E0',
  danger: '#E5341F',
  dangerSoft: '#FFECEA',
  info: '#1FA2F0',
  infoSoft: '#E6F4FE',

  // Digital ID Card dark theme
  idCard: {
    bg: '#0F172A',
    border: '#1E293B',
    banner: 'rgba(255, 255, 255, 0.06)',
    gold: '#F5B92B',
    accent: '#38BDF8',
  }
};

const ACCENT_CYCLE = [
  accents.amber,
  accents.sky,
  accents.mint,
  accents.violet,
  accents.coral,
];

/**
 * Deterministic category color cycling (accentFor)
 * Cycles through 5 stops based on string hash
 */
export function accentFor(key) {
  if (!key) return accents.sky;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % ACCENT_CYCLE.length;
  return ACCENT_CYCLE[index];
}
