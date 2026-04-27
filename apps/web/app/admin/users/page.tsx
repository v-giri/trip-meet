'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { Search, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const load = async () => {
    setLoading(true)
    const { data, count } = await supabase
      .from('profiles')
      .select('*, bookings(count)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    setUsers(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page])

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change this user's role to "${newRole}"?`)) return
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    load()
  }

  const filtered = search
    ? users.filter(u =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.id?.includes(search)
      )
    : users

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">{total} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ID…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Bookings</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">
                        {u.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.full_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400 font-mono">{u.id.slice(-10)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">
                      {Array.isArray(u.bookings) ? u.bookings[0]?.count ?? 0 : 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      onClick={() => toggleRole(u.id, u.role || 'user')}
                      className={`p-2 rounded-lg transition ${u.role === 'admin' ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                    >
                      {u.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-400 py-12">No users match your search.</p>
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Page {page + 1} of {pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
