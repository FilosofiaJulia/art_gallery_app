/* API */
const BASE_SERVER_PATH = 'https://api.artic.edu/api/v1/artworks';

function sendRequest({url}) {
    return fetch(BASE_SERVER_PATH + url);
}

sendRequest({url: '?page=2&limit=100&fields=id,title,image_id,date_start,date_end,date_display,artist_title,description,artwork_type_title'})
.then((response) => {
    return response.json();
})
.then(function(data) {
    let myData = data; 
    let dataConfig = data.config; // для формирования ссылки на изображения
    let artWorkData = data.data; // массив с данными о произведениях искусства
    console.log(myData);
    for (let i = 0; i <= artWorkData.length - 1; i++) {
        if (artWorkData[i].artwork_type_title === "Painting") {
            createCard(artWorkData[i], dataConfig);
            createSlide(artWorkData[i], dataConfig);
        }
    } 
})
.catch(err => {
    console.error('Ошибка при получении данных', err);
});


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

// cоздание карточки с произведением искусства

function createCard(data, config) {
    const cardList = document.querySelector('.artworks__list');
    let card = createElem('li', 'artworks__item card');
    let cardImg = createImage('card__img', config, data);
    let cardName = createElem('p', 'card__name');
    cardName.textContent = `Name: ${data.title || 'unknown'}`;
    let cardArtist = createElem('p', 'card__artist');
    cardArtist.textContent = `Artist: ${data.artist_title || 'unknown'}`;
    let cardYears = createElem('p', 'card__years');
    cardYears.textContent = `Year of publication: ${data.date_display || 'unknown'}`;
    card.appendChild(cardImg);
    card.appendChild(cardName);
    card.appendChild(cardArtist);
    card.appendChild(cardYears);
    cardList.appendChild(card);
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
