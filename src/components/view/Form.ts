import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected _form: HTMLFormElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._form = container;
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this._form.name}:submit`);
        });

        this._form.addEventListener('input', (evt) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit(`${this._form.name}:${String(field)}`, { field, value });
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    render(data?: Partial<T> & { valid?: boolean; errors?: string }): HTMLElement {
        return super.render(data);
    }
}