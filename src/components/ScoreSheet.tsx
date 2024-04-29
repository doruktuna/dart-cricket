import React from 'react';
import emptyMark from '/icons/empty-mark.svg';
import singleMark from '/icons/single-mark.svg';
import xMark from '/icons/x-mark.svg';
import circleWithX from '/icons/circle-with-x.svg';
import CricketPlayer from '../classes/CricketPlayer';
import '../styles/score-sheet.css';
import { AVAILABLE_SHOTS } from './Cricket';

function NamesRow(
  { leftPlayers, rightPlayers, curPlayerInd, isGameFinished }:
    {
      leftPlayers: CricketPlayer[];
      rightPlayers: CricketPlayer[];
      curPlayerInd: number;
      isGameFinished: boolean;
    }
) {
  return (
    <tr key='names-row' className="name-row">
      {leftPlayers.map(p => {
        let classNameStr = 'player-cell';
        console.log(p);

        if (!isGameFinished && p.getInd() === curPlayerInd) {
          classNameStr += ' current-player';
        }
        return (
          <th key={p.name} className={classNameStr}>{p.name}</th>
        )
      })}

      <th key='shot-cell' className='shot-cell'></th>

      {rightPlayers.map((p, i) => {
        let classNameStr = 'player-cell';
        classNameStr += i === (rightPlayers.length - 1) ? ' no-right-border' : '';
        if (!isGameFinished && p.getInd() === curPlayerInd) {
          classNameStr += ' current-player';
        }

        return (
          <th key={p.name} className={classNameStr} >{p.name}</th>
        )
      })}
    </tr >
  );
}

function ShotRow(
  { leftPlayers, rightPlayers, shotStr }:
    {
      leftPlayers: CricketPlayer[];
      rightPlayers: CricketPlayer[];
      shotStr: string;
    }
) {

  let isShotClosed =
    leftPlayers.every(p => p.shots[shotStr] >= 3) &&
    rightPlayers.every(p => p.shots[shotStr] >= 3);

  return (
    <tr key={shotStr} className="score-row">
      {leftPlayers.map(p => (
        <td key={p.name} className='player-cell'>
          <ShotIcon numShots={p.shots[shotStr]} />
        </td>
      ))}

      <td key={'shot-cell'} className='shot-cell'>
        <span>{shotStr}</span>
        {isShotClosed &&
          <img src={xMark} alt="X mark icon" className='shot-score-x-mark' />
        }
      </td>

      {rightPlayers.map((p, i) => (
        <td
          key={p.name}
          className={i === (rightPlayers.length - 1) ? 'player-cell no-right-border' : 'player-cell'}
        >
          <ShotIcon numShots={p.shots[shotStr]} />
        </td>
      ))}
    </tr>
  );
}

function ShotIcon({ numShots }: { numShots: number }) {
  if (numShots === 0) { return <img src={emptyMark} alt=" " />; }
  if (numShots === 1) { return <img src={singleMark} alt="1" />; }
  if (numShots === 2) { return <img src={xMark} alt="2" />; }

  return <img src={circleWithX} alt="3+" />;
}

function ScoresRow(
  { leftPlayers, rightPlayers }:
    {
      leftPlayers: CricketPlayer[];
      rightPlayers: CricketPlayer[];
    }
) {
  return (
    <tr key='scores' className="score-row">
      {leftPlayers.map(p => (
        <td key={p.name} className='player-cell no-bottom-border'>
          {p.getScore()}
        </td>
      ))}

      <td key='shot-cell' className='shot-cell no-bottom-border'></td>

      {rightPlayers.map((p, i) => (
        <td
          key={p.name}
          className={i === (rightPlayers.length - 1) ? 'player-cell no-bottom-border no-right-border' : 'player-cell no-bottom-border'}
        >
          {p.getScore()}
        </td>
      ))
      }
    </tr >
  );
}

function ScoreSheet(
  { players, curPlayerInd, isGameFinished }:
    {
      players: CricketPlayer[],
      curPlayerInd: number,
      isGameFinished: boolean
    }
) {
  const divPoint = Math.ceil(players.length / 2);
  const leftPlayers = players.filter((_, i) => i < divPoint);
  const rightPlayers = players.filter((_, i) => i >= divPoint);

  return (
    <table key="score-sheet" className="score-sheet">
      <thead>
        <NamesRow
          leftPlayers={leftPlayers}
          rightPlayers={rightPlayers}
          curPlayerInd={curPlayerInd}
          isGameFinished={isGameFinished}
        />
      </thead>

      <tbody>
        {AVAILABLE_SHOTS.map(shotStr => (
          <ShotRow
            key={shotStr}
            shotStr={shotStr}
            leftPlayers={leftPlayers}
            rightPlayers={rightPlayers}
          />
        ))}

        <ScoresRow
          leftPlayers={leftPlayers}
          rightPlayers={rightPlayers}
        />
      </tbody>
    </table >
  );
}


export default ScoreSheet