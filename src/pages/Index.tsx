import { useState, useEffect, useRef } from "react";

type Screen = "menu" | "new-game" | "continue" | "settings";

interface SavedGame {
  id: number;
  name: string;
  date: string;
  level: number;
}

const BG_IMAGE = "https://cdn.poehali.dev/projects/7f9fee17-8fa0-4679-83bb-c0f3e5f47700/files/1e13379e-5496-43ef-95cb-aa2051a17f82.jpg";

const INITIAL_SAVES: SavedGame[] = [
  { id: 1, name: "Первое Приключение", date: "10.05.2026", level: 7 },
  { id: 2, name: "Тёмное Подземелье",  date: "09.05.2026", level: 3 },
  { id: 3, name: "Битва с Драконом",   date: "07.05.2026", level: 12 },
];

const MENU_ITEMS = [
  { id: "new-game" as Screen, label: "Новая Игра", icon: "⚔", danger: false },
  { id: "continue" as Screen, label: "Продолжить", icon: "📜", danger: false },
  { id: "settings" as Screen, label: "Настройки",  icon: "⚙", danger: false },
  { id: "exit"     as Screen, label: "Покинуть",   icon: "🚪", danger: true  },
];

const FloatingRunes = () => {
  const runes = ["ᚱ","ᚢ","ᚾ","ᛖ","ᛊ","ᚦ","ᚨ","ᛏ","ᛁ","ᛚ","ᛗ","ᛞ"];
  return (
    <>
      {runes.map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 41 + 5) % 92}%`,
          top:  `${(i * 67 + 8) % 85}%`,
          color: "var(--f-gold)",
          fontSize: `${14 + (i % 4) * 6}px`,
          opacity: 0.07,
          animation: `floatRune ${3 + (i % 4)}s ease-in-out ${i * 0.5}s infinite`,
          pointerEvents: "none",
          userSelect: "none",
          fontFamily: "serif",
        }}>{r}</div>
      ))}
    </>
  );
};

const ProgressBar = ({ value }: { value: number }) => (
  <div style={{
    width: "100%", height: "3px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "2px", overflow: "hidden",
  }}>
    <div style={{
      height: "100%", width: `${value}%`,
      background: "linear-gradient(90deg, var(--f-gold-dim), var(--f-gold))",
      borderRadius: "2px",
      transition: "width 0.4s ease-out",
    }} />
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="f-divider" style={{ fontSize: "9px", letterSpacing: "4px" }}>
    {children}
  </div>
);

export default function Index() {
  const [screen, setScreen]         = useState<Screen>("menu");
  const [gameName, setGameName]     = useState("");
  const [saves, setSaves]           = useState<SavedGame[]>(INITIAL_SAVES);
  const [volumes, setVolumes]       = useState({ effects: 70, music: 50, voices: 80 });
  const [hoveredBtn, setHoveredBtn] = useState<number | null>(null);
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

      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Bottom darkening for readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(5,3,1,0.5) 50%, rgba(5,3,1,0.78) 100%)",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* Top storm darken */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(8,5,18,0.5) 0%, transparent 28%)",
      }} />

      {/* Floating runes */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <FloatingRunes />
      </div>

      {/* Torch glow - left */}
      <div className="torch-flicker" style={{
        position: "absolute", left: "5%", top: "35%",
        width: "100px", height: "140px",
        background: "radial-gradient(ellipse, rgba(255,130,10,0.16) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Torch glow - right */}
      <div className="torch-flicker" style={{
        position: "absolute", right: "5%", top: "35%",
        width: "100px", height: "140px",
        background: "radial-gradient(ellipse, rgba(255,130,10,0.16) 0%, transparent 70%)",
        animationDelay: "0.8s",
        pointerEvents: "none",
      }} />

      {/* ════ MAIN MENU ════ */}
      {screen === "menu" && (
        <div className="screen-in" style={{
          width: "min(400px, 90vw)",
          display: "flex", flexDirection: "column", gap: "20px",
          position: "relative", zIndex: 10,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "12px", color: "var(--f-gold-dim)",
              letterSpacing: "5px", marginBottom: "14px",
            }}>✦ ✦ ✦</div>

            <h1 className="gold-glow" style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(26px, 7vw, 40px)",
              fontWeight: 700,
              color: "var(--f-gold)",
              margin: 0, lineHeight: 1.2,
              letterSpacing: "0.06em",
            }}>
              FANTASY
            </h1>
            <h2 style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(13px, 3.5vw, 18px)",
              fontWeight: 400,
              color: "var(--f-cream)",
              margin: "4px 0 0",
              opacity: 0.7,
              letterSpacing: "0.25em",
            }}>
              QUEST
            </h2>
            <p style={{
              marginTop: "12px", fontSize: "13px",
              color: "var(--f-muted)",
              fontFamily: "'IM Fell English', serif",
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}>
              Выберите путь, странник...
            </p>
          </div>

          <div className="f-panel" style={{
            display: "flex", flexDirection: "column",
            padding: "6px 8px",
          }}>
            {MENU_ITEMS.map((item, i) => (
              <button
                key={item.id}
                className={`f-btn ${item.danger ? "danger" : ""}`}
                onMouseEnter={() => setHoveredBtn(i)}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => goTo(item.id)}
                style={{
                  borderBottom: i < MENU_ITEMS.length - 1
                    ? "1px solid rgba(212,168,67,0.1)"
                    : "none",
                }}
              >
                <span style={{ fontSize: "17px", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {hoveredBtn === i && (
                  <span className="blink" style={{
                    fontSize: "16px",
                    color: item.danger ? "var(--f-red)" : "var(--f-gold)",
                  }}>›</span>
                )}
              </button>
            ))}
          </div>

          <div style={{
            textAlign: "center", fontSize: "9px",
            color: "var(--f-muted)", letterSpacing: "3px",
            fontFamily: "'IM Fell English', serif", fontStyle: "italic",
          }}>
            ✦ Fantasy Quest © 2026 ✦
          </div>
        </div>
      )}

      {/* ════ NEW GAME ════ */}
      {screen === "new-game" && (
        <div className="screen-in" style={{
          width: "min(400px, 90vw)",
          display: "flex", flexDirection: "column", gap: "22px",
          position: "relative", zIndex: 10,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>⚔️</div>
            <h2 className="gold-glow" style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(15px, 4.2vw, 21px)",
              color: "var(--f-gold)", margin: 0, letterSpacing: "0.06em",
            }}>Новая Партия</h2>
            <p style={{
              fontFamily: "'IM Fell English', serif", fontStyle: "italic",
              fontSize: "13px", color: "var(--f-muted)", margin: "8px 0 0",
            }}>Нарекай своё приключение</p>
          </div>

          <div className="f-panel" style={{ padding: "22px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <SectionTitle>НАЗВАНИЕ ПАРТИИ</SectionTitle>
            <input
              ref={inputRef}
              className="f-input"
              type="text"
              maxLength={24}
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && startNewGame()}
              placeholder="Великое Приключение..."
            />
            <div style={{ fontSize: "10px", color: "var(--f-muted)", textAlign: "right", marginTop: "-4px" }}>
              {gameName.length} / 24
            </div>
            <button
              className="f-btn"
              onClick={startNewGame}
              disabled={!gameName.trim()}
              style={{
                justifyContent: "center",
                opacity: gameName.trim() ? 1 : 0.35,
                cursor: gameName.trim() ? "pointer" : "not-allowed",
                color: "var(--f-gold-light)",
                borderColor: "rgba(212,168,67,0.65)",
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              ⚔ &nbsp; Начать Поход
            </button>
          </div>

          <button className="f-btn" onClick={() => setScreen("menu")}
            style={{ justifyContent: "center", fontSize: "11px", letterSpacing: "0.1em", opacity: 0.7 }}>
            ← &nbsp; Назад
          </button>
        </div>
      )}

      {/* ════ CONTINUE ════ */}
      {screen === "continue" && (
        <div className="screen-in" style={{
          width: "min(400px, 90vw)",
          display: "flex", flexDirection: "column", gap: "18px",
          position: "relative", zIndex: 10,
          maxHeight: "88dvh",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>📜</div>
            <h2 className="gold-glow" style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(14px, 4vw, 20px)",
              color: "var(--f-gold)", margin: 0, letterSpacing: "0.06em",
            }}>Летопись Партий</h2>
          </div>

          <div className="f-panel" style={{
            display: "flex", flexDirection: "column",
            padding: "6px 8px",
            overflowY: "auto", maxHeight: "52dvh",
          }}>
            {saves.length === 0 ? (
              <div style={{
                padding: "32px", textAlign: "center",
                color: "var(--f-muted)", fontSize: "13px",
                fontFamily: "'IM Fell English', serif", fontStyle: "italic",
              }}>Хроники пусты...</div>
            ) : saves.map((save, i) => (
              <button
                key={save.id}
                className="f-btn"
                style={{
                  flexDirection: "column", alignItems: "flex-start",
                  gap: "10px",
                  borderBottom: i < saves.length - 1
                    ? "1px solid rgba(212,168,67,0.1)"
                    : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'IM Fell English', serif",
                    fontSize: "clamp(13px, 3.2vw, 16px)",
                    color: "var(--f-gold-light)",
                  }}>
                    {save.name}
                  </span>
                  <span style={{ fontSize: "9px", color: "var(--f-muted)", letterSpacing: "1px", whiteSpace: "nowrap" }}>
                    LVL {save.level}
                  </span>
                </div>
                <ProgressBar value={Math.min(save.level * 8, 100)} />
                <div style={{ fontSize: "9px", color: "var(--f-muted)", letterSpacing: "1px" }}>
                  📅 {save.date}
                </div>
              </button>
            ))}
          </div>

          <button className="f-btn" onClick={() => setScreen("menu")}
            style={{ justifyContent: "center", fontSize: "11px", letterSpacing: "0.1em", opacity: 0.7 }}>
            ← &nbsp; Назад
          </button>
        </div>
      )}

      {/* ════ SETTINGS ════ */}
      {screen === "settings" && (
        <div className="screen-in" style={{
          width: "min(400px, 90vw)",
          display: "flex", flexDirection: "column", gap: "20px",
          position: "relative", zIndex: 10,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⚙️</div>
            <h2 className="gold-glow" style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(14px, 4vw, 20px)",
              color: "var(--f-gold)", margin: 0, letterSpacing: "0.06em",
            }}>Настройки</h2>
          </div>

          <div className="f-panel" style={{ padding: "22px 20px", display: "flex", flexDirection: "column", gap: "26px" }}>
            <SectionTitle>ЗВУК</SectionTitle>

            {([
              { key: "effects" as const, label: "🔊 Эффекты", color: "var(--f-gold)" },
              { key: "music"   as const, label: "🎵 Музыка",  color: "#6aabe0" },
              { key: "voices"  as const, label: "🎙 Голоса",  color: "#9de090" },
            ] as const).map(({ key, label, color }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(9px, 2.3vw, 11px)",
                    color, letterSpacing: "0.1em",
                  }}>
                    {label}
                  </label>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "11px", color,
                    minWidth: "36px", textAlign: "right",
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

          <button className="f-btn" onClick={() => setScreen("menu")}
            style={{ justifyContent: "center", fontSize: "11px", letterSpacing: "0.1em", opacity: 0.7 }}>
            ← &nbsp; Сохранить и выйти
          </button>
        </div>
      )}
    </div>
  );
}
