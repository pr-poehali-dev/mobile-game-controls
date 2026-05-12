export type Screen = "menu" | "new-game" | "continue" | "settings" | "game";

export interface SavedGame {
  id: number;
  name: string;
  date: string;
  level: number;
}

export const BG_IMAGE =
  "https://cdn.poehali.dev/projects/7f9fee17-8fa0-4679-83bb-c0f3e5f47700/bucket/fdd55b8a-2534-4359-b753-a3abfacd02ac.png";

export const INITIAL_SAVES: SavedGame[] = [
  { id: 1, name: "Первое Приключение", date: "10.05.2026", level: 7 },
  { id: 2, name: "Тёмное Подземелье",  date: "09.05.2026", level: 3 },
  { id: 3, name: "Битва с Драконом",   date: "07.05.2026", level: 12 },
];

export const MENU_ITEMS: { id: Screen; label: string; danger: boolean }[] = [
  { id: "new-game", label: "Новая Игра", danger: false },
  { id: "continue", label: "Продолжить", danger: false },
  { id: "settings", label: "Настройки",  danger: false },
  { id: "exit",     label: "Покинуть",   danger: true  },
];