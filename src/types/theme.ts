export interface AppTheme {
  id: string;
  name: string;
  isCustom?: boolean;
  background: string;       // Page background
  surface: string;          // Sidebar / Header background
  cardBg: string;           // Flashcard & Control background
  border: string;           // Border strokes
  foreground: string;       // Primary text
  foregroundMuted: string;  // Secondary text
  accent: string;           // Brand accent color
  accentHover: string;      // Accent hover color
  accentText: string;       // Text color on top of accent
  folderIconColor?: string; // Folder symbol color in tree & UI
  cardIconColor?: string;   // Flashcard symbol color in tree & UI
  scrollbarThumb: string;   // Scrollbar thumb color
  scrollbarTrack: string;   // Scrollbar track color
}
