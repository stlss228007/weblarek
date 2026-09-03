import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IBasketView {
    items: HTMLElement[];
    totalPrice: number;
    buttonDisabled: boolean;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);
        this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._orderButton.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set items(value: HTMLElement[]) {
        this._list.replaceChildren(...value);
    }

    set totalPrice(value: number) {
        this._totalPrice.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this._orderButton.disabled = value;
    }
}