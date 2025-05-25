if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}



const http = require('http');
const app = require('./app');
const PORT = process.env.APP_PORT;


//Create Server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 Server is running http://localhost:${PORT}`);
})