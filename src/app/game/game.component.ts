import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { SingleGame } from '../interfaces/singleGame.interface';
import { Firestore } from '@angular/fire/firestore';

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
  
  gameId: string = '';

  constructor(
    public dialog: MatDialog,
    private gameService: GameService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.cdr.detectChanges();
  }

  async newGame() {
    this.game = new Game();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
    })
    await this.gameService.getSingleGameById(this.gameId);
    this.game = this.gameService.singleGame;
    this.gameService.unsubSingleGame(this.gameId);
  }

  getGame() {
    if (this.gameService.singleGame) {
      return this.gameService.singleGame;
    } else {
      return this.game;
    }
  }

  takeCard() {
    if (
      this.game.stack.length > 0 &&
      !this.game.pickCardAnimation &&
      this.game.players.length > 0
    ) {
      this.game.currentCard = this.game.stack.pop()!;
      this.game.pickCardAnimation = true;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
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
        this.saveGame();
      }
    });
  }

  async saveGame() {
    await this.gameService.updateGame(this.game);
  }
}
