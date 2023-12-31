import en from '../i18n/en.json'
import ua from '../i18n/ua.json'
import {createI18n} from 'vue-i18n'



const languages = {
    en,
    ua
}

const messages = Object.assign(languages)

export const i18n = createI18n({
  legacy: false,
  locale: 'ua',
  messages,
})
