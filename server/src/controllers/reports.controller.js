const { query } = require('../config/db');

exports.dashboard = async (req, res, next) => {
  try {
    const [revenue, expenses, clients, invoices] = await Promise.all([
      query(`SELECT COALESCE(SUM(total),0) AS total
             FROM invoices WHERE status='paid'
             AND DATE_TRUNC('month', paid_date) = DATE_TRUNC('month', NOW())`),
      query(`SELECT COALESCE(SUM(amount),0) AS total
             FROM expenses
             WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', NOW())`),
      query(`SELECT COUNT(*) FROM clients`),
      query(`SELECT
               COUNT(*) FILTER (WHERE status='overdue') AS overdue,
               COUNT(*) FILTER (WHERE status='sent')    AS pending,
               COALESCE(SUM(total - amount_paid) FILTER (WHERE status IN ('sent','overdue')), 0) AS outstanding
             FROM invoices`),
    ]);
    res.json({
      revenue:     parseFloat(revenue.rows[0].total),
      expenses:    parseFloat(expenses.rows[0].total),
      profit:      parseFloat(revenue.rows[0].total) - parseFloat(expenses.rows[0].total),
      clients:     parseInt(clients.rows[0].count),
      overdueInvoices:   parseInt(invoices.rows[0].overdue),
      pendingInvoices:   parseInt(invoices.rows[0].pending),
      outstanding: parseFloat(invoices.rows[0].outstanding),
    });
  } catch (err) { next(err); }
};

exports.profitLoss = async (req, res, next) => {
  try {
    const { from = '2024-01-01', to = 'now()' } = req.query;
    const [rev, exp, byMonth] = await Promise.all([
      query(`SELECT COALESCE(SUM(total),0) AS total FROM invoices
             WHERE status='paid' AND paid_date BETWEEN $1 AND $2`, [from, to]),
      query(`SELECT COALESCE(SUM(amount),0) AS total FROM expenses
             WHERE expense_date BETWEEN $1 AND $2`, [from, to]),
      query(`SELECT
               TO_CHAR(gs.month,'YYYY-MM') AS month,
               COALESCE(r.revenue, 0)      AS revenue,
               COALESCE(e.expenses, 0)     AS expenses
             FROM generate_series($1::date, $2::date, '1 month') AS gs(month)
             LEFT JOIN (
               SELECT DATE_TRUNC('month',paid_date) m, SUM(total) revenue
               FROM invoices WHERE status='paid' GROUP BY 1
             ) r ON r.m = DATE_TRUNC('month', gs.month)
             LEFT JOIN (
               SELECT DATE_TRUNC('month',expense_date) m, SUM(amount) expenses
               FROM expenses GROUP BY 1
             ) e ON e.m = DATE_TRUNC('month', gs.month)
             ORDER BY gs.month`, [from, to]),
    ]);
    const revenue  = parseFloat(rev.rows[0].total);
    const expenses = parseFloat(exp.rows[0].total);
    res.json({ revenue, expenses, profit: revenue - expenses, byMonth: byMonth.rows });
  } catch (err) { next(err); }
};
