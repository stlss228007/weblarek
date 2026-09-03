import { IBuyer, TPayment, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    constructor(protected events: IEvents) {}

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.events.emit('buyer:changed');
    }

    setAddress(address: string): void {
        this._address = address;
        this.events.emit('buyer:changed');
    }

    setEmail(email: string): void {
        this._email = email;
        this.events.emit('buyer:changed');
    }

    setPhone(phone: string): void {
        this._phone = phone;
        this.events.emit('buyer:changed');
    }

    getBuyerData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('buyer:changed');
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};
        if (!this._payment) errors.payment = 'Не выбран способ оплаты';
        if (!this._address.trim()) errors.address = 'Введите адрес доставки';
        if (!this._email.trim()) errors.email = 'Укажите email';
        if (!this._phone.trim()) errors.phone = 'Укажите телефон';
        return errors;
    }
}