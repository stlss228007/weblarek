import { Card, ICard, ICardActions } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICatalogCard extends ICard {
    category: string;
    image: string;
}

export class CatalogCard extends Card<ICatalogCard> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, protected actions?: ICardActions) {
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', (evt) => {
            if (this.actions?.onClick) {
                this.actions.onClick(evt);
            }
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
}