import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
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
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
    PlayerMobileComponent,
    EditPlayerComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  public dialog = inject(MatDialog);
  private gameService = inject(GameService);
  private route = inject(ActivatedRoute);

  game!: SingleGame;
  gamesList: [] = [];

  gameId: string = '';
  gameOver: boolean = false;

  ngOnInit(): void {
    this.newGame();
  }

  async newGame() {
    this.game = new Game();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
    });
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

  editPlayer(index: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'delete') {
          this.game.players.splice(index, 1);
        } else {
          this.game.playerImages.splice(0, 1, change);
        }
        this.saveGame(this.game);
      }
    });
  }



  takeCard() {
    let game = this.getGame();
    let playable = !game.pickCardAnimation && game.players.length > 1 && game.stack.length > 0;
    if (game.stack.length == 0) {
      this.gameOver = true;
    }
    if (playable) {
     this.updateStack(game);
    } else if (game.players.length < 2) {
      this.openDialog();
    }
  }

  updateStack(game: SingleGame) {
    game.currentCard = game.stack.pop()!;
    game.pickCardAnimation = true;
    this.saveGame(game);
    setTimeout(() => {
      game.playedCards.push(game.currentCard);
      game.pickCardAnimation = false;
      this.changeActivePlayer(game);
      this.saveGame(game);
    }, 1000);
  }

  changeActivePlayer(game: SingleGame) {
    game.currentPlayer++;
    game.currentPlayer = game.currentPlayer % game.players.length;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages = [];
        this.saveGame(this.game);
        this.game.playerImages.push('1.webp')
        this.saveGame(this.game);
      }
    });
  }

  async saveGame(game: SingleGame) {
    await this.gameService.updateGame(game);
  }
}
