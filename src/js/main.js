import { v4 as uuidv4 } from 'uuid';

import '../style/global.scss';

window.addEventListener('DOMContentLoaded', () => {
 const APP_TOKEN = 'd28721be-fd2d-4b45-869e-9f253b554e50';
 const PROMO_ID = '43e35910-c168-4634-ad4f-52fd764a843f';

 const wrapper = document.querySelector('.keys');
 const spinner = document.querySelector('.spinner');
 const btn = document.querySelector('.btn');
 const img = document.querySelector('.img');

 const generateClientId = () => {
  const timestamp = Date.now();
  const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
  return `${timestamp}-${randomNumbers}`;
 };

 const getClientToken = async () => {
  spinner.textContent = 'получение токена клиента...';
  const id = generateClientId();
  const body = {
   appToken: APP_TOKEN,
   clientId: id,
   clientOrigin: 'deviceid',
  };

  await fetch('https://api.gamepromo.io/promo/login-client', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(body),
  })
   .then((res) => res.json())
   .then(({ clientToken }) => {
    console.log('clientToken', clientToken);
    registerEvent(clientToken);
   })
   .catch((err) => {
    btn.disabled = '';

    spinner.textContent = 'Ошибка! Не удалось создать токен клиента';
    console.log(`не удалось создать clientToken. Ошибка: ${err}`);
   });
 };
 const registerEvent = async (token) => {
  spinner.textContent = 'регистрация события... Может занять до 3мин';

  const body = {
   promoId: PROMO_ID,
   eventId: uuidv4(),
   eventOrigin: 'undefined',
  };

  console.log('EVENT', token);
  const codeInterval = setInterval(async () => {
   await fetch('https://api.gamepromo.io/promo/register-event', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
   })
    .then((res) => res.json())
    .then(({ hasCode }) => {
     console.log(`hasCode: ${hasCode}`);
     if (hasCode) {
      generateKey(token);
      clearInterval(codeInterval);
     }
    })
    .catch((err) => {
     btn.disabled = '';
     spinner.textContent = 'Ошибка! Не удалось зарегистрировать событие';
     console.log(`не удалось зарегистрировать событие. Ошибка: ${err}`);
    });
  }, 25000);
 };

 const generateKey = async (token) => {
  spinner.textContent = 'генерация ключа...';
  const body = {
   promoId: PROMO_ID,
  };

  await fetch('https://api.gamepromo.io/promo/create-code', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
   },
   body: JSON.stringify(body),
  })
   .then((res) => res.json())
   .then(({ promoCode }) => {
    const elem = document.createElement('li');
    elem.textContent = promoCode;

    wrapper.append(elem);
    img.style.display = 'block';
    spinner.textContent = 'готово!';
    btn.disabled = '';
   })
   .catch((err) => {
    btn.disabled = '';
    spinner.textContent = 'Ошибка! Не удалось сгенерировать ключ';
    console.log(`не удалось сгенерировать ключ. Ошибка: ${err}`);
   });
 };

 const start = () => {
  btn.disabled = 'true';
  getClientToken();
 };

 btn.addEventListener('click', start);
});
