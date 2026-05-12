import React from "react";

/* ── Чистая кнопка-текст без рамки ── */
export const GhostBtn = ({
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
      color: danger ? "rgba(220,90,75,0.85)" : "rgba(240,220,170,0.88)",
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

/* ── Полоска прогресса ── */
export const ProgressBar = ({ value }: { value: number }) => (
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
