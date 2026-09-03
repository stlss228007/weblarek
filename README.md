Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

src/ — исходные файлы проекта

src/components/ — папка с JS компонентами

src/components/base/ — папка с базовым кодом

Важные файлы:

index.html — HTML-файл главной страницы

src/types/index.ts — файл с типами

src/main.ts — точка входа приложения

src/scss/styles.scss — корневой файл стилей

src/utils/constants.ts — файл с константами

src/utils/utils.ts — файл с утилитами

Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

npm install
npm run dev
или

yarn
yarn dev
Сборка

npm run build
или

yarn build
Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model — слой данных, отвечает за хранение и изменение данных.

View — слой представления, отвечает за отображение данных на странице.

Presenter — презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события, используя методы как Моделей, так и Представлений.

Базовый код
Класс Component<T>
Является базовым классом для всех компонентов интерфейса. Класс является дженериком и принимает в переменной T тип данных, которые могут быть переданы в метод render для отображения.

Конструктор:
constructor(container: HTMLElement) — принимает ссылку на DOM элемент, за отображение которого он отвечает.

Поля класса:

container: HTMLElement — поле для хранения корневого DOM элемента компонента.

Методы:

render(data?: Partial<T>): HTMLElement — главный метод класса. Принимает данные для отображения, записывает их в поля класса и возвращает ссылку на DOM-элемент.

setImage(element: HTMLImageElement, src: string, alt?: string): void — утилитарный метод для модификации DOM-элементов <img>.

Класс Api
Содержит базовую логику отправки запросов.

Конструктор:
constructor(baseUrl: string, options: RequestInit = {}) — принимает базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:

baseUrl: string — базовый адрес сервера.

options: RequestInit — объект с заголовками для запросов.

Методы:

get(uri: string): Promise<object> — выполняет GET-запрос на указанный ендпоинт, возвращает промис с объектом ответа.

post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> — отправляет POST-запрос (или другой метод, если переопределён) с данными в теле запроса.

handleResponse(response: Response): Promise<object> — защищённый метод, проверяет ответ сервера и возвращает данные или отклоняет промис в случае ошибки.

Класс EventEmitter
Брокер событий, реализующий паттерн «Наблюдатель». Используется для связи слоёв.

Конструктор: не принимает параметров.

Поля:

_events: Map<string | RegExp, Set<Function>> — коллекция подписок на события.

Методы:

on<T extends object>(event: EventName, callback: (data: T) => void): void — подписка на событие.

emit<T extends object>(event: string, data?: T): void — инициализация события с передачей данных.

trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void — возвращает функцию, при вызове которой генерируется указанное событие.

Типы данных
В приложении используются следующие интерфейсы и типы (описаны в src/types/index.ts):

Товар (IProduct)

typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
Покупатель (IBuyer)

typescript
interface IBuyer {
  payment: TPayment | null;   // способ оплаты
  email: string;
  phone: string;
  address: string;
}
Способ оплаты (TPayment)

typescript
type TPayment = 'card' | 'cash';
Ошибки валидации (ValidationErrors)

typescript
type ValidationErrors = Partial<Record<keyof IBuyer, string>>;
Данные для отправки заказа (IOrderData)

typescript
interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];      // массив id товаров
}
Ответ сервера при успешном заказе (IOrderResult)

typescript
interface IOrderResult {
  id: string;
  total: number;
}
Ответ сервера при получении списка товаров (IProductList)

typescript
interface IProductList {
  total: number;
  items: IProduct[];
}
Модели данных
Модели отвечают за хранение данных и бизнес-логику, связанную с их изменением. Они не зависят от представления и коммуникационного слоя.

Класс Products (каталог товаров)
Назначение:
Хранит массив всех доступных товаров и выбранный для детального просмотра товар.

Конструктор:
constructor(events: IEvents) — принимает брокер событий для уведомления об изменениях.

Поля:

_items: IProduct[] — массив всех товаров.

_selectedProduct: IProduct | null — товар, выбранный для просмотра.

Методы:

setItems(items: IProduct[]): void — сохраняет массив товаров и генерирует событие products:changed.

getItems(): IProduct[] — возвращает все товары из каталога.

getProductById(id: string): IProduct | undefined — находит товар по идентификатору.

setSelectedProduct(product: IProduct): void — устанавливает выбранный товар и генерирует событие product:selected.

getSelectedProduct(): IProduct | null — возвращает выбранный товар.

Класс Basket (корзина)
Назначение:
Хранит товары, добавленные пользователем, и предоставляет методы для управления корзиной.

Конструктор:
constructor(events: IEvents) — принимает брокер событий.

Поля:

_items: IProduct[] — массив товаров в корзине.

Методы:

getItems(): IProduct[] — возвращает все товары в корзине.

addItem(product: IProduct): void — добавляет товар, если его ещё нет, и генерирует basket:changed.

