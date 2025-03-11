/* API */
const BASE_SERVER_PATH = 'https://api.artic.edu/api/v1';
const ARTWORKS_SERVER_PATH = BASE_SERVER_PATH  + '/artworks';

let myData;
let dataConfig; // для формирования ссылки на изображения
let artWorkData; // массив с данными о произведениях искусства

function sendRequest({url}) {
    return fetch(url);
}

function getArtWorks() {
    const paramFields = 'id,title,image_id,date_start,date_end,date_display,artist_title,description,artwork_type_title';
    const paramLimit = '100';
    const queryParams = '?page=1&limit=' + paramLimit + '&fields=' + paramFields;
    sendRequest({url: ARTWORKS_SERVER_PATH + queryParams})
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    })
    .then(function(data) {
        isServer();
        myData = data; 
        dataConfig = data.config; // для формирования ссылки на изображения
        artWorkData = data.data; // массив с данными о произведениях искусства
        console.log(myData);
        
        createCardsList();
    })
    .catch(error => {
        noServer();
        console.log('Ошибка при получении данных', error.status);
    });
}

getArtWorks();

function createCardsList() {
    for (let i = 0; i <= artWorkData.length - 1; i++) {
        if (artWorkData[i].artwork_type_title === "Painting") {
            createCard(artWorkData[i], dataConfig);
        }
    }
    // функция обработчиков для кнопок-лайков УБРАТЬ ЕЁ !!!
    initializeButtons();
}

// cоздание карточки с произведением искусства

function createCard(data, config) {
    const cardList = document.querySelector('.artworks__list');
    let card = createElem('li', 'artworks__item card');
    let cardDescription = createElem('div', 'card__description');
    card.setAttribute('id', `${data.id}`);
    let cardImg = createImage('card__img', config, data);
    let cardName = createElem('p', 'card__name');
    cardName.textContent = `${data.title || 'unknown'}`;
    let cardArtist = createElem('p', 'card__artist');
    cardArtist.textContent = `${data.artist_title || 'unknown'}`;
    let cardYears = createElem('p', 'card__years');
    cardYears.textContent = `${data.date_display || 'unknown'}`;
    card.appendChild(cardImg);
    cardDescription.appendChild(cardName);
    cardDescription.appendChild(cardArtist);
    cardDescription.appendChild(cardYears);
    card.appendChild(cardDescription);
    cardList.appendChild(card);
// переделать через appendChild  и сразу повесить клик
    card.insertAdjacentHTML('afterbegin', '<button class="card__btn"><svg width="800px" height="800px" viewBox="0 0 24 24"><path d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z"/></svg</button>');
}
/* !!!!!!!!!!!!!!!https://habr.com/ru/articles/647359/ */
// Извлекает данные из localStorage или возвращает пустой массив
function getFavorites() {
    return JSON.parse(localStorage.getItem('favoriteArts')) || [];
}

// Сохраняет обновлённый список избранного в localStorage
function saveFavorites(favorites) {
    /* сюда должен прийти массив с объектами ??? каждый объект с полями title, art, image_url, year */
    localStorage.setItem('favoriteArts', JSON.stringify(favorites));
}

// Обновляет отображение списка избранных картин и иконок
function updateFavoritesDisplay(data, config) {
    const favorites = getFavorites(); //  сюда должен прийти объект
    const favoritesList = document.querySelector('.collection__list');
    const artworksElements = document.querySelectorAll('.artworks .artworks__list .card');
 
    favoritesList.innerHTML = ''; // Очищаем блок избранных картин

    const favoritesIds = Object.keys(favorites).map(Number); // перевела в числа строки
    // Отображаем избранные картины
    favoritesIds.forEach(art => {
        console.log(art);
        console.log(data.id);
/* ИСПРАВИТЬ ЗДЕСЬ, данные должны подгружаться не из АПИ, а из localStorage
В localStorage надо положить не только id но и другие нужные поля для генерации списка.  */
        if (art === data.id) {
            let card = createElem('li', 'collection__item card');
            let cardDescription = createElem('div', 'card__description');
            card.setAttribute('id', `${data.id}`);
            let cardImg = createImage('card__img', config, data);
            let cardName = createElem('p', 'card__name');
            cardName.textContent = `${data.title || 'unknown'}`;
            let cardArtist = createElem('p', 'card__artist');
            cardArtist.textContent = `${data.artist_title || 'unknown'}`;
            let cardYears = createElem('p', 'card__years');
            cardYears.textContent = `${data.date_display || 'unknown'}`;
            card.appendChild(cardImg);
            cardDescription.appendChild(cardName);
            cardDescription.appendChild(cardArtist);
            cardDescription.appendChild(cardYears);
            card.appendChild(cardDescription);
            favoritesList.appendChild(card);
        
            card.insertAdjacentHTML('afterbegin', '<button class="card__remove-btn"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>');

            let removeButton = document.querySelector('card__remove-btn');
            removeButton.addEventListener('click', () => {
                removeFavorite(art);
            });
        }
    });

    // Обновляем цвет иконок SVG

    artworksElements.forEach(artElement => {
        const artworkId = artElement.id;
        const svg = artElement.querySelector('svg');
        svg.style.fill = favorites.includes(artworkId) ? '#b4241a' : '#f5f0ec';
       // удаляем анимацию для кнопок-лайков
        const artworkBtn = artElement.querySelector('.card__btn');
       if (artworkBtn.classList.contains("shake")) artworkBtn.classList.remove("shake");
    });
}


