const express = require('express');
const cors = require('cors');
require('dotenv').config();

const companyRoutes = require('./routes/companyRoutes');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors(
    {
        origin: '*'
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/companies', companyRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the backend');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
