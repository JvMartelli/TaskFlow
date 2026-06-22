export const CATS = [
  { v: 'trabalho', l: 'Trabalho', c: '#6366f1' },
  { v: 'pessoal', l: 'Pessoal', c: '#ec4899' },
  { v: 'estudo', l: 'Estudo', c: '#f59e0b' },
  { v: 'saude', l: 'Saúde', c: '#10b981' },
  { v: 'outros', l: 'Outros', c: '#64748b' },
];

export const PRI = {
  critical: { l: 'Crítica', c: '#ef4444', bg: '#fee2e2', b: '#fca5a5' },
  high: { l: 'Alta', c: '#f97316', bg: '#ffedd5', b: '#fed7aa' },
  medium: { l: 'Média', c: '#d97706', bg: '#fef9c3', b: '#fde68a' },
  low: { l: 'Baixa', c: '#16a34a', bg: '#dcfce7', b: '#86efac' },
};

export const STA = {
  pending: { l: 'Pendente', c: '#64748b', bg: '#f1f5f9', b: '#cbd5e1' },
  'in-progress': { l: 'Em Andamento', c: '#6366f1', bg: '#eef2ff', b: '#c7d2fe' },
  done: { l: 'Concluída', c: '#059669', bg: '#d1fae5', b: '#6ee7b7' },
};

export const SEED = [
  { id: 1, title: 'Revisar relatório mensal', desc: 'Analisar dados financeiros de maio e preparar resumo executivo para a diretoria.', due: '2026-06-18', pri: 'high', cat: 'trabalho', sta: 'in-progress', created: '2026-06-10' },
  { id: 2, title: 'Estudar para prova de Cálculo', desc: 'Revisão dos capítulos 5 a 8. Foco em integrais e derivadas parciais.', due: '2026-06-17', pri: 'critical', cat: 'estudo', sta: 'pending', created: '2026-06-12' },
  { id: 3, title: 'Consulta médica anual', desc: 'Check-up com clínico geral. Levar exames e lista de medicamentos.', due: '2026-06-25', pri: 'medium', cat: 'saude', sta: 'pending', created: '2026-06-08' },
  { id: 4, title: 'Comprar presentes de aniversário', desc: 'Presentes para o aniversário da Ana no dia 20.', due: '2026-06-20', pri: 'medium', cat: 'pessoal', sta: 'pending', created: '2026-06-14' },
  { id: 5, title: 'Configurar ambiente de dev', desc: 'Instalar Node.js, VS Code e extensões para o novo projeto.', due: '2026-06-14', pri: 'high', cat: 'trabalho', sta: 'done', created: '2026-06-09' },
  { id: 6, title: 'Leitura: Clean Code', desc: 'Ler capítulos 3 e 4 de Robert C. Martin.', due: '2026-06-22', pri: 'low', cat: 'estudo', sta: 'in-progress', created: '2026-06-11' },
  { id: 7, title: 'Planejar viagem de férias', desc: 'Pesquisar destinos, passagens e hotéis para julho.', due: '2026-06-30', pri: 'low', cat: 'pessoal', sta: 'pending', created: '2026-06-13' },
];
