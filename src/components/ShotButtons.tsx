import React from 'react'
import { AVAILABLE_SHOTS } from './Cricket';

function ShotButtonRow(
  { dartScored, shot }:
    {
      dartScored: (scoreStr: string, times: number) => void;
      shot: string;
    }
) {
  const doubleStr = shot == "BULL" ? "BE" : "D-" + shot;

  return (
    <div className='shot-button-row'>
      <button
        key='single'
        className='shot-button single'
        onClick={() => { dartScored(shot, 1) }}
      >
        {shot}
      </button>


      <button
        key='double'
        className='shot-button double'
        onClick={() => { dartScored(shot, 2) }}
      >
        {doubleStr}
      </button>

      {shot !== 'BULL' &&
        <button
          key='triple'
          className='shot-button triple'
          onClick={() => { dartScored(shot, 3) }}
        >
          {'T-' + shot}
        </button>
      }
    </div>
  )
}

function ShotButtons(
  { dartScored, passTurn }:
    {
      dartScored: (scoreStr: string, times: number) => void;
      passTurn: () => void;
    }
) {
  return (
    <div key="shot-buttons" className="shot-buttons">
      {AVAILABLE_SHOTS.map(shot => (
        <ShotButtonRow
          key={shot}
          dartScored={dartScored}
          shot={shot}
        />
      ))}

      <div key='pass' className='shot-button-row'>
        <button
          key='button-pass'
          className='shot-button pass'
          onClick={() => (passTurn())}
        >
          PASS
        </button>
      </div>
    </div>
  );
}

export default ShotButtons;