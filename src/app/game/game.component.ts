import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  game: Game;
  currentCard: string = '';
  pickCardAnimation = false;

  constructor() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length > 0 && !this.pickCardAnimation) {
      this.updateCards();
      this.pickCardAnimation = true;
    }
    setTimeout(() => {
      this.pickCardAnimation = false;
    }, 1500);
  }

  updateCards() {
    this.currentCard = this.game.stack.pop()!;
    this.game.playedCards.push(this.currentCard);
  }
}
