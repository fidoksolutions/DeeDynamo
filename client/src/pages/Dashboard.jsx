import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/ui/StatCard';
import { DollarSign, Users, FileText, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/reports/dashboard').then(r => setStats(r.data));
  }, []);

  if (!stats) return <div className="p-8 text-slate-400">Loading…</div>;

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Revenue (this month)"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<DollarSign />} color="blue"
        />
        <StatCard
          label="Expenses (this month)"
          value={`$${stats.expenses.toLocaleString()}`}
          icon={<DollarSign />} color="red"
        />
        <StatCard
          label="Net Profit"
          value={`$${stats.profit.toLocaleString()}`}
          icon={<TrendingUp />} color={stats.profit >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Total Clients"
          value={stats.clients}
          icon={<Users />} color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Outstanding Invoices</h3>
          <p className="text-3xl font-bold text-slate-800">
            ${stats.outstanding.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {stats.overdueInvoices} overdue · {stats.pendingInvoices} pending
          </p>
        </div>
      </div>
    </div>
  );
}
