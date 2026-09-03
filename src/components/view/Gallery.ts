import { Component } from '../base/Component';

export interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected _container: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._container = container;
    }

    set items(value: HTMLElement[]) {
        this._container.replaceChildren(...value);
    }
}