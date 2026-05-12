import { useState } from "react";
import { Screen, SavedGame, INITIAL_SAVES } from "./game/types";
import { Background } from "./game/Background";
import { MainMenu, NewGame, ContinueGame, Settings } from "./game/Screens";

export default function Index() {
  const [screen, setScreen]     = useState<Screen>("menu");
  const [gameName, setGameName] = useState("");
  const [saves, setSaves]       = useState<SavedGame[]>(INITIAL_SAVES);
  const [volumes, setVolumes]   = useState({ effects: 70, music: 50, voices: 80 });
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
      <Background />

      {screen === "menu" && (
        <MainMenu onNavigate={goTo} />
      )}

      {screen === "new-game" && (
        <NewGame
          gameName={gameName}
          onChangeName={setGameName}
          onStart={startNewGame}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "continue" && (
        <ContinueGame
          saves={saves}
          deleteId={deleteId}
          onDelete={id => setDeleteId(id)}
          onCancelDelete={() => setDeleteId(null)}
          onConfirmDelete={id => {
            setSaves(prev => prev.filter(s => s.id !== id));
            setDeleteId(null);
          }}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "settings" && (
        <Settings
          volumes={volumes}
          onChangeVolume={(key, value) => setVolumes(v => ({ ...v, [key]: value }))}
          onBack={() => setScreen("menu")}
        />
      )}
    </div>
  );
}
