import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export interface IPreviewCard extends ICard {
    category: string;
    image: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class PreviewCard extends Card<IPreviewCard> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('preview:action');
        });
    }

    set category(value: string) {
        this._category.textContent = value;
        const mod = categoryMap[value as keyof typeof categoryMap];
        if (mod) {
            this._category.className = `card__category ${mod}`;
        }
    }

    set image(value: string) {
        this._image.src = value;
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}