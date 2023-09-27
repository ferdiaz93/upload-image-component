const fs = require('fs/promises');
const path = require('path');

const { isAValidImage, getFileInfo } = require("../utils/fileUtils");

const saveImage = async (req, res) => {
  // el valor del primer input llega en req.body.filename
  let fileNameParsed = req.body.filename.replace(" ", "_");
  if (!req.file) return res.status(403).json({ success: false, message: "No fue cargado ninguna imagen!" });

	const { tempPath, extension, newFileName, newPath } = getFileInfo(req.file, fileNameParsed);

  if (isAValidImage(extension)) {
    await fs.rename(tempPath, newPath); //movemos el archivo temporal a la carpeta uploads
    return res.status(200).json({
      success: true,
      message: "Image uploaded",
      url: path.resolve(__dirname, `./uploads/${newFileName}${extension}`), //retornamos la url absoluta de la imagen
    });
  }
  await fs.unlink(tempPath); //borramos el archivo temporal
  return res
    .status(403)
    .json({ success: false, message: "Only .png or .jpg files are allowed!" });
};

module.exports = { saveImage };