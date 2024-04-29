import { useEffect, useState } from 'react'
import PlayerSetupScreen from './PlayerSetupScreen';
import ShotButtons from './ShotButtons';
import ScoreSheet from './ScoreSheet';
import "../styles/sitewide.css"
import "../styles/cricket.css"
import CricketPlayer from '../classes/CricketPlayer';
import InfoBox from './InfoBox';

export const MAX_TURNS = 25;
export const AVAILABLE_SHOTS = ['20', '19', '18', '17', '16', '15', 'BULL'];

export type Shot = {
  playerName: string,
  playerInd: number,
  shotStr: string,
  times: number
};

function Cricket() {
  const [players, setPlayers] = useState<CricketPlayer[]>([]);
  const [turn, setTurn] = useState(1);
  const [curPlayerInd, setCurPlayerInd] = useState(0);
  const [curShotNo, setCurShotNo] = useState(1);
  const [isGameFinished, setIsGameFinished] = useState(true);
  const [isGettingNames, setIsGettingNames] = useState(true);
  const [winnerNames, setWinnerNames] = useState<string[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);

  // Load data when the page is first loaded
  useEffect(() => {
    const loadDataRaw = localStorage.getItem("CRICKET_DATA");
    if (loadDataRaw) {
      const data = JSON.parse(loadDataRaw);
      const newPlayers = data.players.map((pObj: any) => {
        let player = new CricketPlayer(pObj.name, pObj.ind, pObj.shots, pObj.score);
        return player;
      })

      setPlayers(newPlayers);
      setTurn(data.turn);
      setCurPlayerInd(data.curPlayerInd);
      setCurShotNo(data.curShotNo);
      setIsGameFinished(data.isGameFinished);
      setIsGettingNames(data.isGettingNames);
      setWinnerNames(data.winnerNames);
      setShots(data.shots);
      console.log("CRICKET: Loaded data", data);
    }
  }, []);

  // Save data when a state changes
  useEffect(() => {
    const saveData = {
      players,
      turn,
      curPlayerInd,
      curShotNo,
      isGameFinished,
      isGettingNames,
      winnerNames,
      shots
    }
    localStorage.setItem("CRICKET_DATA", JSON.stringify(saveData));
  }, [players, turn, curPlayerInd, curShotNo, isGameFinished, isGettingNames, winnerNames]);

  function newGame() {
    setIsGameFinished(true);
    setIsGettingNames(true);
  }

  function nameSetupFinished(names: string[]) {
    const newPlayers = names.map((name, ind) => new CricketPlayer(name, ind));

    setIsGettingNames(false);
    setPlayers(newPlayers);
    startGame();
  }

  function startGame() {
    setTurn(1);
    setCurPlayerInd(0);
    setCurShotNo(1);
    setIsGameFinished(false);
    setShots([]);
  }

  function restartGame() {
    const newPlayers = players.map(player => {
      player.restartGame();
      return player;
    });
    setPlayers(newPlayers);
    startGame();
  }

  function dartScored(shotStr: string, times: number) {
    const curPlayer = players[curPlayerInd];
    console.log(curPlayer.name + " scored " + shotStr + ", " + times + " times.");

    const newShot: Shot = {
      playerName: curPlayer.name,
      playerInd: curPlayer.getInd(),
      shotStr: shotStr,
      times: times
    };
    setShots(prev => [...prev, newShot]);

    // Update current player's shots and other's scores
    let scoreTimes = Math.min(times, curPlayer.shots[shotStr] + times - 3);
    scoreTimes = Math.max(0, scoreTimes);

    const newPlayers = players.map((player, i) => {
      if (curPlayerInd == i) {
        player.addShot(shotStr, times);
      } else {
        player.opponentScoreShot(shotStr, scoreTimes);
      }
      return player;
    })
    setPlayers(newPlayers);

    checkForWinner();

    const newShotNo = curShotNo + 1;
    if (newShotNo == 4) {
      passTurn(false);
    } else {
      setCurShotNo(newShotNo);
    }
  }

  function passTurn(isPassClicked = true) {
    if (isPassClicked) {
      const newShot: Shot = {
        playerName: players[curPlayerInd].name,
        playerInd: players[curPlayerInd].getInd(),
        shotStr: "PASS",
        times: 1
      };
      setShots(prev => [...prev, newShot]);
    }

    let newPlayerInd = curPlayerInd + 1;
    if (newPlayerInd == players.length) {
      if (turn == MAX_TURNS) {
        setIsGameFinished(true);
        evaluateWinners();
        return;
      } else {
        setTurn(prev => prev + 1);
      }
      newPlayerInd = 0;
    }
    setCurPlayerInd(newPlayerInd);
    setCurShotNo(1);
  }

  // A player wins before the end of turns only if:
  // 1) They has scored at least 3 times for all shots
  // 2) They have the minimum score
  function checkForWinner() {
    const candidate = players[curPlayerInd];

    const lesserShots = Object.entries(candidate.shots).filter(([_, val]) => val < 3)
    if (lesserShots.length > 0) { return; }

    const candScore = candidate.getScore();
    const lesserScores = players.filter((player, i) => (i !== curPlayerInd && candScore >= player.getScore()));
    if (lesserScores.length > 0) { return; }

    console.log("We have a winner by closing all shots: " + candidate.name);

    setIsGameFinished(true);
    setWinnerNames([candidate.name]);
  }

  function evaluateWinners() {
    const playerScores = players.map(p => p.getScore());
    const minScore = Math.min.apply(Math, playerScores);
    console.log("Min score is: " + minScore);

    const winnerNames = players
      .filter(player => player.getScore() === minScore)
      .map(player => player.name);
    console.log("Winner names: " + winnerNames);

    setWinnerNames(winnerNames);
  }

  function undoShot() {
    // TODO: Implement undo logic
    console.log("UNDO CALLED");
  }

  return (
    <>
      <div key='cricket' className='cricket'>
        {isGettingNames &&
          <PlayerSetupScreen
            nameSetupFinished={nameSetupFinished}
          />
        }
        {!isGettingNames &&
          <ScoreSheet
            players={players}
            curPlayerInd={curPlayerInd}
            isGameFinished={isGameFinished}
          />
        }
        {!isGettingNames && !isGameFinished &&
          <ShotButtons
            dartScored={dartScored}
            passTurn={passTurn}
          />
        }
        {!isGettingNames &&
          <InfoBox
            curPlayer={players[curPlayerInd]}
            gameTurn={turn}
            shots={shots}
            curShotNo={curShotNo}
            isGameFinished={isGameFinished}
            winnerNames={winnerNames}
            restartGame={restartGame}
            newGame={newGame}
            undoShot={undoShot}
          />
        }
      </div >
    </>
  )
}

export default Cricket