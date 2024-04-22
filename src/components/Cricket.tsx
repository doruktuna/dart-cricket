import { useState } from 'react'
import PlayerSetupScreen from './PlayerSetupScreen';
import ShotButtons from './ShotButtons';
import ScoreSheet from './ScoreSheet';
import "../styles/sitewide.css"

function Cricket() {
  const MAX_TURNS = 25;
  const availableShots = ['20', '19', '18', '17', '16', '15', 'BE'];

  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(1);
  const [curPlayer, setCurPlayer] = useState(0);
  const [curShotNo, setCurShotNo] = useState(1);
  const [isGameFinished, setIsGameFinished] = useState(true);
  const [isGettingNames, setIsGettingNames] = useState(true);
  const [winnerNames, setWinnerNames] = useState(null);

  function nameSetupFinished(names: string[]) {
    names.forEach(name => console.log(name));

    setIsGettingNames(false);
  }


  return (
    <>
      <div key='cricket' className='cricket'>
        {isGettingNames &&
          <PlayerSetupScreen
            nameSetupFinished={nameSetupFinished}
          />
        }
        {/* {!isGettingNames && !isGameFinished &&
          <ShotButtons
            dartScored={dartScored}
            passTurn={passTurn}
            availableShots={availableShots}
          />
        }
        {!isGettingNames &&
          <ScoreSheet
            players={players}
            curPlayer={curPlayer}
            availableShots={availableShots}
            isGameFinished={isGameFinished}
          />
        }
        {!isGettingNames && <InfoBox />} */}
      </div >
    </>
  )
}

export default Cricket
