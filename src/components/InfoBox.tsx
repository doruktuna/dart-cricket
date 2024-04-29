import "../styles/info-box.css";
import turnIcon from '/icons/turn-icon.png';
import dartIcon from '/icons/dart.svg';
import emptyCircleIcon from '/icons/empty-circle.svg';
import filledCircleIcon from '/icons/filled-circle.svg';
import cupStarIcon from '/icons/cup-star.svg';
import CricketPlayer from "../classes/CricketPlayer";
import { MAX_TURNS, Shot } from "./Cricket";

function GameInfo(
  { curPlayer, gameTurn, curShotNo, isGameFinished, winnerNames }:
    {
      curPlayer: CricketPlayer;
      gameTurn: number;
      curShotNo: number;
      isGameFinished: boolean;
      winnerNames: string[]
    }
) {

  const emptyCircleText = "Empty Circle Icon";
  const filledCircleText = "Filled Circle Icon";

  return (
    <div className="game-info flex-column-centered">
      <p className="flex-row-centered">
        <img src={turnIcon} alt="Turn Number Icon" />
        <span>{gameTurn}/{MAX_TURNS}</span>
      </p>

      {!isGameFinished &&
        <p className="flex-row-centered">
          <img src={dartIcon} alt="Dart Throwing Icon" />
          <span>{curPlayer.name}</span>
        </p>
      }
      {!isGameFinished &&
        <p className="flex-row-centered shot-circles">
          <img
            src={curShotNo > 1 ? filledCircleIcon : emptyCircleIcon}
            alt={curShotNo > 1 ? filledCircleText : emptyCircleText}
          />
          <img
            src={curShotNo > 2 ? filledCircleIcon : emptyCircleIcon}
            alt={curShotNo > 2 ? filledCircleText : emptyCircleText}
          />
          <img
            src={curShotNo > 3 ? filledCircleIcon : emptyCircleIcon}
            alt={curShotNo > 3 ? filledCircleText : emptyCircleText}
          />
        </p>
      }
      {
        isGameFinished && winnerNames &&
        <p className="flex-row-centered">
          <img src={cupStarIcon} alt="Cup Star Icon" />
          <span>{winnerNames.join(", ")}</span>
        </p>
      }
    </div>
  )
}

function LastShotsInfo(
  { shots, undoShot }:
    {
      shots: Shot[];
      undoShot: () => void;
    }
) {

  const numLastShots = 5;
  let lastShots = Array<Shot | null>(numLastShots).fill(null);
  let i = 1;
  while (i <= numLastShots && i <= shots.length) {
    lastShots[i - 1] = shots[shots.length - i];
    i++;
  }

  return (
    <div className="last-shots-info flex-column-centered">
      <button
        onClick={undoShot}
        disabled={shots.length == 0}
      >
        UNDO SHOT
      </button>
      {
        lastShots.map((shot, i) => {
          if (shot == null) {
            return <p key={i} className="prev-shot">&ensp;</p>;
          }
          return <p key={i} className="prev-shot">
            <span>(S{shots.length - i})</span>
            <span>&ensp;</span>
            <span>{shot.playerName},&ensp;{getShotStr(shot)}</span>
          </p>;
        })
      }
    </div>
  )
}

function getShotStr(shot: Shot | null) {
  if (shot == null) {
    return "";
  }

  let shotStr = shot.shotStr;
  if (shot.times == 2) {
    if (shotStr == "BULL") {
      shotStr = "BE";
    } else
      shotStr = "D-" + shotStr;
  } else if (shot.times == 3) {
    shotStr = "T-" + shotStr;
  }

  return shotStr;
}

function GameButtons({ restartGame, newGame }: {
  restartGame: () => void;
  newGame: () => void;
}) {
  return (
    <div className="game-buttons flex-column-centered">
      <button onClick={restartGame}>RESTART</button>
      <button onClick={newGame}>NEW GAME</button>
    </div>
  )
}

function InfoBox(
  { curPlayer, gameTurn, shots, curShotNo, isGameFinished, winnerNames, restartGame, newGame, undoShot }:
    {
      curPlayer: CricketPlayer;
      gameTurn: number;
      shots: Shot[];
      curShotNo: number;
      isGameFinished: boolean;
      winnerNames: string[];
      restartGame: () => void;
      newGame: () => void;
      undoShot: () => void;
    }
) {

  return (
    <div key="info-box" className="info-box">
      <GameInfo
        curPlayer={curPlayer}
        gameTurn={gameTurn}
        curShotNo={curShotNo}
        isGameFinished={isGameFinished}
        winnerNames={winnerNames}
      />

      {!isGameFinished &&
        <LastShotsInfo
          shots={shots}
          undoShot={undoShot}
        />
      }

      <GameButtons
        restartGame={restartGame}
        newGame={newGame}
      />
    </div>
  );
}

export default InfoBox