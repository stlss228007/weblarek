import { Form } from './Form';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';
import { IEvents } from '../base/Events';

export interface IOrderForm {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.events.emit('order:payment', { payment });
            });
        });
    }

    set payment(value: TPayment | null) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}