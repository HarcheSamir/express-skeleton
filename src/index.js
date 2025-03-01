require('dotenv').config();
const app = require('./config/app');
const { PORT } = require('./secrets'); // Import from secrets.js
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
