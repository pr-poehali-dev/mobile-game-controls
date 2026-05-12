import { useState, useEffect, useRef } from "react";

type Screen = "menu" | "new-game" | "continue" | "settings";

interface SavedGame {
  id: number;
  name: string;
  date: string;
  level: number;
}

const BG_IMAGE = "https://cdn.poehali.dev/projects/7f9fee17-8fa0-4679-83bb-c0f3e5f47700/files/cad7c503-ee90-423a-b91f-2a9dcfa8025b.jpg";

const INITIAL_SAVES: SavedGame[] = [
  { id: 1, name: "Первое Приключение", date: "10.05.2026", level: 7 },
  { id: 2, name: "Тёмное Подземелье",  date: "09.05.2026", level: 3 },
  { id: 3, name: "Битва с Драконом",   date: "07.05.2026", level: 12 },
];

const MENU_ITEMS = [
  { id: "new-game" as Screen, label: "Новая Игра", danger: false },
  { id: "continue" as Screen, label: "Продолжить", danger: false },
  { id: "settings" as Screen, label: "Настройки",  danger: false },
  { id: "exit"     as Screen, label: "Покинуть",   danger: true  },
];

const ProgressBar = ({ value }: { value: number }) => (
  <div style={{
    width: "100%", height: "2px",
    background: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  }}>
    <div style={{
      height: "100%", width: `${value}%`,
      background: "linear-gradient(90deg, var(--f-gold-dim), var(--f-gold))",
      transition: "width 0.4s ease-out",
    }} />
  </div>
);

/* Чистая кнопка-текст без рамки */
const GhostBtn = ({
  children,
  onClick,
  danger,
  center,
  disabled,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  center?: boolean;
  disabled?: boolean;
  small?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: "none",
      border: "none",
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'Cinzel', serif",
      fontSize: small ? "clamp(11px, 2.8vw, 13px)" : "clamp(14px, 3.6vw, 18px)",
      fontWeight: 600,
      letterSpacing: "0.18em",
      color: danger
        ? "rgba(220,90,75,0.85)"
        : "rgba(240,220,170,0.88)",
      padding: "14px 0",
      width: "100%",
      textAlign: center ? "center" : "left",
      opacity: disabled ? 0.35 : 1,
      transition: "color 0.15s, transform 0.12s, text-shadow 0.15s",
      textShadow: "0 1px 8px rgba(0,0,0,0.8)",
      display: "block",
    }}
    onMouseEnter={e => {
      if (disabled) return;
      const el = e.currentTarget;
      el.style.color = danger ? "rgba(255,120,100,1)" : "rgba(255,230,140,1)";
      el.style.transform = "translateX(6px)";
      el.style.textShadow = danger
        ? "0 0 18px rgba(220,80,60,0.6), 0 1px 8px rgba(0,0,0,0.9)"
        : "0 0 20px rgba(212,168,67,0.7), 0 1px 8px rgba(0,0,0,0.9)";
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.color = danger ? "rgba(220,90,75,0.85)" : "rgba(240,220,170,0.88)";
      el.style.transform = "translateX(0)";
      el.style.textShadow = "0 1px 8px rgba(0,0,0,0.8)";
    }}
  >
    {children}
  </button>
);

