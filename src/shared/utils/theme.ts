export type ColorThemeId = 'amber' | 'classic' | 'emerald' | 'sapphire' | 'burgundy' | 'teal';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  tag: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'amber',
    name: 'TDP Warm Amber',
    tag: 'Portal Government Theme',
    primaryColor: '#ea580c',
    secondaryColor: '#f97316',
    accentColor: '#c2410c',
    description: 'Vibrant government portal warm amber orange theme',
  },
  {
    id: 'classic',
    name: 'Classic Mahogany',
    tag: 'Heritage Library',
    primaryColor: '#4a3728',
    secondaryColor: '#8b6914',
    accentColor: '#2e5d3c',
    description: 'Traditional wood and parchment tones with gold accents',
  },
  {
    id: 'emerald',
    name: 'Royal Emerald',
    tag: 'Forest & Environment',
    primaryColor: '#1b4332',
    secondaryColor: '#2d6a4f',
    accentColor: '#40916c',
    description: 'Deep governance green with nature-inspired forest hues',
  },
  {
    id: 'sapphire',
    name: 'Policy Sapphire',
    tag: 'Governance & Analytics',
    primaryColor: '#1e3a8a',
    secondaryColor: '#2563eb',
    accentColor: '#0284c7',
    description: 'State policy administrative navy and sapphire tones',
  },
  {
    id: 'burgundy',
    name: 'Imperial Burgundy',
    tag: 'Archives & Monograph',
    primaryColor: '#581845',
    secondaryColor: '#900c3f',
    accentColor: '#c70039',
    description: 'Prestigious archival wine and rich crimson monograph style',
  },
  {
    id: 'teal',
    name: 'Digital Slate Teal',
    tag: 'Modern Knowledge',
    primaryColor: '#0f4c5c',
    secondaryColor: '#0d9488',
    accentColor: '#14b8a6',
    description: 'Contemporary knowledge management and digital innovation',
  },
];

const THEME_STORAGE_KEY = 'app-color-theme';

export function getActiveTheme(): ColorThemeId {
  if (typeof window === 'undefined') return 'classic';
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ColorThemeId | null;
  if (saved && COLOR_THEMES.some(t => t.id === saved)) {
    return saved;
  }
  return 'classic';
}

export function setActiveTheme(themeId: ColorThemeId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, themeId);
  document.body.setAttribute('data-theme', themeId);
  // Dispatch custom event so any listener updates automatically
  window.dispatchEvent(new CustomEvent('app-theme-changed', { detail: themeId }));
}

export function initializeTheme(): ColorThemeId {
  const theme = getActiveTheme();
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', theme);
  }
  return theme;
}
