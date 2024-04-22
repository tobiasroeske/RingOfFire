import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { Game } from '../../models/game';
import { ProfileComponent } from './profile/profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from './dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { GameService } from '../firebase-services/game.service';
import { StartScreenComponent } from '../start-screen/start-screen.component';
import { ActivatedRoute } from '@angular/router';
import { SingleGame } from '../interfaces/Singlegame.interface';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  game!: SingleGame;
  gamesList: [] = [];
  currentCard: string = '';
  pickCardAnimation = false;
  gameId: string = '';

  constructor(public dialog: MatDialog, private gameService: GameService, private route: ActivatedRoute) {
    
  }


  ngOnInit(): void {
    this.newGame();
  }

  async newGame() {
    this.game = new Game;
    
    this.route.params.subscribe(params => {
      this.gameId = params['id'];
    })
    await this.gameService.getSingleGameById(this.gameId);
      this.game = this.gameService.singleGame
  }

  takeCard() {
    if (
      this.game.stack.length > 0 &&
      !this.pickCardAnimation &&
      this.game.players.length > 0
    ) {
      this.currentCard = this.game.stack.pop()!;
      this.pickCardAnimation = true;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.changeActivePlayer();
        this.saveGame();
      }, 1000);
    } else if (this.game.players.length == 0) {
      console.log('Please add player');
      this.openDialog();
    }
  }

  changeActivePlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame()
      }
    });
  }

  async saveGame() {
    await this.gameService.updateGame(this.game);
  }
}