export default function Index() {
  const [screen, setScreen]     = useState<Screen>("menu");
  const [gameName, setGameName] = useState("");
  const [saves, setSaves]       = useState<SavedGame[]>(INITIAL_SAVES);
  const [volumes, setVolumes]   = useState({ effects: 70, music: 50, voices: 80 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (screen === "new-game") setTimeout(() => inputRef.current?.focus(), 120);
  }, [screen]);

  const goTo = (s: Screen) => {
    if (s === "exit") { window.close(); return; }
    setScreen(s);
  };

  const startNewGame = () => {
    if (!gameName.trim()) return;
    setSaves(prev => [{
      id: Date.now(),
      name: gameName.trim(),
      date: new Date().toLocaleDateString("ru-RU"),
      level: 1,
    }, ...prev]);
    setGameName("");
    setScreen("menu");
  };

  return (
    <div style={{
      width: "100dvw", height: "100dvh",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>

      {/* Фон — яркий пейзаж */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        filter: "saturate(1.25) brightness(1.08)",
      }} />

      {/* Только верхушка — тёмная (башня уходит в тучи) */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(4,2,12,0.72) 0%, rgba(8,4,20,0.35) 18%, transparent 35%)",
      }} />

      {/* Лёгкое затемнение по краям для фокуса */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 80% at center, transparent 55%, rgba(0,0,0,0.38) 100%)",
      }} />

      {/* Очень лёгкая подложка снизу под меню */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 40%)",
      }} />

      {/* Версия */}
      <div style={{
        position: "absolute", bottom: "14px", right: "16px",
        fontFamily: "'Cinzel', serif",
        fontSize: "10px",
        letterSpacing: "0.12em",
        color: "rgba(212,168,67,0.45)",
        textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        pointerEvents: "none",
        zIndex: 20,
      }}>
        beta 1
      </div>

      {/* ════ MAIN MENU ════ */}
      {screen === "menu" && (
        <div className="screen-in" style={{
          width: "min(340px, 88vw)",
          display: "flex", flexDirection: "column",
          alignItems: "center",
          position: "relative", zIndex: 10,
        }}>
          {/* Заголовок KINGS */}
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

          {/* Разделитель */}
          <div style={{
            width: "100%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.5), transparent)",
            margin: "18px 0 8px",
          }} />

          {/* Кнопки меню */}
          <div style={{
            display: "flex", flexDirection: "column",
            width: "100%", alignItems: "center",
          }}>
            {MENU_ITEMS.map((item) => (
              <GhostBtn
                key={item.id}
                danger={item.danger}
                center
                onClick={() => goTo(item.id)}
              >
                {item.label}
              </GhostBtn>
            ))}
          </div>
        </div>
      )}

      {/* ════ NEW GAME ════ */}
      {screen === "new-game" && (
        <div className="screen-in" style={{
          width: "min(340px, 88vw)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "4px",
          position: "relative", zIndex: 10,
        }}>
          <h2 className="gold-glow" style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(22px, 6vw, 34px)",
            fontWeight: 700,
            color: "var(--f-gold)", margin: "0 0 20px",
            letterSpacing: "0.1em",
            textShadow: "0 0 24px rgba(212,168,67,0.6), 0 3px 12px rgba(0,0,0,0.9)",
          }}>
            KINGS
          </h2>

          <input
            ref={inputRef}
            className="f-input"
            type="text"
            maxLength={24}
            value={gameName}
            onChange={e => setGameName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && startNewGame()}
            placeholder="Название партии..."
          />

          <GhostBtn center onClick={startNewGame} disabled={!gameName.trim()}>
            Начать Поход
          </GhostBtn>

          <GhostBtn center small onClick={() => setScreen("menu")}>
            ← Назад
          </GhostBtn>
        </div>
      )}

      {/* ════ CONTINUE ════ */}
      {screen === "continue" && (
        <div className="screen-in" style={{
          width: "min(340px, 88vw)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "2px",
          position: "relative", zIndex: 10,
          maxHeight: "88dvh",
        }}>
          <h2 className="gold-glow" style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(22px, 6vw, 34px)",
            fontWeight: 700,
            color: "var(--f-gold)", margin: "0 0 16px",
            letterSpacing: "0.1em",
            textShadow: "0 0 24px rgba(212,168,67,0.6), 0 3px 12px rgba(0,0,0,0.9)",
          }}>
            KINGS
          </h2>

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
              <button
                key={save.id}
                style={{
                  background: "none", border: "none", outline: "none",
                  cursor: "pointer", padding: "12px 0",
                  textAlign: "left", width: "100%",
                  display: "flex", flexDirection: "column", gap: "6px",
                  borderBottom: "1px solid rgba(212,168,67,0.12)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
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
                    color: "rgba(212,168,67,0.6)",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.06em",
                    textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                  }}>
                    LVL {save.level}
                  </span>
                </div>
                <ProgressBar value={Math.min(save.level * 8, 100)} />
                <div style={{
                  fontSize: "10px",
                  color: "rgba(200,180,130,0.45)",
                  fontFamily: "'IM Fell English', serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}>
                  {save.date}
                </div>
              </button>
            ))}
          </div>

          <GhostBtn center small onClick={() => setScreen("menu")}>
            ← Назад
          </GhostBtn>
        </div>
      )}

      {/* ════ SETTINGS ════ */}
      {screen === "settings" && (
        <div className="screen-in" style={{
          width: "min(340px, 88vw)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "6px",
          position: "relative", zIndex: 10,
        }}>
          <h2 className="gold-glow" style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(22px, 6vw, 34px)",
            fontWeight: 700,
            color: "var(--f-gold)", margin: "0 0 20px",
            letterSpacing: "0.1em",
            textShadow: "0 0 24px rgba(212,168,67,0.6), 0 3px 12px rgba(0,0,0,0.9)",
          }}>
            KINGS
          </h2>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "22px" }}>
            {([
              { key: "effects" as const, label: "Эффекты",  color: "rgba(240,200,100,0.9)" },
              { key: "music"   as const, label: "Музыка",   color: "rgba(110,180,220,0.9)" },
              { key: "voices"  as const, label: "Голоса",   color: "rgba(140,220,140,0.9)" },
            ] as const).map(({ key, label, color }) => (
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
                  onChange={e => setVolumes(v => ({ ...v, [key]: Number(e.target.value) }))}
                  className="f-slider"
                  style={{ "--val": `${volumes[key]}%` } as React.CSSProperties}
                />
              </div>
            ))}
          </div>

          <GhostBtn center small onClick={() => setScreen("menu")}>
            ← Назад
          </GhostBtn>
        </div>
      )}
    </div>
  );
}