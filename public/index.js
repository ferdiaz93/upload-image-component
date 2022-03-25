const INPUT_FILE = document.getElementById("input-file");
const FORM = document.getElementById("form");
const IMG_ELEMENT = document.getElementById("img-preview");
const INPUT_NAME = document.getElementById("input-name");
const RESPONSE_TEXT = document.getElementById("response-text");

const user = {};

INPUT_FILE.addEventListener("change", event => {
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
        user.file = selfieFile;
    }
});

FORM.addEventListener("submit", event => {
    event.preventDefault();
    user.username = INPUT_NAME.value;
    sendData(user);
})


function sendData(user){
  let formData = new FormData();
  formData.append('filename', user.username);

  //con este nombre vamos a poder capturarlo en nuestro server
  //with this name we can catch it from our server
  formData.append('miarchivo', user.file);
  fetch('/api/save-img', {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    if(response.success){
      RESPONSE_TEXT.innerText = response.message + " ✅"
    } else {
      RESPONSE_TEXT.innerText = response.message + " ❌"
    }
  })
}