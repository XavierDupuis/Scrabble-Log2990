import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { User } from '@app/GameLogic/player/user';

@Injectable({
    providedIn: 'root',
})
export class ActionCompilerService {
    private letterFactory: LetterCreator = new LetterCreator();

    constructor(private gameInfo: GameInfoService) {}

    // TODO: use player service to feed new action and get user
    translate(command: Command): Action {
        // TODO: get user from player service
        const user = this.gameInfo.user;
        const args = command.args;
        switch (command.type) {
            case CommandType.Exchange:
                return this.createExchangeLetter(user, args);

            case CommandType.Pass:
                return this.createPassTurn(user);

            case CommandType.Place:
                return this.createPlaceLetter(user, args);
            default:
                throw Error('this command dont generate an action');
        }
    }

    private createPassTurn(user: User): PassTurn {
        return new PassTurn(user);
    }

    private createExchangeLetter(user: User, args: string[] | undefined): ExchangeLetter {
        // TODO: user.getLettersFromRack(letters);
        if (!args) {
            throw new Error('No argument was given for exchange letter creation');
        }
        console.log(args);
        const letters = args[0].split('');
        const lettersToExchange: Letter[] = this.letterFactory.createLetters(letters);
        console.log(lettersToExchange);
        return new ExchangeLetter(user, lettersToExchange);
    }

    private createPlaceLetter(user: User, args: string[] | undefined) {
        if (!args) {
            throw Error('No argument was given for place letter creation');
        }
        const PLACE_LETTER_ARGS_LENGTH = 4;
        if (args.length !== PLACE_LETTER_ARGS_LENGTH) {
            throw Error('Invalid number of arguments');
        }
        const placementArguments = args.slice(0, args.length - 1);
        const placementSettings = this.createPlacementSettings(placementArguments);
        const word = args[args.length - 1];
        return new PlaceLetter(user, word, placementSettings);
    }

    private createPlacementSettings(placementArgs: string[]): PlacementSetting {
        if (placementArgs.length !== 3) {
            throw Error('arg invalid for creating placementSetting');
        }
        const xString = placementArgs[1];
        const x = Number.parseInt(xString, 10) - 1;
        const y = placementArgs[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const direction = placementArgs[2].toUpperCase();
        return { x, y, direction };
    }
}
