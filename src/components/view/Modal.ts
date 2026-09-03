// src/components/view/Modal.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton = ensureElement<HTMLElement>('.modal__close', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this._onOverlayClick.bind(this));
    }

    private _onOverlayClick(event: MouseEvent) {
        if (event.target === this.container) {
            this.close();
        }
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }

    render(data: Partial<IModal>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}