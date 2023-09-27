require('dotenv').config()
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const imageController = require('./controllers/fileController');
const navigationController = require('./controllers/navigationController');

const app = express();
app.use(cors());
const upload = multer({ dest: 'server/temp'}); //dest es la carpeta donde se guardara el archivo temporalmente
const PORT = process.env.COMPONENT_PORT || 8080;

//static middleware
app.use(express.static(path.join(__dirname, '../public')))

//index route
app.get('/', navigationController.getIndex)

//upload.single is from multer lib
app.post('/api/save-img', upload.single('image'), imageController.saveImage);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});