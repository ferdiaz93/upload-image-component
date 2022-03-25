require('dotenv').config()
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors')

const app = express();
app.use(cors());
const upload = multer({ dest: 'server/temp'});
const PORT = process.env.COMPONENT_PORT || 8080;

//static middleware
app.use(express.static(path.join(__dirname, '../public')))

//index route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../public/index.html'))
})

//upload.single is from multer lib
app.post('/api/save-img', upload.single('miarchivo'), (req, res) => {
  let dateObj = new Date();

  let month = dateObj.getUTCMonth() + 1;
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  // el valor del primer input llega en req.body.filename
  // the value of the first input arrives in
  let fileNameParse = req.body.filename.replace(' ', '_');

  //este bloque de codigo crea un nombre en base al dia que se esta subiendo y ubicacion donde se va a guardar
  //This code block creates a name based on the day it is being uploaded and the location where it will be saved.
  let tempPath = req.file.path;
  let extension = path.extname(req.file.originalname).toLowerCase();
  let newFileName = `${fileNameParse}_${year}_${month}_${day}_${Date.now()}`; 
  let targetPath = path.join(__dirname, `./uploads/${newFileName}${extension}`);
  
  if (extension === ".png" || extension === ".jpg") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return res.json({error: err});
      res.status(200).json({success: true, message: "Image uploaded"});
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return res.json({error: err});
      res.status(403).json({success: false, message: "Only .png or .jpg files are allowed!"});
    });
  }
});

app.listen(PORT, () => {
  console.log("SERVER IN PORT " + PORT);
});