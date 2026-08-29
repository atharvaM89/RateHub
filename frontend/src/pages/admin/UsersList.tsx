import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import Table from '../../components/Table.js';
import type { TableColumn } from '../../components/Table.js';
import Pagination from '../../components/Pagination.js';
import Input from '../../components/Input.js';
import Button from '../../components/Button.js';
import EmptyState from '../../components/EmptyState.js';

interface UserItem {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  isActive: boolean;
}

export const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Query Filters State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Sort State
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/users', {
        params: {
          page,
          limit: 10,
          name: name || undefined,
          email: email || undefined,
          address: address || undefined,
          role: role || undefined,
          sortBy,
          sortOrder,
        },
      });
      if (res.success && res.data) {
        setUsers(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleClearFilters = () => {
    setName('');
    setEmail('');
    setAddress('');
    setRole('');
    setPage(1);
    // Wait for state updates before calling API
    setTimeout(() => {
      fetchUsers();
    }, 0);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const columns: TableColumn<UserItem>[] = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Address', accessor: 'address', sortable: true },
    { 
      header: 'Role', 
      accessor: (u) => (
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
          u.role === 'ADMIN' 
            ? 'bg-purple-100 text-purple-800' 
            : u.role === 'STORE_OWNER' 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-blue-100 text-blue-800'
        }`}>
          {u.role}
        </span>
      ),
      sortable: true,
      sortByField: 'role'
    },
    {
      header: 'Status',
      accessor: (u) => (
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
        }`}>
          {u.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (u) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/admin/users/${u.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">User Profiles Management</h2>
        <Link to="/admin/users/new">
          <Button>Add User</Button>
        </Link>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <Input
          id="search-name"
          label="Name"
          placeholder="Filter by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="search-email"
          label="Email"
          placeholder="Filter by email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="search-address"
          label="Address"
          placeholder="Filter by address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex flex-col">
          <label htmlFor="search-role" className="text-sm font-medium text-slate-700 mb-1">
            Role
          </label>
          <select
            id="search-role"
            className="block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER (Normal)</option>
            <option value="STORE_OWNER">STORE OWNER</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" variant="primary" className="flex-1">
            Search
          </Button>
          <Button type="button" variant="secondary" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </form>

      {/* Users table */}
      {!loading && users.length === 0 ? (
        <EmptyState
          title="No users match your criteria"
          description="Try adjusting your filter settings or clear all filters to show all accounts."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={users}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            isLoading={loading}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={total}
            limit={10}
          />
        </>
      )}
    </div>
  );
};
export default UsersList;
