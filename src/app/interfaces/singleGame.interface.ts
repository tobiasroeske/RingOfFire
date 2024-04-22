export interface SingleGame {
    id?: string,
    players: string[],
    stack: string[],
    playedCards: string [],
    currentPlayer: number, 
    currentCard: string,
    pickCardAnimation: boolean
}