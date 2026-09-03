import { IApi, IProductList, IOrderData, IOrderResult } from '../types';

export class AppApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProducts(): Promise<IProductList> {
        return this._api.get<IProductList>('/product/');
    }

    postOrder(order: IOrderData): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order/', order);
    }
}
