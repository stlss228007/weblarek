import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected _counter: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basketButton = ensureElement<HTMLElement>('.header__basket', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }
}