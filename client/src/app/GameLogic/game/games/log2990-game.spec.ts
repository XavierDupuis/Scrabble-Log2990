import { DEFAULT_TIME_PER_TURN } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { Log2990Game } from './log2990-game';

describe('Log2990Game', () => {
    it('should create an instance', () => {
        const boardservice = new BoardService();
        expect(
            new Log2990Game(
                DEFAULT_TIME_PER_TURN,
                new TimerService(),
                new PointCalculatorService(boardservice),
                boardservice,
                new MessagesService(new CommandParserService()),
            ),
        ).toBeTruthy();
    });
});
