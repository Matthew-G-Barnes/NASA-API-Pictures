const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imageContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')

// NASA API
const count = 10
const apiKey = 'Lbdo6sbd5VVaPicmfN7N1wUNb3i4mjPz55pVDOEM'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {}


function createDomEl(info, saveDeleteText) {
    // Card Container
    const card = document.createElement('div')
    card.classList.add('card')
    // link
    const link = document.createElement('a')
    link.href = info.hdurl;
    link.title = 'View Full Image'
    link.target = '_blank'
    // Image
    const image = document.createElement('img')
    image.src = info.url;
    image.alt = 'NSA Picture of the Day'
    image.loading = 'lazy'
    image.classList.add('card-image-top')
    // Card Body
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    // Card Title
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = info.title
    // Save Text
    const saveText = document.createElement('p')
    saveText.classList.add('clickable')
    saveText.textContent = saveDeleteText
    saveText.setAttribute('onclick', saveDeleteText.includes('Add') ? `saveFavorite('${info.url}')` : `removeFavorite('${info.url}')`)
    // Card Text
    const cardText = document.createElement('p')
    cardText.classList.add('card-text')
    cardText.textContent = info.explanation
    // Footer Container
    const footer = document.createElement('small')
    footer.classList.add('text-muted')
    // Date
    const date = document.createElement('strong')
    date.textContent = info.date
    // Copyright
    const copyrightInfo = info.copyright === undefined ? '' : info.copyright
    const copyright = document.createElement('span')
    copyright.textContent = ` ${copyrightInfo}`
    // Append
    footer.append(date, copyright)
    cardBody.append(cardTitle, saveText, cardText, footer)
    link.appendChild(image)
    card.append(link, cardBody)
    imageContainer.appendChild(card)
}

function showLoader(display) {
    window.scrollTo({top: 0, behavior: 'instant'})
    if (display === true) {
        loader.classList.remove('hidden')
    } else {
        loader.classList.add('hidden')
    }
}

function changeNavUi(display) {
    if (display === 'Nasa') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')
    } else {
        resultsNav.classList.add('hidden')
        favoritesNav.classList.remove('hidden')
    }
}

// Get 10 Images from NASA API
async function getNasaPictured() {
    // Show Loader
    showLoader(true)
    // Retrieve favorites from local storage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    try {
        // Changed Nav menu
        changeNavUi('Nasa')
        // Clear Current images & load Nasa images
        imageContainer.textContent = ''
        const response = await fetch (apiUrl)
        resultsArray = await response.json()
        resultsArray.forEach((result) => {
            createDomEl(result, 'Add to Favorites')
        })
        showLoader(false)
    } catch (error) {
        // Catch Error Here
        console.log(error);
    }
}

// Loads Favorited Nasa Images
function loadFavorites() {
    // Changed Nav menu
    changeNavUi('Favorites')
    // Clear Current images & load Favorited images
    imageContainer.textContent = ''
    showLoader(true)
    const favoritesArray = Object.values(favorites)
    favoritesArray.forEach((result) => {
        createDomEl(result, 'Remove From Favorites')
    })
    showLoader(false)
}

// Add result to favorites
function saveFavorite(itemUrl) {
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item
            // Show Save Confirmation for 2 Seconds
            saveConfirmed.hidden = false
            saveConfirmed.classList.add('save-complete')
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000)
            setTimeout(() => {
                saveConfirmed.classList.remove('save-complete')
            }, 2100)
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
}

// Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl]
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        loadFavorites()
    }
}

// On Load
getNasaPictured()