// Добавляет карточку в избранное
function addFavorite(favoriteArt) {
    const favorites = getFavorites();
    console.log(favorites);

    /* if (!favorites.includes(idFavoriteArt)) {
        favorites.push(idFavoriteArt);
        saveFavorites(favorites);
        console.log(favorites);
        updateFavoritesDisplay(data, config);
    } */
}

// Удаляем картину из избранного
function removeFavorite(idFavoriteArt) {
    const favorites = getFavorites().filter(idArt => idArt !== idFavoriteArt);
    saveFavorites(favorites);
    //updateFavoritesDisplay(data, config);
}

// Добавляет обработчики для кнопок-лайков
function initializeButtons() {
    let likeButtons = document.querySelectorAll('.artworks .artworks__list .card .card__btn');
    likeButtons.forEach(button => {
        const idFavoriteArt = button.parentElement.id;
        // получить все данные вместе с 
        button.addEventListener('click', () => {
            console.log(idFavoriteArt);
            addFavorite(idFavoriteArt);
           // должны записаться данные карточки в отдельный объект
            button.classList.add("shake"); // Добавляем анимацию для кнопок-лайков
        });
    });
}

function createElem(tag, className) {
    let elem = document.createElement(tag);
    elem.className = className;
    return elem;
}

function createImage(className, config, data) {
    let elem = document.createElement('img');
    elem.className = className;
    elem.setAttribute('src', `${config.iiif_url}/${data.image_id}/full/843,/0/default.jpg`);
    elem.setAttribute('alt', `${data.title}`);
    return elem;
}

/* SLIDER */

// cоздание структуры слайда

function createSlide(dataSlide, config) {
    const slider = document.querySelector('.slider');
    let slide = createElem('div', 'swiper-slide slide');
    let slideImg = createImage('slide__image', config, dataSlide);
    let slideArtist = createElem('h4', 'slide__artist');
    slideArtist.textContent = `${dataSlide.artist_title || ''}`;
    let slideTitle = createElem('h3', 'slide__title');
    slideTitle.textContent = `« ${dataSlide.title || 'unknown'} »  `;
    slide.appendChild(slideArtist);
    slide.appendChild(slideTitle);
    slide.appendChild(slideImg);
    slider.appendChild(slide);
}

var swiper = new Swiper(".artSwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 80,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    initialSlide: 1,
});

/* loader */

function showLoader() {
    let loader = document.querySelector('.preloader');
    if (loader.classList.contains('visually-hidden')) {
        loader.classList.remove('visually-hidden');
    }
}

function removeLoader() {
    const loader = document.querySelector('.preloader');
    if (!loader.classList.contains('visually-hidden')) {
        loader.classList.add('visually-hidden');
    } 
}

/* error */
function noServer() {
    if (!document.body.classList.contains('no-server')) {
        document.body.classList.add('no-server');
        let titlesSection = document.querySelectorAll('h2');
        titlesSection.forEach(el=>{
            el.classList.add('visually-hidden');
        })
        let errorMessage = createElem('div', 'no-server__message');
        errorMessage.textContent = 'The gallery is temporarily closed... Try again later!'
        document.body.appendChild(errorMessage);
    }
}

function isServer() {
    if (document.body.classList.contains('no-server')) {
        document.body.classList.remove('no-server');
        let titlesSection = document.querySelectorAll('h2');
        titlesSection.forEach(el=>{
            el.classList.remove('visually-hidden');
        })
    }
}