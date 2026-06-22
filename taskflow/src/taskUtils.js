import { CATS } from './taskData';

const today = new Date();
today.setHours(0, 0, 0, 0);

let nextId = 100;

export const todayISO = new Date().toISOString().split('T')[0];
export const getCat = value => CATS.find(cat => cat.v === value) || CATS[4];
export const isOvd = (date, status) => status !== 'done' && new Date(date + 'T00:00:00') < today;
export const fmtD = date => date ? new Date(date + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
export const nid = () => ++nextId;

export const dueLbl = (date, status) => {
  if (!date) return '';
  if (status === 'done') return fmtD(date);

  const diff = Math.ceil((new Date(date + 'T00:00:00') - today) / 864e5);

  if (diff < 0) {
    const days = Math.abs(diff);
    return `Venceu há ${days} dia${days === 1 ? '' : 's'}`;
  }
  if (diff === 0) return 'Vence hoje!';
  if (diff === 1) return 'Amanhã';

  return fmtD(date);
};
