import { Board } from '@app/GameLogic/game/board';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';

const MAX_CONSECUTIVE_PASS = 6;

export class MockGame extends Game {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    activePlayer: Player = new User('ActivePlayer');
    otherPlayer: Player = new User('otherPlayer');
    players: Player[];
    consecutivePass: number = MAX_CONSECUTIVE_PASS;
    board: Board;

    constructor(
        time: number,
        timerService: TimerService,
        pointCalculatorService: PointCalculatorService,
        boardService: BoardService,
        messageService: MessagesService,
    ) {
        super(time, timerService, pointCalculatorService, boardService, messageService);
        this.players = [this.activePlayer, this.otherPlayer];
        this.board = boardService.board;
    }
    getActivePlayer() {
        return this.activePlayer;
    }
}
