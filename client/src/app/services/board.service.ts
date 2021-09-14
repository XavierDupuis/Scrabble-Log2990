import { Injectable } from '@angular/core';
import { Board } from '@app/GameLogic/game/board';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Board = new Board();
}