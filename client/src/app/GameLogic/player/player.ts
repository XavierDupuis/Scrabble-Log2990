import { Action } from '@app/GameLogic/actions/action';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Subject } from 'rxjs';

export abstract class Player {
    static defaultName = 'QWERTY';
    action$: Subject<Action> = new Subject();
    // nextAction: Action;

    points: number = 0;
    name: string = Player.defaultName;
    isActive: boolean;
    letterRack: Letter[];

    constructor(name?: string) {
        if (name) {
            this.name = name;
        }
    }

    abstract play(): void;
    abstract exchange(): void;
    abstract pass(): void;

    get isLetterRackEmpty(): boolean {
        return this.letterRack.length === 0;
    }

    get isLetterRackFull(): boolean {
        return this.letterRack.length === LetterBag.playerLetterCount;
    }
}
