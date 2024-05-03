const express = require('express');
const bodyParser = require('body-parser');
const solarPanelRoutes = require('./routes/solarPanelRoutes')
const battrieRoutes = require('./routes/BattrieRoutes');
const productionRoutes = require('./routes/ProductionRoutes');
const consommationRoutes = require('./routes/ConsommationRoutes');
const networkPublicRoutes = require('./routes/NetworkPublicRoutes');
const userRoutes = require('./routes/UserRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/solar-panels', solarPanelRoutes);
app.use('/batteries', battrieRoutes);
app.use('/productions', productionRoutes);
app.use('/consommations', consommationRoutes);
app.use('/networks', networkPublicRoutes);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
