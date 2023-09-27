const INPUT_FILE = document.getElementById("input-file");
const FORM = document.getElementById("form");
const IMG_ELEMENT = document.getElementById("img-preview");
const INPUT_NAME = document.getElementById("input-name");
const RESPONSE_TEXT = document.getElementById("response-text");

const data = {};

INPUT_FILE.addEventListener("change", event => {
  RESPONSE_TEXT.innerText = "";
    if (event.target.files && event.target.files[0]) {
        let selfieFile = event.target.files[0];
        //genera vista previa
        //generate preview
        let reader = new FileReader();
        reader.onload = (e) => {
            let photoPreview = e.target.result;
            IMG_ELEMENT.src = photoPreview;
        }
        reader.readAsDataURL(selfieFile);
        //guardamos el archivo dentro de nuestro user
        //we save the file inside our user
        data.file = selfieFile;
    }
});

FORM.addEventListener("submit", async (event) => {
    event.preventDefault();
    data.name = INPUT_NAME.value;
    await sendData(data);
})

async function sendData(data){
  let formData = new FormData();
  formData.append('filename', data.name);

  //con este nombre vamos a poder capturarlo en nuestro server
  //with this name we can catch it from our server
  formData.append('image', data.file);
  try {
    const response = await fetch('/api/save-img', {
      method: "POST",
      body: formData
    })
    const dataResponse = await response.json();
    showMessagge(dataResponse.success, dataResponse.message);
  } catch (error) {
    console.log(error);
    showMessagge(false, error);
  }
}

function showMessagge(success, message){
  if(success){
    RESPONSE_TEXT.innerText = message + " ✅"
  } else {
    RESPONSE_TEXT.innerText = message + " ❌"
  }
}