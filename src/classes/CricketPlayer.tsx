import { AVAILABLE_SHOTS } from "../components/Cricket";

export default class CricketPlayer {
  public name: string;
  private ind: number;
  public shots: { [shot: string]: number } = {};
  private score = 0;

  constructor(name: string, ind: number, shots?: { [shot: string]: number }, score?: number) {
    this.name = name;
    this.ind = ind;
    if (shots) {
      this.shots = shots;
    } else {
      this.restartGame();
    }
    this.score = score ? score : 0;
  }

  addShot(shot: string, count: number) {
    this.shots[shot] += count;
  }

  getScore() {
    return this.score;
  }

  getInd() {
    return this.ind;
  }

  opponentScoreShot(shot: string, count: number) {
    if (this.shots[shot] < 3) {
      // BE has a value of 25
      const value = isNaN(Number(shot)) ? 25 : Number(shot);
      this.score += count * value;
    }
  }

  restartGame() {
    AVAILABLE_SHOTS.forEach(shot => { this.shots[shot] = 0; })
    this.score = 0;
  }
}