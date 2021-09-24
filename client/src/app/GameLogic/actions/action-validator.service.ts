import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { NUM_TILES } from '@app/GameLogic/game/board';
// import { NUM_TILES } from '@app/GameLogic/game/board';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BoardService } from '@app/services/board.service';

// TODO: put throw error
@Injectable({
    providedIn: 'root',
})
export class ActionValidatorService {
    constructor(private board: BoardService, private gameInfo: GameInfoService, private messageService: MessagesService) {}
    sendAction(action: Action) {
        const actionValid = this.validateAction(action);
        if (actionValid) {
            const player = action.player;
            player.play(action);
        }
    }

    validateAction(action: Action): boolean {
        if (this.validateTurn(action)) {
            if (action instanceof PlaceLetter) {
                return this.validatePlaceLetter(action as PlaceLetter);
            }

            if (action instanceof ExchangeLetter) {
                return this.validateExchangeLetter(action as ExchangeLetter);
            }

            if (action instanceof PassTurn) {
                return this.validatePassTurn(action as PassTurn);
            }

            throw Error("Action couldn't be validated");
        }
        this.sendErrorMessage('Action demandé par ' + action.player.name + " pendant le tour d'un autre joueur");
        return false;
    }

    private validateTurn(action: Action): boolean {
        return this.gameInfo.activePlayer === action.player;
    }

    private validatePlaceLetter(action: PlaceLetter): boolean {
        if (!this.board.board.grid) {
            return false;
        }

        const centerTilePosition: number = Math.floor(NUM_TILES / 2);
        const board = this.board.board;
        let hasCenterTile = board.grid[centerTilePosition][centerTilePosition].letterObject.char !== ' ';

        let hasNeighbour = false;

        let x = action.placement.x;
        let y = action.placement.y;
        let lettersNeeded = '';
        let nextPos = 0;

        for (let letterIndex = 0; letterIndex < action.word.length; letterIndex++) {
            if (nextPos >= NUM_TILES || y >= NUM_TILES) {
                this.sendErrorMessage(
                    'Commande impossible à réaliser : Les lettres déboderont de la grille en ' + String.fromCharCode(y + 'A'.charCodeAt(0)) + x,
                );
                return false;
            }

            const currentTileChar = board.grid[y][x].letterObject.char.toLowerCase();
            const wordCurrentChar = action.word.charAt(letterIndex);

            if (currentTileChar === ' ') {
                lettersNeeded = lettersNeeded.concat(wordCurrentChar);
            } else {
                if (wordCurrentChar !== currentTileChar) {
                    this.sendErrorMessage(
                        'Commande impossible à réaliser : La lettre "' +
                            wordCurrentChar +
                            '" ne peut être placé en ' +
                            String.fromCharCode(y + 'A'.charCodeAt(0)) +
                            x,
                    );
                    return false;
                }
            }

            if (!hasCenterTile) {
                if (x === centerTilePosition && y === centerTilePosition) {
                    hasCenterTile = true;
                    hasNeighbour = true;
                    // Si on vient de "hasCenterTile = true;", on sait que la vérification des voisins n'est pas nécessaire
                    // -- CAS #1 : Premier mot placé == il n'y aura aucun voisin == vérification de voisions futile
                    // -- CAS #2 : Nième mot placé == on passe par la tuile centrale qui est déjà occupé == voisin en tuile centrale
                }
            } else {
                if (!hasNeighbour) {
                    hasNeighbour = this.hasNeighbour(x, y);
                }
            }

            nextPos = action.placement.direction.charAt(0).toUpperCase() === Direction.Vertical ? ++y : ++x;
        }

        if (!hasCenterTile) {
            this.sendErrorMessage("Commande impossible à réaliser : Aucun mot n'est pas placé sur la tuile centrale");
            return false;
        }

        if (!hasNeighbour) {
            this.sendErrorMessage("Commande impossible à réaliser : Le mot placé n'est pas adjacent à un autre mot");
            return false;
        }

        if (!this.hasLettersInRack(action.player.letterRack, lettersNeeded)) {
            this.sendErrorMessage('Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées');
            return false;
        }
        this.sendSystemMessage(action.player.name + ' PLACE des lettres');
        return true;
    }

    private hasNeighbour(x: number, y: number): boolean {
        if (x + 1 < NUM_TILES) {
            if (this.board.board.grid[y][x + 1].letterObject.char !== ' ') {
                return true;
            }
        }
        if (x - 1 >= 0) {
            if (this.board.board.grid[y][x - 1].letterObject.char !== ' ') {
                return true;
            }
        }
        if (y + 1 < NUM_TILES) {
            if (this.board.board.grid[y + 1][x].letterObject.char !== ' ') {
                return true;
            }
        }
        if (y - 1 >= 0) {
            if (this.board.board.grid[y - 1][x].letterObject.char !== ' ') {
                return true;
            }
        }
        return false;
    }

    private validateExchangeLetter(action: ExchangeLetter): boolean {
        if (action.lettersToExchange.length > this.gameInfo.numberOfLettersRemaining) {
            this.sendErrorMessage('Commande impossible à réaliser : La réserve ne contient pas assez de lettres');
            return false;
        }

        let actionLetters = '';
        for (const letter of action.lettersToExchange) {
            actionLetters += letter.char;
        }

        if (!this.hasLettersInRack(action.player.letterRack, actionLetters)) {
            this.sendErrorMessage('Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées');
            return false;
        }
        this.sendSystemMessage(action.player.name + ' ÉCHANGE des lettres');
        return true;
    }

    private hasLettersInRack(rackLetters: Letter[], actionLetters: string): boolean {
        const rackChars = rackLetters.map((value) => value.char);
        const actionChars: string[] = actionLetters.split('');

        const rackCharsOccurences = new Map<string, number>();
        for (const char of rackChars) {
            const lowerChar = char.toLowerCase();
            let occurence = rackCharsOccurences.get(lowerChar);
            if (occurence) {
                occurence++;
                rackCharsOccurences.set(lowerChar, occurence);
            } else {
                rackCharsOccurences.set(lowerChar, 1);
            }
        }

        for (const char of actionChars) {
            const lowerChar = char.toLowerCase();
            let occurence = rackCharsOccurences.get(lowerChar);
            if (occurence === undefined || occurence === 0) {
                return false;
            }
            occurence--;
            rackCharsOccurences.set(lowerChar, occurence);
        }
        return true;
    }

    private validatePassTurn(action: PassTurn) {
        this.messageService.receiveSystemMessage(action.player.name + ' PASSE son tour');
        return true;
    }

    private sendErrorMessage(content: string) {
        this.messageService.receiveErrorMessage(content);
    }

    private sendSystemMessage(content: string) {
        this.messageService.receiveSystemMessage(content);
    }
}
