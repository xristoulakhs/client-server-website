//briskoume se poio arxeio eimaste apo to window.location.href
let text = window.location.href
let words = text.split('/');

//arxikopoihsh public array gia na paroume ta courses kai ta categories me to fetch
var data = []
var categories = []
let server = 'https://elearning-aueb.herokuapp.com'

//auta ta bazoume mesa sto if giati an den einai
//sto index.html den uparxoun ta tag kai xtypaei erorr
//opote etsi xrisimopoioume to search-book.js kai se alla *.html
if (words[words.length - 1] == "index.html") {

    //auto einai gia na kanei search otan kanoume click to button 
    let btnSubmit = document.getElementById("submit-btn")
    btnSubmit.onclick = function () {
        submit()
    }

    //auto einai gia patame Enter na kanei anazhthsh
    let formSearch = document.getElementById("search")
    formSearch.onsubmit = submitSearchWithEnter
    function submitSearchWithEnter(event) {
        event.preventDefault()
        submit()
    }
}

// apla kanoume copy ta dedomena se ena public pinaka courses
async function setData(keyword) {
    let courses = await getCoursesFromServer(keyword)
    for (let i = 0; i < courses.length; i++) {
        data[i] = courses[i]
        for (let j = 0; j < categories.length; j++) {
            if (courses[i].category == categories[j].id) {
                data[i].category = categories[j].title
            }
        }
    }
}

// apla kanoume copy ta dedomena se ena public pinaka categories
async function setCategories() {
    let tempCategories = await getCategories()
    for (let i = 0; i < tempCategories.length; i++) {
        categories[i] = tempCategories[i]
    }
}


//epistrefei ton titlo apo ena sugkekrimo id cathgorias
function returnCategoryFromID(variableID) {
    for(let category of categories) {
        
        if (category.id == variableID){
            return category.title
        }
    }
}

//epistrefei to value to input apo to searchbar
function getKeyword() {
    return document.getElementById("search-bar").value;
}

//analoga se poia selida einai dhladh tin index.html h tin courses.html
//kanei to antistoixo fetch, an einai sthn index kanei get gia bash me kapoio title
//alliws kanei get basi kapoiou category
async function getCoursesFromServer(keyword ) {
    try {
        let updated_url
        if(words[words.length - 1] == "index.html"){
            updated_url = server + '/courses/search?title=' + keyword
        }
        else{
            updated_url = server + '/courses/search?category=' + keyword
        }
        let data = await fetch(updated_url)
        return await data.json()
    } catch (error) {
        console.log(error)
    }
}


//kanei fetch gia na paroume ta categories
async function getCategories() {
    try {
        let data = await fetch(server + "/categories")
        return await data.json()
    } catch (error) {
        console.log(error)
    }
}

//analoga thn selida dld index.html h courses emfanizei antoistixo mhnuma
//kai apo katw emfanizei ta courses, h emfanisi tous ginetai me handlebars
function searchResults() {
    let length = data.length
    let result = "No courses found!"
    if (data.length != 0) {

        // text.search() > 0 giati to search an den brei epistrefei -1
        if (text.search("courses.html") > 0) {
            let id = getCategoryIdFromURL()
            // console.log(id)
            let title = returnCategoryFromID(id)
            console.log(text.search("courses.html"))
            result = "In category " + returnCategoryFromID(getCategoryIdFromURL()) + " "
        }
        else{
            result = ""
        }
        console.log(result)
        result = result + length + " courses found!"
    }
    
    let results_from_search = document.getElementById("results-from-search")
    results_from_search.innerHTML = result

    let template = document.getElementById("courses-template-search").innerHTML
    let compiled_template = Handlebars.compile(template)
    let rendered = compiled_template({data})
    document.getElementById("courses-from-search").innerHTML = rendered;
}

//voithitiki methodos i opoia einai async gia na perimenei na teleiwsei
//to promise tou fetch stin setData kai meta na kalesei thn searchResults
//kai na emfanisei ta dedomena alliws emfanizoume ton pinaka prin teleiwsei 
//to promise apo to fetch kai den emfanizetai tipota 
async function loadData(input) {
    await setData(input)
    searchResults()
}

//voithitiki synarthsh
async function loadCategories() {
    await setCategories()
}

//apla kalountai oi entoles otan theloume na kanoume submit
function submit() {
    data = []
    let input = getKeyword()
    loadData(input)
}


//hideMenu & showMenu synarthseis gia na emfanizoume kai na kryboume to menou
//NOTE: einai gia to sub-menu twn categories
function hideMenu() {
    let menuArea = document.querySelector("#categories")
    menuArea.innerHTML = ""
    menuArea.classList = "categories-hidden"
}

function showMenu() {
    let template = document.getElementById("categories-template").innerHTML
    let compiled_template = Handlebars.compile(template)
    let rendered = compiled_template({
        categories
    })
    document.getElementById("categories").innerHTML = rendered;
    let menuArea = document.querySelector("#categories")
    menuArea.classList = "categories-vissble"
}

hideMenu()//ekteleite se auto to scope gia na krybetai to menu panta otan anoigei h selida
loadCategories()//fortwnei ola ta categories molis fortwsei to arxeio gia na ta exoume diathesima sto menu
let visibleMenu = false;
let btnToggleMenu = document.getElementById("toggle-categories")
btnToggleMenu.onclick = function () {

    if (visibleMenu) {
        hideMenu()
        visibleMenu = false
    } else {
        showMenu()
        visibleMenu = true
    }
}

//openMenu & closeMenu einai gia to main-menu
function openMenu() {
    let menu = document.querySelector("#menu-display")
    menu.classList = "display-on"
}

function closeMenu() {
    let menu = document.querySelector("#menu-display")
    menu.classList = "display-off"
}

let menuDisplayBtn = document.getElementById("menu-btn")
menuOnOff = false;
menuDisplayBtn.onclick = function () {
    if (menuOnOff) {
        closeMenu()
        menuOnOff = false
    } else {
        openMenu()
        menuOnOff = true
    }
}

//apla pairnoume ta categories apo to url search
function getCategoryIdFromURL() {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    return params.category
}




//an einai sto courses.html tote pairnei tis parametrous apo to url kai emfanizei ta katalhla courses
if (text.search("courses.html") > 0) {//megalutero tou mhden giati an einai false to search gurnaei -1 kai mpainei sto if statement
    console.log("shouldn't be herre")
    let category = getCategoryIdFromURL()
    loadData(category)

}