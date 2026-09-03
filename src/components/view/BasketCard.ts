import { Card, ICard, ICardActions } from './Card';
import { ensureElement } from '../../utils/utils';

export interface IBasketCard extends ICard {
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions?: ICardActions) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this._deleteButton.addEventListener('click', (evt) => {
            evt.stopPropagation();
            if (this.actions?.onClick) {
                this.actions.onClick(evt);
            }
        });
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}