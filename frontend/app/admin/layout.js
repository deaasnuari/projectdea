import AdminShell from '@/components/admin/AdminShell'
import AdminAuthGate from '@/components/admin/AdminAuthGate'

export const metadata = {
  title: 'Panel Admin — Lazis PLN Batam',
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  )
}
