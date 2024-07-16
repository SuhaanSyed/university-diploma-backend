// index.js
const express = require('express');
const dotenv = require('dotenv');
const Moralis = require('moralis').default;
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
});


// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use('/auth', authRouter);

// Default route handler for base URL
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
