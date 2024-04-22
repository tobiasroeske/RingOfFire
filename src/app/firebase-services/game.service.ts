import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  firestore: Firestore = inject(Firestore);
  public games:any = [];
  unsubGames;
  singleGame: any;


  constructor(private route: ActivatedRoute) {
    this.unsubGames = this.unsubGamesList();
  }

  ngOnDestroy(): void {
    this.unsubGames();
  }

  unsubGamesList() {
    return onSnapshot(this.getGamesRef(), (list) => {
      this.games = [];
      list.forEach((element) => {
        let newGame =  (this.setGameObject(element, element.id));
        this.games.push(newGame);
      });
      console.log(this.games);
    });
  }

  getGamesList() {
    return this.games;
  }

  setGameObject(obj:any, id:string) {
    return {
      id: id,
      players: obj.players,
      stack: obj.stack,
      playedCards: obj.playedCards,
      currentPlayer: obj.currentPlayer
    }
  }

  async addGame(game: {}) {
    await addDoc(this.getGamesRef(), game)
      .catch((err) => console.error(err));
  }

  setNewGameRef() {
    let newGameRef = doc(this.getGamesRef());
    return newGameRef;
  }

  getGameId() {
    let gameInfo = this.setNewGameRef();
    return gameInfo.id;
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId:string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }
}
