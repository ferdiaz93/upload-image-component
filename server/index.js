require('dotenv').config()
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const cors = require('cors')

const app = express();
app.use(cors());
const upload = multer({ dest: 'server/temp'}); //dest es la carpeta donde se guardara el archivo temporalmente
const PORT = process.env.COMPONENT_PORT || 8080;

//static middleware
app.use(express.static(path.join(__dirname, '../public')))

//index route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../public/index.html'))
})

//upload.single is from multer lib
app.post('/api/save-img', upload.single('miarchivo'), async (req, res) => {
  // el valor del primer input llega en req.body.filename
  let fileNameParsed = req.body.filename.replace(' ', '_');
  if(!req.file) return res.status(403).json({success: false, message: "No fue cargado ninguna imagen!"});
  const { tempPath, extension, newFileName, newPath } = getFileInfo(req.file, fileNameParsed);

  if (isAValidImage(extension)) {
    await fs.rename(tempPath, newPath); //movemos el archivo temporal a la carpeta uploads
    return res.status(200).json({
      success: true,
      message: "Image uploaded",
      url: path.resolve(__dirname, `./uploads/${newFileName}${extension}`) //retornamos la url absoluta de la imagen
    });
  }
  await fs.unlink(tempPath); //borramos el archivo temporal
  return res.status(403).json({success: false, message: "Only .png or .jpg files are allowed!"});
});

function isAValidImage(extension){
  return extension === ".png" || extension === ".jpg";
}

function getFileInfo(file, fileNameParsed){
  // obtenemos los datos del tiempo actual para usarlos en el nombre del archivo
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const tempPath = file.path; //ruta temporal del archivo
  //este bloque de codigo crea un nombre en base al dia que se esta subiendo y ubicacion donde se va a guardar
  const extension = path.extname(file.originalname).toLowerCase();
  const newFileName = `${fileNameParsed}_${year}_${month}_${day}_${Date.now()}`;
  const newPath = path.join(__dirname, `./uploads/${newFileName}${extension}`);
  return { tempPath, extension, newFileName, newPath }; //retornamos un objeto con los datos
};

app.listen(PORT, () => {
  console.log("SERVER IN PORT " + PORT);
});