import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import Table from '../../components/Table.js';
import type { TableColumn } from '../../components/Table.js';
import Pagination from '../../components/Pagination.js';
import Input from '../../components/Input.js';
import Button from '../../components/Button.js';
import EmptyState from '../../components/EmptyState.js';
import StarRating from '../../components/StarRating.js';

interface StoreItem {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number | null;
  totalRatings: number;
}

export const StoresList: React.FC = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Query Filters State
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Sort State
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/stores', {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          address: address || undefined,
          sortBy,
          sortOrder,
        },
      });
      if (res.success && res.data) {
        setStores(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (e) {
      console.error('Failed to fetch stores:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStores();
  };

  const handleClearFilters = () => {
    setSearch('');
    setAddress('');
    setPage(1);
    setTimeout(() => {
      fetchStores();
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

  const columns: TableColumn<StoreItem>[] = [
    { header: 'Store Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Address', accessor: 'address', sortable: true },
    { 
      header: 'Average Rating', 
      accessor: (s) => (
        <div className="flex items-center space-x-2">
          <StarRating rating={s.averageRating} size={16} />
          <span className="text-sm font-semibold text-slate-700">
            {s.averageRating !== null ? s.averageRating : 'N/A'}
          </span>
          <span className="text-xs text-slate-400">
            ({s.totalRatings} reviews)
          </span>
        </div>
      ),
      sortable: true,
      sortByField: 'rating',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Retail Stores Directory</h2>
        <Link to="/admin/stores/new">
          <Button>Add Store</Button>
        </Link>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <Input
            id="search-name"
            label="Search Name or Contact"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Input
          id="search-address"
          label="Address Location"
          placeholder="Filter by city/state..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex space-x-2">
          <Button type="submit" variant="primary" className="flex-1">
            Search
          </Button>
          <Button type="button" variant="secondary" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </form>

      {/* Stores list */}
      {!loading && stores.length === 0 ? (
        <EmptyState
          title="No stores match your search"
          description="Try adjusting your filter settings or click add store to register a new retail location."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={stores}
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
export default StoresList;
