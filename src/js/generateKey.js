import { v4 as uuidv4 } from 'uuid';

export const generateKey = async ({ name, appToken, promoId }) => {
 const APP_TOKEN = appToken;
 const PROMO_ID = promoId;
 let i = 1;
 return await new Promise((res, rej) => {
  const attemptCounter = (text) => {
   if (i === 4) {
    rej(text);
   } else {
    i++;
    console.log(`Name: ${name}, попытка №${i}`);
    generateRec();
   }
  };

  const generateRec = () => {
   const generateClientId = () => {
    const timestamp = Date.now();
    const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
    return `${timestamp}-${randomNumbers}`;
   };

   const getClientToken = async () => {
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
      if (clientToken) {
       registerEvent(clientToken);
      } else {
       attemptCounter('не удалось создать clientToken.');
      }
     })
     .catch(() => {
      attemptCounter('не удалось создать clientToken.');
     });
   };
   const registerEvent = async (token) => {
    const body = {
     promoId: PROMO_ID,
     eventId: uuidv4(),
     eventOrigin: 'undefined',
    };

    let count = 1;

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
       } else {
        if (count === 10) {
         clearInterval(codeInterval);
         throw new Error();
        }
        count++;
       }
      })
      .catch((err) => {
       clearInterval(codeInterval);
       attemptCounter(`не удалось зарегистрировать событие. Ошибка: ${err}`);
      });
    }, 25000);
   };

   const generateKey = async (token) => {
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
      res({ name, promoCode });
     })
     .catch((err) => {
      attemptCounter(`не удалось сгенерировать ключ. Ошибка: ${err}`);
     });
   };

   const start = () => {
    getClientToken();
   };

   start();
  };

  generateRec();
 });
};
