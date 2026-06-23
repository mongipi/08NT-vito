'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'

interface Props {
  user: { name?: string | null; email?: string | null }
  children: React.ReactNode
}

export function AdminShell({ user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#f1f3f5' }}>
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 40,
          }}
          className="md:hidden"
        />
      )}

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <AdminTopbar user={user} onMenuClick={() => setSidebarOpen(o => !o)} />
        <main className="admin-main">
          {children}
        </main>
      </div>

      <style>{`
        .admin-main {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1rem;
        }
        @media (min-width: 48rem) {
          .admin-main { padding: 1.75rem 2rem; }
        }
      `}</style>
    </div>
  )
}
