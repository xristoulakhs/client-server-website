const SERVER = "http://localhost:3000";
let firstNameInput = document.querySelector("#first-name");
let lastNameInput = document.querySelector("#last-name");
let addressInput = document.querySelector("#address");
let phoneInput = document.querySelector("#phone");
let educationInput = document.querySelector("#education-level");
let emailInput = document.querySelector("#email");
let passwordInput=document.getElementById("password");
let passwordCheckInput=document.getElementById("password-check");
let btn_submit=document.getElementById("submit-btn");

let tempEmail = "none"
/**
 * methodos pou kaleitai otan patame to btn_submit
 */
btn_submit.onclick = function(event) {
    event.preventDefault(); //prevent default action from submit to post in server
    submitUser();
}

/**
 * meta apo ton elegxo twn dedomenwn stin confirmSignUp eite
 * sunexizei me epituxia i bgazei minuma lathous.
 */
async function submitUser(){
    let confirmEmailValidity = await confirmSignUp(email);
    if (confirmEmailValidity) {
        let responseFromServer = await sendData();
        console.log(responseFromServer);
        hideForm();

    }
    else {
        console.log("Please try a valid email!")
    }
}

/**
 * methodos gia krupsimo tis formas eggrafis. Oi klaseis
 * msg-on kai form-off den exoun dilwthei sto register.html 
 * alla uparxoun sto style.css kai i moni tous leitourgia einai
 * na emfanizoun to minuma epituxias kai na kruboun tin forma antistoixa
 */
function hideForm(){
    let msg=document.querySelector("#display-msg");
    msg.classList= "msg-on"
    
    let form=document.querySelector("#registerForm");
    form.classList="form-off"
}

var fd=new FormData();

/**
 * 
 * methodos gia ton elegxo twn input tou xristi.
 */
async function confirmSignUp(){

    //check if password is valid
    let available = true;
    if(!passwordInput.checkValidity()){
        alert('Password input is incorrect!')
        available = false;
    }

    //check if passwords match
    if(passwordInput.value!=passwordCheckInput.value){
        alert('Passwords dont match!')
        passwordInput.style.border= "3px solid red"
        passwordCheckInput.style.border= "3px solid red"
        available = false;
    }
    
    //elegxos oti to email pou ebale o xristis den uparxei idi
    let respEmail = await searchEmailUser(emailInput.value);
    if (emailInput.value === respEmail){
        alert("Email already exists!")
        available = false;
    }

    return available;

}

async function searchEmailUser(email) {

    try {
        //epeidi i js einai asychronous kanoume await na perimenoume to promise
        //na oloklirwthei kai meta ksana kanoume await gia to respone.text() 
        //giati einai promise kai einai pending an den kanoume await
        let response = await fetch(SERVER + '/user-email-validity/' + email);
        let data = await response.text();
        tempEmail = data;
        return data;
    }
    catch (err) {
        console.log("Error ====> ");
        console.log(err);
    }
}

function valuesToJSONObject() {
    return { "fname": firstNameInput.value,
    "lname": lastNameInput.value,
    "address": addressInput.value,
    "phone": phoneInput.value,
    "education": educationInput.value,
    "email": emailInput.value,
    "password": passwordInput.value,
    "passwordCheck": passwordCheckInput.value
}
}

async function sendData() {

    try {
        let data = valuesToJSONObject();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        }
        let resp = await fetch(SERVER + '/signup', options)
        return resp
    } catch (err) {
        console.log(err)
    }

}