removeItem(id: string): void — удаляет товар по id и генерирует basket:changed.

clear(): void — очищает корзину и генерирует basket:changed.

getTotalPrice(): number — возвращает общую стоимость (сумма цен).

getCount(): number — возвращает количество товаров.

contains(id: string): boolean — проверяет наличие товара по id.

Класс Buyer (данные покупателя)
Назначение:
Хранит и валидирует данные, введённые пользователем в формах оформления заказа.

Конструктор:
constructor(events: IEvents) — принимает брокер событий.

Поля:

_payment: TPayment | null — выбранный способ оплаты.

_address: string — адрес доставки.

_email: string — электронная почта.

_phone: string — номер телефона.

Методы:

setPayment(payment: TPayment): void — устанавливает способ оплаты и генерирует buyer:changed.

setAddress(address: string): void — устанавливает адрес и генерирует buyer:changed.

setEmail(email: string): void — устанавливает email и генерирует buyer:changed.

setPhone(phone: string): void — устанавливает телефон и генерирует buyer:changed.

getBuyerData(): { payment: TPayment; email: string; phone: string; address: string } — возвращает все данные покупателя для отправки на сервер.

clear(): void — очищает все поля и генерирует buyer:changed.

validate(): ValidationErrors — проверяет корректность заполнения всех полей. Возвращает объект с ошибками (пустой, если ошибок нет).

Компоненты представления (View)
Компоненты представления отвечают за отображение данных и взаимодействие с пользователем. Они не содержат бизнес-логики и только уведомляют о действиях пользователя через события. Все классы представления наследуются от базового класса Component<T>.

Класс Modal
Назначение: Управляет модальным окном: открытие, закрытие, установка содержимого.

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:

_content: HTMLElement — контейнер для содержимого модального окна (.modal__content).

_closeButton: HTMLElement — кнопка закрытия.

_events: IEvents — брокер событий.

Методы:

set content(value: HTMLElement): void — устанавливает содержимое модального окна.

open(): void — открывает модальное окно (добавляет класс modal_active, блокирует скролл).

close(): void — закрывает модальное окно.

render(data: HTMLElement): HTMLElement — устанавливает содержимое и открывает окно, возвращает корневой элемент.

get isOpen(): boolean — возвращает true, если модальное окно открыто.

Генерируемые события:

modal:open — при открытии.

modal:close — при закрытии.

Класс Card (абстрактный)
Назначение: Базовый класс для всех видов карточек товара. Содержит общие поля и методы.

Конструктор: protected constructor(container: HTMLElement, actions?: ICardActions)

Поля:

_title: HTMLElement

_price: HTMLElement

_category?: HTMLElement

_image?: HTMLImageElement

_button?: HTMLButtonElement

_actions?: ICardActions — объект с колбэком onClick.

Методы:

set id(value: string): void

get id(): string

set title(value: string): void

set price(value: number | null): void

set category(value: string): void — устанавливает категорию и соответствующий модификатор.

set image(value: string): void

set buttonText(value: string): void

set buttonDisabled(value: boolean): void

Класс CatalogCard
Назначение: Карточка товара для отображения в каталоге. Наследует Card. Вся карточка является кнопкой, при клике на которую вызывается actions.onClick.

Конструктор: constructor(container: HTMLElement, actions?: ICardActions)

Класс PreviewCard
Назначение: Карточка товара для отображения в модальном окне с детальной информацией. Наследует Card.

Поля:

_description: HTMLElement

Методы:

set description(value: string): void

Класс BasketCard
Назначение: Карточка товара для отображения в корзине. Наследует Card.

Поля:

_index: HTMLElement — номер товара в списке.

Методы:

set index(value: number): void

Класс Basket
Назначение: Отображает корзину: список товаров, общую стоимость, кнопку оформления.

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:

_list: HTMLElement — контейнер списка (.basket__list).

_totalPrice: HTMLElement — элемент общей стоимости (.basket__price).

_orderButton: HTMLButtonElement — кнопка "Оформить".

_events: IEvents

Методы:

set items(items: HTMLElement[]): void — отображает список карточек.

set totalPrice(value: number): void — обновляет общую стоимость.

set buttonDisabled(value: boolean): void — блокирует/разблокирует кнопку.

render(data?: Partial<IBasketView>): HTMLElement — обновляет состояние корзины.

Генерируемые события:

order:create — при клике на кнопку "Оформить".

Класс Form<T> (абстрактный)
Назначение: Базовый класс для форм. Обрабатывает ввод и валидацию.

Конструктор: protected constructor(container: HTMLFormElement, events: IEvents)

Поля:

_form: HTMLFormElement

_submitButton: HTMLButtonElement

_errors: HTMLElement — контейнер для ошибок.

_events: IEvents

Методы:

set valid(value: boolean): void — активирует/деактивирует кнопку сабмита.

