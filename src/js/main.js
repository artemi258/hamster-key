import '../style/global.scss';
import { generateKey } from './generateKey';

window.addEventListener('DOMContentLoaded', () => {
 //  const btn = document.querySelector('.btn');
 const spinner = document.querySelector('.spinner');
 const btn2 = document.querySelector('.btn2');
 const table = document.querySelector('.table');
 const spinnerText = document.querySelector('.spinnerText');
 const img = document.querySelector('.img');

 const configs = [
  {
   name: 'Merge Away',
   appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
   promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
  },
  {
   name: 'Chain Cube',
   appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
   promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
  },

  {
   name: 'Train Miner',
   appToken: '82647f43-3f87-402d-88dd-09a90025313f',
   promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
  },
  {
   name: 'Twerk Race',
   appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
   promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
  },
  {
   name: 'Polysphere',
   appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
   promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
  },
  {
   name: 'Mow and Trim',
   appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
   promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
  },
  {
   name: 'Mud Racing',
   appToken: '8814a785-97fb-4177-9193-ca4180ff9da8',
   promoId: '8814a785-97fb-4177-9193-ca4180ff9da8',
  },
  {
   name: 'Zoopolis',
   appToken: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
   promoId: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
  },
 ];

 configs.forEach((item) => {
  const wrap = document.createElement('div');
  const ol = document.createElement('ol');
  const title = document.createElement('h2');
  title.textContent = item.name;
  ol.setAttribute('data-name', `${item.name}`);
  wrap.append(title);
  wrap.append(ol);
  table.append(wrap);
 });

 //  btn.addEventListener('click', () => {
 //   generateKey();
 //  });

 btn2.addEventListener('click', async () => {
  let count = 8;
  spinner.style.display = 'block';
  spinnerText.textContent = `генерация ключей... осталось ${count} партий ключей`;
  btn2.disabled = 'true';
  img.style.display = 'none';

  for (count; count > 0; count--) {
   const promises = configs.map((elem) => generateKey(elem));
   await Promise.allSettled(promises)
    .then((res) => {
     for (let { status, value } of res) {
      if (status === 'fulfilled') {
       const { name, promoCode } = value;
       const elem = document.createElement('li');
       elem.textContent = promoCode;
       const wrapper = document.querySelector(`[data-name="${name}"`);
       wrapper.append(elem);
       if (!count) {
        spinner.style.display = 'none';
        spinnerText.textContent = `ГОТОВО!`;
        img.style.display = 'block';
       } else {
        spinnerText.textContent = `генерация ключей... осталось ${count} партий ключей`;
       }
      }
     }
    })
    .catch((err) => console.log(err));
  }
 });
});
