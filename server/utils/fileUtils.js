const path = require('path');

const isAValidImage = (extension) => {
    return extension === ".png" || extension === ".jpg";
}

const getFileInfo = (file, fileNameParsed) => {
    // obtenemos los datos del tiempo actual para usarlos en el nombre del archivo
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const tempPath = file.path; //ruta temporal del archivo
    //este bloque de codigo crea un nombre en base al dia que se esta subiendo y ubicacion donde se va a guardar
    const extension = path.extname(file.originalname).toLowerCase();
    const newFileName = `${fileNameParsed}_${year}_${month}_${day}_${Date.now()}`;
    const newPath = path.join(__dirname, `../uploads/${newFileName}${extension}`);
    return { tempPath, extension, newFileName, newPath }; //retornamos un objeto con los datos
};

module.exports = { isAValidImage, getFileInfo };