import '../style/global.scss';
import { generateKey } from './generateKey';

window.addEventListener('DOMContentLoaded', () => {
 const btn = document.querySelector('.btn');
 const btn2 = document.querySelector('.btn2');

 btn.addEventListener('click', generateKey);

 btn2.addEventListener('click', () => {
  generateKey(4);
 });
});
