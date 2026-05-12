import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { userService } from './api/userService';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import Toolbar from './components/Toolbar';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';
import ConfirmModal from './components/ConfirmModal';
import ToastContainer from './components/ToastContainer';
import Pagination from './components/Pagination';

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 350;

function App() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState(null); // user being edited, or {} for new
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toastIdRef = useRef(0);
  const pushToast = useCallback((message, type = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(filters.search.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [filters.search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined,
    }),
    [page, debouncedSearch, filters.role, filters.status]
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.list(queryParams);
      setUsers(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
    } catch (err) {
      pushToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [queryParams, pushToast]);

  const loadStats = useCallback(async () => {
    try {
      const data = await userService.stats();
      setStats(data);
    } catch (_) { /* non-blocking */ }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, filters.role, filters.status]);

  const handleSave = async (formData) => {
    try {
      if (editing && editing.id) {
        await userService.update(editing.id, formData);
        pushToast('User updated successfully', 'success');
      } else {
        await userService.create(formData);
        pushToast('User created successfully', 'success');
      }
      setEditing(null);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      pushToast(err.message, 'error');
      throw err; // keep modal open
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await userService.remove(confirmDelete.id);
      pushToast('User deleted', 'success');
      setConfirmDelete(null);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      pushToast(err.message, 'error');
    }
  };

  return (
    <div className="app">
      <Header onAdd={() => setEditing({})} />

      <main className="container">
        <section className="page-head">
          <div>
            <h1>Users</h1>
            <p className="muted">Manage all members, roles and permissions.</p>
          </div>
        </section>

        <StatsCards stats={stats} />

        <div className="card">
          <Toolbar
            filters={filters}
            onChange={setFilters}
            onAdd={() => setEditing({})}
            total={pagination.total}
          />

          <UserTable
            users={users}
            loading={loading}
            onEdit={(u) => setEditing(u)}
            onDelete={(u) => setConfirmDelete(u)}
          />

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            limit={pagination.limit}
            onChange={setPage}
          />
        </div>
      </main>

      {editing && (
        <UserFormModal
          user={editing.id ? editing : null}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete user"
          message={`Are you sure you want to delete ${confirmDelete.firstName} ${confirmDelete.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
