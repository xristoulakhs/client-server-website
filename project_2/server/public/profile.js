const SERVER = "http://localhost:3000";
let emailUsr=document.getElementById("email");
let passwordUsr=document.getElementById("password");
let login_btn=document.getElementById("login-btn");

/**
 * 
 * i onclick kaleitai otan o xristis pataei to koumpi login_btn.
 * to event.preventDefault() xrisimopoieitai gia na apotrepsoume
 * thn default energeia tou server wste na diaxeiristoume emeis
 * to ti tha ginei
 */
login_btn.onclick=function(event){
    event.preventDefault();
    login();
};

/**
 * i login() eksartatai apo to apotelesma tis sendCredentials().
 * o server gutnaei ena response true i false stin post methodo
 * pou xrisimopoioume gia to login se morfi string.
 * ean to response einai false petaei minima lathous kai ean einai true
 * emfanizei ta stoixeia tou xristi kai krubei to menu tou login.
 */
async function login(){
    let response=await sendCredentials();
    console.log(response)
    
    if(response == 'true'){
        let profileInfo = await getProfileInfo(emailUsr.value);
        console.log(emailUsr.value)
        console.log(profileInfo);
        let template = document.getElementById("profile-template").innerHTML
        let compiled_template = Handlebars.compile(template)
        let rendered = compiled_template(profileInfo)
        document.getElementById("profile-info-wrapper").innerHTML = rendered;
        hideLogin();
    }
    else{
        alert("Password invalid, please re-enter password!");
    }
}

/**
 * methodos gia na paroume tis plirofories tou profile tou xristi
 * apo ton server
 */
async function getProfileInfo(email){
    let response= await fetch(SERVER+"/user-info/"+ email);
    let profileData = await response.json();
    return profileData[0];
}

/**
 * methodos gia na kruboume tin forma tou login.
 * i wrapper-off einai mia klasi i opoia den exei dilwthei
 * sto profile.html opou ginetai to login alla uparxei sto .css
 * arxeio kai einai upeuthini mono gia na allazei to visibility.
 */
function hideLogin(){
    let loginForm=document.getElementById("login-id");
    loginForm.classList="wrapper-off";
}

/**
 * 
 * i sendCredentials() stelnei ta dedomena ston server 
 * kai epistrefei to response tou diladi ean katafere na 
 * brei xristi stin basi me auto to email kai ton kwdiko.
 */
async function sendCredentials(){
    try {
        let credentials= {
            email: emailUsr.value,
            password: passwordUsr.value
        }
        console.log(credentials);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(credentials)
        }
        let resp = await fetch(SERVER + '/login', options)
        let finalResp= await resp.text();
        return finalResp;
    } catch (err) {
        console.log(err)
    }
}