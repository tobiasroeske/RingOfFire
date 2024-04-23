import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../../models/game';
import { GameService } from '../firebase-services/game.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  private gameService = inject(GameService);
  public router = inject(Router);
  public gameID!: string;
 
  async newGame() {
    let game = new Game();
    await this.gameService.addGame(game.toJson());
    this.gameID = this.gameService.gameId;
    this.router.navigateByUrl('/game/' + this.gameID);
  }
}
