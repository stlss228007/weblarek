import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.contains(product.id)) {
            this._items.push(product);
            this.events.emit('basket:changed');
        }
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}