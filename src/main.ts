import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { Basket as BasketView } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';

import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { IOrderData, TPayment } from './types';

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const appApi = new AppApi(api);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketViewTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const basketView = new BasketView(cloneTemplate(basketViewTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);
const previewCard = new PreviewCard(cloneTemplate(previewTemplate), events);

appApi.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
    });

events.on('products:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
        const card = new CatalogCard(cloneTemplate(catalogTemplate), {
            onClick: () => {
                events.emit('card:select', { id: item.id });
            }
        });
        card.render({
            title: item.title,
            price: item.price,
            category: item.category,
            image: CDN_URL + item.image,
        });
        return card.render();
    });
    gallery.items = cards;
});

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        productsModel.setSelectedProduct(product);
    }
});

events.on('product:selected', () => {
    const item = productsModel.getSelectedProduct();
    if (!item) return;

    const isInBasket = basketModel.contains(item.id);
    let buttonText = 'В корзину';
    let buttonDisabled = false;

    if (item.price === null) {
        buttonDisabled = true;
        buttonText = 'Недоступно';
    } else if (isInBasket) {
        buttonText = 'Удалить из корзины';
    }

    previewCard.render({
        title: item.title,
        price: item.price,
        category: item.category,
        image: CDN_URL + item.image,
        description: item.description,
        buttonText,
        buttonDisabled,
    });

    modal.render({ content: previewCard.render() });
});

events.on('preview:action', () => {
    const item = productsModel.getSelectedProduct();
    if (!item) return;

    if (basketModel.contains(item.id)) {
        basketModel.removeItem(item.id);
    } else {
        basketModel.addItem(item);
    }
    modal.close();
});

events.on('basket:changed', () => {
    const items = basketModel.getItems();
    header.counter = items.length;

    const cards = items.map((item, index) => {
        const card = new BasketCard(cloneTemplate(basketTemplate), {
            onClick: () => {
                events.emit('basket:remove', { id: item.id });
            }
        });
        card.render({
            title: item.title,
            price: item.price,
            index: index + 1,
        });
        return card.render();
    });

    basketView.items = cards;
    basketView.totalPrice = basketModel.getTotalPrice();
    basketView.buttonDisabled = items.length === 0;
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('basket:open', () => {
    basketView.buttonDisabled = basketModel.getCount() === 0;
    modal.render({ content: basketView.render() });
});

events.on('basket:submit', () => {
    const buyerData = buyerModel.getBuyerData();
    orderForm.payment = buyerData.payment;
    orderForm.address = buyerData.address;
    modal.render({ content: orderForm.render() });
});

events.on('buyer:changed', () => {
    const data = buyerModel.getBuyerData();
    const errors = buyerModel.validate();

    orderForm.payment = data.payment;
    orderForm.address = data.address;
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;

    const orderErrors = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = orderErrors.join('; ');

    const contactsErrors = [];
    if (errors.email) contactsErrors.push(errors.email);
    if (errors.phone) contactsErrors.push(errors.phone);
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = contactsErrors.join('; ');
});

events.on('order:payment', (data: { payment: TPayment }) => {
    buyerModel.setPayment(data.payment);
});

events.on('order:address', (data: { value: string }) => {
    buyerModel.setAddress(data.value);
});

events.on('order:submit', () => {
    const buyerData = buyerModel.getBuyerData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    modal.render({ content: contactsForm.render() });
});

events.on('contacts:email', (data: { value: string }) => {
    buyerModel.setEmail(data.value);
});

events.on('contacts:phone', (data: { value: string }) => {
    buyerModel.setPhone(data.value);
});

events.on('contacts:submit', () => {
    const buyer = buyerModel.getBuyerData();
    const orderData: IOrderData = {
        payment: buyer.payment!,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id),
    };

    appApi.postOrder(orderData)
        .then(result => {
            basketModel.clear();
            buyerModel.clear();
            successView.total = result.total;
            modal.render({ content: successView.render() });
        })
        .catch(err => {
            console.error('Ошибка отправки заказа:', err);
            contactsForm.errors = 'Не удалось отправить заказ. Попробуйте позже.';
        });
});

events.on('success:close', () => {
    modal.close();
});

basketModel.clear();
buyerModel.clear();