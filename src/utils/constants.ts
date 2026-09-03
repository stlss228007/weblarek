export const API_URL = import.meta.env.VITE_API_ORIGIN
    ? `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`
    : 'https://larek-api.nomoreparties.co/api/weblarek';

export const CDN_URL = import.meta.env.VITE_API_ORIGIN
    ? `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`
    : 'https://larek-api.nomoreparties.co/content/weblarek';

export const categoryMap = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
};

export const settings = {};