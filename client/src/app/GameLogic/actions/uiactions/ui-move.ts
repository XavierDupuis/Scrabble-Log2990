import { Action } from '@app/GameLogic/actions/action';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { Player } from '@app/GameLogic/player/player';

export class UIMove implements UIAction {
    get canBeCreated(): boolean {
        throw new Error('Method not implemented.');
    }
    receiveRightClick(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    receiveLeftClick(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    receiveKey(key: string): void {
        throw new Error('Method not implemented.');
    }
    create(player: Player): Action {
        throw new Error('Method not implemented.');
    }
}
