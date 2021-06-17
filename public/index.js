const inputFile = document.getElementById("input-file");
const form = document.getElementById("form");
const imgElement = document.getElementById("img-preview");
const inputName = document.getElementById("input-name");
const responseText = document.getElementById("response-text");

const user = {};

inputFile.addEventListener("change", event => {
    if (event.target.files && event.target.files[0]) {
        let selfieFile = event.target.files[0];
        //genera vista previa
        let reader = new FileReader();
        reader.onload = (e) => {
            let photoPreview = e.target.result;
            imgElement.src = photoPreview;
        }
        reader.readAsDataURL(selfieFile);
        //guardamos el archivo dentro de nuestro user
        user.file = selfieFile;
    }
});

form.addEventListener("submit", event => {
    event.preventDefault();
    user.username = inputName.value;
    sendData(user);
})


function sendData(user){
  let formData = new FormData();
  formData.append('filename', user.username);

  //con este nombre vamos a poder capturarlo en nuestro server
  formData.append('miarchivo', user.file);
  fetch('http://localhost:8080/api/save-img', {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    if(response.success){
      responseText.innerText = response.message + " ✅"
    } else {
      responseText.innerText = response.message + " ❌"
    }
  })
}