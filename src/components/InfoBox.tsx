import "../styles/info-box.css";
import CricketPlayer from "../classes/CricketPlayer";
import { MAX_TURNS } from "./Cricket";

function WinnerInfo({ winnerNames }: { winnerNames: string[] }) {
  let winnerStr = '';
  if (winnerNames.length === 1) {
    winnerStr = "Winner: " + winnerNames[0];
  } else if (winnerNames.length === 2) {
    winnerStr = "Winners: " + winnerNames.join(" and ");
  } else {
    winnerStr = "Winners: " + winnerNames.join(", ");
  }

  return (
    <div className="winner-info">
      <span>Game Finished</span>
      <span>{winnerStr}</span>
    </div>
  );
}

function InfoBox(
  { curPlayer, gameTurn, curShotNo, isGameFinished, winnerNames, restartGame, newGame }:
    {
      curPlayer: CricketPlayer;
      gameTurn: number;
      curShotNo: number;
      isGameFinished: boolean;
      winnerNames: string[];
      restartGame: () => void;
      newGame: () => void
    }
) {
  return (
    <div key="info-box" className="info-box">
      <span>Turn: {gameTurn}/{MAX_TURNS}</span>

      {!isGameFinished && <span>{curPlayer.name}'s turn</span>}
      {!isGameFinished && <span>Shot: {curShotNo}/3</span>}
      {isGameFinished && winnerNames &&
        <WinnerInfo
          winnerNames={winnerNames}
        />
      }

      <button onClick={restartGame}>RESTART</button>
      <button onClick={newGame}>NEW GAME</button>
    </div>
  );
}

export default InfoBox