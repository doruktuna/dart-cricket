import emptyMark from '/icons/empty-mark.svg';
import singleMark from '/icons/single-mark.svg';
import xMark from '/icons/x-mark.svg';
import circleWithX from '/icons/circle-with-x.svg';
import CricketPlayer from '../classes/CricketPlayer';
import dartIcon from '/icons/dart.svg';
import '../styles/score-sheet.css';
import { AVAILABLE_SHOTS } from './Cricket';

function NamesRow(
  { players, shotNameCol, curPlayerInd, isGameFinished, shotNo }:
    {
      players: CricketPlayer[],
      shotNameCol: number,
      curPlayerInd: number,
      isGameFinished: boolean,
      shotNo: number,
    }
) {

  return (
    <tr key='names-row' className="names-row">
      {players.map((p, i) => {
        const isCurPlayer = !isGameFinished && i === curPlayerInd;
        let thClass = isCurPlayer ? 'player-cell current-player' : 'player-cell';
        thClass += i === (players.length - 1) ? ' no-right-border' : '';

        let dartClasses = ['hidden', 'hidden', 'hidden'];
        if (isCurPlayer) {
          for (let j = shotNo; j <= dartClasses.length; j++) {
            dartClasses[j - 1] = '';
          }
        }

        return (
          <>
            {i == shotNameCol && <th key='shot-cell' className='shot-cell'></th>}
            <th key={p.name} className={thClass}>
              <div className='dart-icons flex-row-centered'>
                {
                  dartClasses.map((dartClass, i) =>
                    <img key={i} src={dartIcon} alt={"Dart Throwing Icon" + i} className={dartClass} />)
                }
              </div>
              <p>{p.name}</p>
            </th>
          </>
        )
      })}
    </tr >
  );
}

function ShotRow(
  { players, shotNameCol, shotStr }:
    {
      players: CricketPlayer[];
      shotNameCol: number,
      shotStr: string;
    }
) {

  let isShotClosed = players.every(p => p.shots[shotStr] >= 3);

  return (
    <tr key={shotStr} className="shots-row">
      {players.map((p, i) => (
        <>
          {i == shotNameCol &&
            <td key={'shot-cell'} className='shot-cell'>
              <span>{shotStr}</span>
              {isShotClosed &&
                <img src={xMark} alt="X mark icon" className='shot-score-x-mark' />
              }
            </td>
          }

          <td
            key={p.name}
            className={i === (players.length - 1) ? 'player-cell no-right-border' : 'player-cell'}
          >
            <ShotIcon numShots={p.shots[shotStr]} />
          </td>
        </>
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
  { players, shotNameCol }:
    {
      players: CricketPlayer[];
      shotNameCol: number,
    }
) {

  return (
    <tr key='scores' className="scores-row">
      {players.map((p, i) => (
        <>
          {shotNameCol == i &&
            <td key='shot-cell' className='shot-cell no-bottom-border'></td>
          }

          <td
            key={p.name}
            className={i === (players.length - 1) ? 'player-cell no-bottom-border no-right-border' : 'player-cell no-bottom-border'}
          >
            {p.getScore()}
          </td>
        </>
      ))}
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

  const shotNameCol = players.length == 3 ? 0 : Math.ceil(players.length / 2);

  return (
    <table key="score-sheet" className="score-sheet">
      <thead>
        <NamesRow
          players={players}
          shotNameCol={shotNameCol}
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
            players={players}
            shotNameCol={shotNameCol}
          />
        ))}

        <ScoresRow
          players={players}
          shotNameCol={shotNameCol}
        />
      </tbody>
    </table >
  );
}

export default ScoreSheet