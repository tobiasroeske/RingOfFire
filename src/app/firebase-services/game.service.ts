import { Injectable, OnDestroy, OnInit, inject } from '@angular/core'
import { SingleGame } from '../interfaces/singleGame.interface';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnDestroy{
  firestore: Firestore = inject(Firestore);
  games: SingleGame[] = [];
  unsubGames;
  unsubSingleGames: any;
  singleGame!: SingleGame;
  gameId:string = '';


  constructor(private route: ActivatedRoute) {
    this.unsubGames = this.unsubGamesList();
  }

  ngOnDestroy(): void {
    this.unsubGames();
    this.unsubSingleGames();
  }

  unsubGamesList() {
    return onSnapshot(this.getGamesRef(), (list) => {
      this.games = [];
      list.forEach((element) => {
        let newGame =  (this.setGameObject(element.data(), element.id));
        this.games.push(newGame);
      });
    });
  }

  unsubSingleGame(id: any) {
    let unsub =  onSnapshot(doc(this.getGamesRef(), id), (game) => {
      this.singleGame = this.getCleanJson(game.data())
      
      console.log('spiel wurde aktualisiert', this.singleGame)
    })
    this.unsubSingleGames = unsub;
  }

  async updateGame(game: SingleGame) {
    if (game.id) {
      let docRef = this.getSingleGameRef('games', game.id)
      await updateDoc(docRef, this.getCleanJson(game));
    }
  }

  getCleanJson(game: any) {
    return  {
      id: game.id,
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
      currentCard: game.currentCard,
      pickCardAnimation: game.pickCardAnimation
    }
  }

  async getSingleGameById(id: string) {
    let docRef = doc(this.firestore, 'games', id)
    let docSnap = await getDoc(docRef);
    if(docSnap.exists()) {

      this.singleGame = this.setGameObject(docSnap.data(), id)
      
    } else {
      console.log('no such document');
      
    }
  }

  getGamesList() {
    return this.games;
  }

  setGameObject(obj:any, id:string) {
    return {
      id: id || '',
      players: obj.players || [],
      stack: obj.stack || [],
      playedCards: obj.playedCards || [],
      currentPlayer: obj.currentPlayer || 0,
      currentCard: obj.currentCard,
      pickCardAnimation: obj.pickCardAnimation
    }
  }

  async addGame(game: {}) {
    await addDoc(this.getGamesRef(), game)
      .catch((err) => console.error(err))
      .then((docRef) => {
        if( docRef?.id) {
          this.gameId = docRef?.id
        }
      })
      console.log(this.gameId);
      
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId:string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }
}
