import { useEffect, useState } from 'react';
import '../styles/player-setup-screen.css';
import deleteIcon from '/icons/x-mark.svg';

type PlayerSetupScreenProps = {
  nameSetupFinished: (names: string[]) => void;
}

function PlayerSetupScreen({ nameSetupFinished }: PlayerSetupScreenProps) {
  const [names, setNames] = useState(loadData);

  // Load data when the page first loads
  function loadData(): string[] {
    const loadDataRaw = localStorage.getItem("CRICKET_DATA-names");
    console.log("Loading data", loadDataRaw);
    if (loadDataRaw) {
      const data = JSON.parse(loadDataRaw);
      return data.names;
    } else {
      return ["Player 1", "Player 2"];
    }
  }

  // Save data when a state changes
  useEffect(() => {
    const saveData = {
      names
    }
    console.log("Saving data", saveData);
    localStorage.setItem("CRICKET_DATA-names", JSON.stringify(saveData));
  }, [names]);

  function NameInput(name: string, i: number) {
    return (
      <div className='name-input-div' key={i}>
        <input
          type="text"
          size={10}
          maxLength={10}
          value={name}
          onChange={e => updatePlayer(e.target.value, i)}
        />
        <button
          title="Delete Player"
          onClick={() => deletePlayer(i)}
        >
          <img src={deleteIcon} alt="Delete Icon" />
        </button>
      </div>
    );
  }

  function addPlayer() {
    setNames(prev => { return [...prev, 'Player ' + (prev.length + 1)]; })
  }

  function deletePlayer(i: number) {
    setNames(prev => prev.filter((_, ind) => i !== ind));
  }

  function updatePlayer(name: string, i: number) {
    const newNames = [...names];
    newNames[i] = name;
    setNames(newNames);
  }

  function endPlayerSetup() {
    nameSetupFinished(names);
  }

  return (
    <div className="player-setup">
      <div className='names-box'>
        <h1>Cricket Scoring</h1>
        <h2>Players</h2>
        {names.map((name, i) => NameInput(name, i))}
        <button
          className='add-button'
          onClick={addPlayer}
          disabled={names.length >= 4}
        >
          Add Player
        </button>
        <button
          className='start-game'
          onClick={endPlayerSetup}
          disabled={names.length < 2}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

export default PlayerSetupScreen