import { SingleGame } from "../app/interfaces/singleGame.interface";



export class Game implements SingleGame{
    public id?: string;
    public players: string[] = [];
    public playerImages: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public currentCard: string = ''
    public pickCardAnimation: boolean = false;
    constructor() {
        for (let i = 1; i < 14; i++) { 
            this.stack.push('spade_' + i);
            this.stack.push('clubs_' + i);
            this.stack.push('hearts_' + i);
            this.stack.push('diamonds_' + i);
        }
        shuffle(this.stack);
    }

    public toJson() {
        return {
            players: this.players,
            playerImages: this.playerImages,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            currentCard: this.currentCard,
            pickCardAnimation: this.pickCardAnimation
        }
    }
}

function shuffle(array: string[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }