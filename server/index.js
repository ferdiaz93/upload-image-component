const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors')

const app = express();
app.use(cors());
const upload = multer({ dest: 'server/temp'});
const port = 8080;

app.post('/api/save-img', upload.single('miarchivo'), (req, res) => {
  let dateObj = new Date();
  
  let month = dateObj.getUTCMonth() + 1;
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  // el valor del primer input llega en req.body.filename

  //este bloque de codigo crea un nombre en base al dia que se esta subiendo y ubicacion donde se va a guardar
  const tempPath = req.file.path;
  const extension = path.extname(req.file.originalname).toLowerCase();
  const newFileName = `${year}_${month}_${day}_${Date.now()}`; 
  const targetPath = path.join(__dirname, `./uploads/${newFileName}${extension}`);
  
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

app.listen(port, () => {
  console.log("server iniciado en " + port);
});