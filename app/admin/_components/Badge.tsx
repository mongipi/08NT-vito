const variants: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  paid:      'bg-blue-50 text-blue-700 border-blue-200',
  shipped:   'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  consumer:  'bg-slate-50 text-slate-600 border-slate-200',
  b2b:       'bg-indigo-50 text-indigo-700 border-indigo-200',
  admin:     'bg-[#0b1e12]/10 text-[#0b1e12] border-[#0b1e12]/20',
  active:    'bg-green-50 text-green-700 border-green-200',
  inactive:  'bg-slate-50 text-slate-500 border-slate-200',
  unsubscribed: 'bg-slate-50 text-slate-500 border-slate-200',
}

const labels: Record<string, string> = {
  pending: 'In attesa', paid: 'Pagato', shipped: 'Spedito',
  delivered: 'Consegnato', cancelled: 'Annullato',
  consumer: 'Consumer', b2b: 'B2B', admin: 'Admin',
  active: 'Attivo', inactive: 'Inattivo',
  unsubscribed: 'Disiscritto',
}

export function Badge({ value }: { value: string }) {
  const cls = variants[value] ?? 'bg-slate-50 text-slate-600 border-slate-200'
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {labels[value] ?? value}
    </span>
  )
}
