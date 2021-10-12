/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ASCII_CODE, BOARD_DIMENSION } from '@app/GameLogic/constants';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Board, letterMultiplicator, wordMultiplicator } from './board';

describe('Board test', () => {
    let board: Board;
    const randomBonus = false;
    const letterCreator = new LetterCreator();

    beforeEach(() => {
        board = new Board(randomBonus);
    });
    it('Board size', () => {
        expect(board.grid.length).toBe(BOARD_DIMENSION);
        board.grid.forEach((row) => {
            expect(row.length).toBe(BOARD_DIMENSION);
        });
    });

    it('Board default value at right place', () => {
        wordMultiplicator.forEach((elem) => {
            expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].wordMultiplicator).toBe(elem.v);
        });

        letterMultiplicator.forEach((elem) => {
            expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].letterMultiplicator).toBe(elem.v);
        });
    });

    it('should x + 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(4, 5);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should x - 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(6, 5);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should y + 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(5, 4);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('should y - 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(4, 6);
        expect(board.hasNeighbour(4, 5)).toBeTruthy();
    });

    it('position should have random tile multiplicator', () => {
        let differentBoard = false;
        const randomBoard = new Board(randomBonus);
        for (const tile of board.grid[0]) {
            const x = 0;
            if (tile.letterMultiplicator > 1) {
                const randomBoardLetterMult = randomBoard.grid[0][x].letterMultiplicator;
                if (tile.letterMultiplicator !== randomBoardLetterMult) {
                    differentBoard = true;
                }
            }
            if (tile.wordMultiplicator > 1) {
                const randomBoardWordMult = randomBoard.grid[0][x].wordMultiplicator;
                if (tile.wordMultiplicator !== randomBoardWordMult) {
                    differentBoard = true;
                }
            }
        }
        expect(differentBoard).toBe(true);
    });
});
