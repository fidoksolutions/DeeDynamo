const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const app     = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const auth = require('./middleware/auth');

app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/clients',     auth, require('./routes/clients.routes'));
app.use('/api/services',    auth, require('./routes/services.routes'));
app.use('/api/quotations',  auth, require('./routes/quotations.routes'));
app.use('/api/invoices',    auth, require('./routes/invoices.routes'));
app.use('/api/expenses',    auth, require('./routes/expenses.routes'));
app.use('/api/reports',     auth, require('./routes/reports.routes'));

app.use(require('./middleware/errorHandler'));
module.exports = app;
