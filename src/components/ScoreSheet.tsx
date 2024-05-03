import React from 'react';
import emptyMark from '/icons/empty-mark.svg';
import singleMark from '/icons/single-mark.svg';
import xMark from '/icons/x-mark.svg';
import circleWithX from '/icons/circle-with-x.svg';
import CricketPlayer from '../classes/CricketPlayer';
import dartIcon from '/icons/dart.svg';
import '../styles/score-sheet.css';
import { AVAILABLE_SHOTS } from './Cricket';

function NamesRow(
  { leftPlayers, rightPlayers, curPlayerInd, isGameFinished, shotNo }:
    {
      leftPlayers: CricketPlayer[],
      rightPlayers: CricketPlayer[],
      curPlayerInd: number,
      isGameFinished: boolean,
      shotNo: number,
    }
) {

  return (
    <tr key='names-row' className="names-row">
      {leftPlayers.map(p => {
        const isCurPlayer = !isGameFinished && p.getInd() === curPlayerInd;
        let thClass = isCurPlayer ? 'player-cell current-player' : 'player-cell';

        let dartClasses = ['hidden', 'hidden', 'hidden'];
        if (isCurPlayer) {
          for (let i = shotNo; i <= dartClasses.length; i++) {
            dartClasses[i - 1] = '';
          }
        }

        return (
          <th key={p.name} className={thClass}>
            <div className='dart-icons flex-row-centered'>
              {
                dartClasses.map((dartClass, i) =>
                  <img key={i} src={dartIcon} alt={"Dart Throwing Icon" + i} className={dartClass} />)
              }
            </div>
            <p>{p.name}</p>
          </th>
        )
      })}

      <th key='shot-cell' className='shot-cell'></th>

      {rightPlayers.map((p, i) => {
        const isCurPlayer = !isGameFinished && p.getInd() === curPlayerInd;
        let thClass = isCurPlayer ? 'player-cell current-player' : 'player-cell';
        thClass += i === (rightPlayers.length - 1) ? ' no-right-border' : '';

        let dartClasses = ['hidden', 'hidden', 'hidden'];
        if (isCurPlayer) {
          for (let i = shotNo; i <= dartClasses.length; i++) {
            dartClasses[i - 1] = '';
          }
        }

        return (
          <th key={p.name} className={thClass}>
            <div className='dart-icons flex-row-centered'>
              {
                dartClasses.map((dartClass, i) =>
                  <img key={i} src={dartIcon} alt="Dart Throwing Icon" className={dartClass} />)
              }
            </div>
            <p>{p.name}</p>
          </th>
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
    <tr key={shotStr} className="shots-row">
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
    <tr key='scores' className="scores-row">
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
  { players, curPlayerInd, isGameFinished, shotNo }:
    {
      players: CricketPlayer[],
      curPlayerInd: number,
      isGameFinished: boolean,
      shotNo: number,
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
          shotNo={shotNo}
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