set errors(value: string): void — выводит сообщение об ошибке.

render(data?: Partial<T> & { valid?: boolean, errors?: string }): HTMLElement

Генерируемые события: при изменении любого поля генерируется событие с именем [formName]:[fieldName], например order:address.

Класс OrderForm
Назначение: Форма первого шага оформления заказа (выбор оплаты и адрес). Наследует Form<IOrderForm>.

Поля:

_paymentButtons: HTMLButtonElement[] — кнопки выбора способа оплаты.

Методы:

set payment(value: TPayment): void — устанавливает активную кнопку оплаты.

set address(value: string): void

Генерируемые события:

order:payment — при выборе способа оплаты.

order:address — при изменении поля адреса.

order:submit — при сабмите формы (кнопка "Далее").

Класс ContactsForm
Назначение: Форма второго шага оформления (email и телефон). Наследует Form<IContactsForm>.

Методы:

set email(value: string): void

set phone(value: string): void

Генерируемые события:

contacts:email — при изменении email.

contacts:phone — при изменении телефона.

contacts:submit — при сабмите формы (кнопка "Оплатить").

Класс Success
Назначение: Отображает сообщение об успешной оплате.

Конструктор: constructor(container: HTMLElement, actions: { onClick: () => void })

Поля:

_description: HTMLElement — описание с суммой списания.

_closeButton: HTMLButtonElement

Методы:

set total(value: number): void — устанавливает сумму в описании.

Генерируемые события: не генерирует, вызывает переданный колбэк при клике на кнопку.

Класс Page
Назначение: Управляет элементами главной страницы (счетчик корзины, каталог).

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:

_counter: HTMLElement — счетчик товаров.

_gallery: HTMLElement — контейнер каталога.

_basketButton: HTMLElement — кнопка открытия корзины.

Методы:

set counter(value: number): void

set gallery(items: HTMLElement[]): void

Генерируемые события:

basket:open — при клике на иконку корзины.

События приложения
В приложении используются следующие события, которые обеспечивают взаимодействие между слоями:

Событие	Источник	Описание
products:changed	Products	Изменился список товаров в каталоге
product:selected	Products	Выбран товар для просмотра
basket:changed	Basket	Изменилось содержимое корзины
basket:open	Page, Basket	Пользователь открыл корзину
basket:render	Презентер	Обновить отображение корзины (если открыта)
order:create	Basket	Нажата кнопка "Оформить"
order:payment	OrderForm	Выбран способ оплаты
order:address	OrderForm	Изменён адрес доставки
order:submit	OrderForm	Отправлена форма первого шага
contacts:email	ContactsForm	Изменён email
contacts:phone	ContactsForm	Изменён телефон
contacts:submit	ContactsForm	Отправлена форма контактов
buyer:changed	Buyer	Изменились данные покупателя
modal:open	Modal	Модальное окно открыто
modal:close	Modal	Модальное окно закрыто
Слой коммуникации
Класс AppApi
Назначение:
Обеспечивает взаимодействие с сервером. Использует композицию: принимает в конструкторе объект, реализующий интерфейс IApi, и делегирует ему выполнение HTTP-запросов. Это соответствует принципу инверсии зависимостей.

Конструктор:
constructor(api: IApi) — принимает экземпляр, удовлетворяющий интерфейсу IApi (с методами get и post).

Поля:

_api: IApi — ссылка на объект для выполнения запросов.

Методы:

getProducts(): Promise<IProductList> — выполняет GET-запрос к эндпоинту /product/, возвращает список товаров.

postOrder(order: IOrderData): Promise<IOrderResult> — выполняет POST-запрос к эндпоинту /order/ с данными заказа, возвращает результат (ID и итоговую сумму).

Презентер
Презентер реализован в файле src/main.ts. Он связывает модели, компоненты представления и API через события. Презентер подписывается на события от моделей и представлений, обрабатывает их и вызывает соответствующие методы для обновления данных и отображения. Весь код презентера написан в функциональном стиле с использованием замыканий, что позволяет сохранить простоту и читаемость приложения.

Основные обязанности презентера:

Инициализация всех компонентов и моделей.

Подписка на события и организация их обработки.

Управление потоком данных между моделями и представлениями.

Обработка действий пользователя (открытие корзины, выбор товара, оформление заказа и т.д.).

Взаимодействие с API для получения товаров и отправки заказов.

Тестирование
В src/main.ts создаются экземпляры всех моделей и AppApi, выполняются методы, а результаты выводятся в консоль с поясняющими комментариями. Это позволяет убедиться в корректной работе слоя данных и API до написания представления. В финальной версии приложения тестирование осуществляется через пользовательский интерфейс.

Запуск проекта
Установите зависимости:
npm install

Создайте в корне файл .env со строкой:
VITE_API_ORIGIN=https://larek-api.nomoreparties.co

Запустите режим разработки:
npm run dev