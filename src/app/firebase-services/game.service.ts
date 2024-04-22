import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
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
        let newGame =  (this.setGameObject(element.data(), element.id));
        this.games.push(newGame);
      });
      console.log(this.games);
    });
  }

  async getSingleGameById(id: string) {
    let docRef = doc(this.firestore, 'games', id)
    let docSnap = await getDoc(docRef);
    if(docSnap.exists()) {

      this.singleGame = this.setGameObject(docSnap.data(), id)
      console.log(this.singleGame);
      
      
    } else {
      console.log('no such document');
      
    }
  }

  getGameById(id: string, newGame: any) {
    this.games.forEach((singleGame: any) => {
      if (singleGame['id'] == id) {
        newGame.id = singleGame.id;
        newGame.players = singleGame.players;
        newGame.stack = singleGame.stack;
        newGame.playedCards = singleGame.playedCards;
        newGame.currentPlayer = singleGame.currentPlayer;
      }
    })
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

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId:string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }
}
