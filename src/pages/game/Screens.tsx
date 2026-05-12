import React, { useRef } from "react";
import { Screen, SavedGame, MENU_ITEMS } from "./types";
import { GhostBtn } from "./ui";

/* ── Заголовок KINGS (общий для всех экранов кроме главного) ── */
const ScreenTitle = ({ mb = "20px" }: { mb?: string }) => (
  <h2 className="gold-glow" style={{
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: "clamp(22px, 6vw, 34px)",
    fontWeight: 700,
    color: "var(--f-gold)",
    margin: `0 0 ${mb}`,
    letterSpacing: "0.1em",
    textShadow: "0 0 24px rgba(212,168,67,0.6), 0 3px 12px rgba(0,0,0,0.9)",
  }}>
    KINGS
  </h2>
);

/* ════════════════════════════════
   ГЛАВНОЕ МЕНЮ
════════════════════════════════ */
export const MainMenu = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => (
  <div className="screen-in" style={{
    width: "min(340px, 88vw)",
    display: "flex", flexDirection: "column",
    alignItems: "center",
    position: "relative", zIndex: 10,
  }}>
    <h1 className="gold-glow" style={{
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: "clamp(42px, 12vw, 68px)",
      fontWeight: 900,
      color: "var(--f-gold)",
      margin: "0 0 6px",
      lineHeight: 1,
      letterSpacing: "0.12em",
      textShadow: "0 0 30px rgba(212,168,67,0.7), 0 4px 16px rgba(0,0,0,0.9)",
    }}>
      KINGS
    </h1>

    <div style={{
      width: "100%", height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.5), transparent)",
      margin: "18px 0 8px",
    }} />

    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
      {MENU_ITEMS.map((item) => (
        <GhostBtn key={item.id} danger={item.danger} center onClick={() => onNavigate(item.id)}>
          {item.label}
        </GhostBtn>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════
   НОВАЯ ИГРА
════════════════════════════════ */
export const NewGame = ({
  gameName,
  onChangeName,
  onStart,
  onBack,
}: {
  gameName: string;
  onChangeName: (v: string) => void;
  onStart: () => void;
  onBack: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  return (
    <div className="screen-in" style={{
      width: "min(340px, 88vw)",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: "4px",
      position: "relative", zIndex: 10,
    }}>
      <ScreenTitle />

      <input
        ref={inputRef}
        className="f-input"
        type="text"
        maxLength={24}
        value={gameName}
        onChange={e => onChangeName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onStart()}
        placeholder="Название партии..."
      />

      <GhostBtn center onClick={onStart} disabled={!gameName.trim()}>
        Начать Поход
      </GhostBtn>

      <GhostBtn center small onClick={onBack}>
        ← Назад
      </GhostBtn>
    </div>
  );
};

/* ════════════════════════════════
   ПРОДОЛЖИТЬ
════════════════════════════════ */
export const ContinueGame = ({
  saves,
  deleteId,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
  onBack,
}: {
  saves: SavedGame[];
  deleteId: number | null;
  onDelete: (id: number) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: number) => void;
  onBack: () => void;
}) => (
  <div className="screen-in" style={{
    width: "min(340px, 88vw)",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "2px",
    position: "relative", zIndex: 10,
    maxHeight: "88dvh",
  }}>
    <ScreenTitle mb="16px" />

    <div style={{
      width: "100%", overflowY: "auto", maxHeight: "56dvh",
      display: "flex", flexDirection: "column",
    }}>
      {saves.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "24px 0",
          color: "rgba(240,220,170,0.45)",
          fontFamily: "'IM Fell English', serif",
          fontStyle: "italic", fontSize: "14px",
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        }}>Нет сохранений</div>
      ) : saves.map((save) => (
        <div key={save.id} style={{ borderBottom: "1px solid rgba(212,168,67,0.12)", padding: "12px 0" }}>
          {deleteId === save.id ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{
                fontFamily: "'IM Fell English', serif",
                fontStyle: "italic", fontSize: "13px",
                color: "rgba(240,200,140,0.75)",
                textShadow: "0 1px 6px rgba(0,0,0,0.9)",
              }}>
                Удалить «{save.name}»?
              </span>
              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={() => onConfirmDelete(save.id)}
                  style={{
                    background: "none", border: "none", outline: "none",
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "rgba(220,90,75,0.9)",
                    textShadow: "0 0 12px rgba(220,80,60,0.5), 0 1px 6px rgba(0,0,0,0.9)",
                    padding: "4px 0",
                    transition: "color 0.15s",
                  }}
                >
                  Удалить
                </button>
                <button
                  onClick={onCancelDelete}
                  style={{
                    background: "none", border: "none", outline: "none",
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "rgba(240,220,170,0.55)",
                    textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                    padding: "4px 0",
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(13px, 3.4vw, 16px)",
                    fontWeight: 600,
                    color: "rgba(240,220,170,0.92)",
                    letterSpacing: "0.08em",
                    textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                  }}>
                    {save.name}
                  </span>
                  <span style={{
                    fontSize: "10px",
                    color: "rgba(212,168,67,0.7)",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.06em",
                    textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                  }}>
                    Этаж {Math.min(Math.max(save.level, 1), 15)}
                  </span>
                </div>
                <div style={{
                  fontSize: "10px",
                  color: "rgba(200,180,130,0.45)",
                  fontFamily: "'IM Fell English', serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}>
                  {save.date}
                </div>
              </div>
              <button
                onClick={() => onDelete(save.id)}
                style={{
                  background: "none", border: "none", outline: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "rgba(220,90,75,0.4)",
                  lineHeight: 1,
                  padding: "4px 6px",
                  transition: "color 0.15s, transform 0.12s",
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "rgba(255,100,80,0.9)";
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(220,90,75,0.4)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ))}
    </div>

    <GhostBtn center small onClick={onBack}>
      ← Назад
    </GhostBtn>
  </div>
);

/* ════════════════════════════════
   НАСТРОЙКИ
════════════════════════════════ */
const SOUND_TRACKS = [
  { key: "effects" as const, label: "Эффекты", color: "rgba(240,200,100,0.9)" },
  { key: "music"   as const, label: "Музыка",  color: "rgba(110,180,220,0.9)" },
  { key: "voices"  as const, label: "Голоса",  color: "rgba(140,220,140,0.9)" },
] as const;

export const Settings = ({
  volumes,
  onChangeVolume,
  onBack,
}: {
  volumes: { effects: number; music: number; voices: number };
  onChangeVolume: (key: "effects" | "music" | "voices", value: number) => void;
  onBack: () => void;
}) => (
  <div className="screen-in" style={{
    width: "min(340px, 88vw)",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "6px",
    position: "relative", zIndex: 10,
  }}>
    <ScreenTitle />

    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "22px" }}>
      {SOUND_TRACKS.map(({ key, label, color }) => (
        <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(10px, 2.6vw, 13px)",
              fontWeight: 600,
              color, letterSpacing: "0.12em",
              textShadow: "0 1px 8px rgba(0,0,0,0.9)",
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "11px", color,
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            }}>
              {volumes[key]}%
            </span>
          </div>
          <input
            type="range"
            min={0} max={100}
            value={volumes[key]}
            onChange={e => onChangeVolume(key, Number(e.target.value))}
            className="f-slider"
            style={{ "--val": `${volumes[key]}%` } as React.CSSProperties}
          />
        </div>
      ))}
    </div>

    <GhostBtn center small onClick={onBack}>
      ← Назад
    </GhostBtn>
  </div>
);
