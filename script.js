/* API */
const BASE_SERVER_PATH = 'https://api.artic.edu/api/v1';
const ARTWORKS_SERVER_PATH = BASE_SERVER_PATH  + '/artworks';
//localStorage.clear();
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
    const cardList = document.querySelector('.artworks__list');

    for (let i = 0; i <= artWorkData.length - 1; i++) {
        if (artWorkData[i].artwork_type_title === "Painting") {
            let artWorkCard = createBaseCard(artWorkData[i]);
            artWorkCard.dataset.id = `${artWorkData[i].id}`;
            let cardImg = createImage('card__img', dataConfig, artWorkData[i]);
            let likeBtn = createElem('button', 'card__btn card__btn_like');
            likeBtn.innerHTML = '<svg width="800px" height="800px" viewBox="0 0 24 24"><path d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z"/></svg>';
            artWorkCard.appendChild(cardImg);
            artWorkCard.appendChild(likeBtn);

            likeBtn.addEventListener('click', () => {
                let favoriteArt = new Object();
                favoriteArt.id = artWorkData[i].id;
                favoriteArt.title = artWorkData[i].title;
                favoriteArt.artist_title = artWorkData[i].artist_title;
                favoriteArt.date_display = artWorkData[i].date_display;
                favoriteArt.image = `${dataConfig.iiif_url}/${artWorkData[i].image_id}/full/843,/0/default.jpg`;
                console.log(favoriteArt);
                addFavorite(favoriteArt);
                likeBtn.classList.add("shake"); // Добавляем анимацию для кнопок-лайков
            });
            cardList.appendChild(artWorkCard);
        }
    }
}
// TODO карточки после загрузки, если есть в хранилище, должны быть отрисованы при загрузке странцы!!!!!!
// добавить функцию initPage

// cоздание базовой карточки без кнопок

function createBaseCard(data) {
    let card = createElem('li', 'card');
    let cardDescription = createElem('div', 'card__description');
    let cardName = createElem('p', 'card__name');
    cardName.textContent = `${data.title || 'unknown'}`;
    let cardArtist = createElem('p', 'card__artist');
    cardArtist.textContent = `${data.artist_title || 'unknown'}`;
    let cardYears = createElem('p', 'card__years');
    cardYears.textContent = `${data.date_display || 'unknown'}`;
    cardDescription.appendChild(cardName);
    cardDescription.appendChild(cardArtist);
    cardDescription.appendChild(cardYears);
    card.appendChild(cardDescription);
    return card;
}

// cоздание понравившейся карточки для списка избранного
function createFavoriteCard(favoriteArt) {
    let listOfFavoriteCards = document.querySelector('.collection__list');
    let favoriteCard = createBaseCard(favoriteArt);
    favoriteCard.dataset.id = `${favoriteArt.id}`;
    let cardImg = document.createElement('img');
    cardImg.className = 'card__img';
    cardImg.setAttribute('src', `${favoriteArt.image}`);
    cardImg.setAttribute('alt', `${favoriteArt.title}`);
    let deleteBtn = createElem('button', 'card__btn card__btn_delete');
    favoriteCard.appendChild(cardImg);
    favoriteCard.appendChild(deleteBtn);
    listOfFavoriteCards.appendChild(favoriteCard);
}

// Извлекает данные из localStorage или возвращает пустой массив
function getFavorites() {
    return JSON.parse(localStorage.getItem('favoriteArts')) || {};
}

// Сохраняет в localStorage обновлённый объект избранного со всеми данными, разложенными по id
function saveFavorites(favorites) {
    localStorage.setItem('favoriteArts', JSON.stringify(favorites));
}

// Добавляет карточку в избранное, принимает объект со всеми нужными данными
function addFavorite(favoriteArt) {
    const favorites = getFavorites(); // получаем данные из localStorage
    console.log(favorites);
    
    const favoritesIds = Object.keys(favorites).map(Number); // создаем массив из ключей-id, переводим в числа строки
     // проверяем есть ли в localStorage ключи, если нет, сразу записываем
    if (!favoritesIds.includes(favoriteArt.id)) {
        favorites[`${favoriteArt.id}`] = favoriteArt;
        saveFavorites(favorites);
        createFavoriteCard(favoriteArt, dataConfig);
    }
}

// Удаляем картину из избранного, сравнивая ключ объекта localStorage c data-id карточки
function removeFavorite(favoriteCard) {
    const favorites = getFavorites();
    if (Object.keys(favorites).length === 0) return;
    let favoriteCardId = favoriteCard.dataset.id;

    const favoritesIds = Object.keys(favorites).map(Number); // перевела в числа строки
    if (favoritesIds.includes(favoriteCardId)) {
        delete favorites[`${artId}`];
        saveFavorites(favorites);
        if (favoriteCard) {
            favoriteCard.remove(); // удаляем элемент, если он действительно присутствует
        }
    }

    //updateFavoritesDisplay(data, config);
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