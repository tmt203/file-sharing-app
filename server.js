const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const viewRoute = require('./routes/viewRoute');
const fileRoute = require('./routes/fileRoute');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(express.json());

app.use('/', viewRoute);
app.use('/api/files', fileRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});