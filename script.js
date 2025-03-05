/* API */
const baseUrl = 'https://api.artic.edu/api/v1/artworks';

    fetch(`${baseUrl}?page=2&limit=50`)
   .then(function(response) {
      return response.json();
   })
   .then(function(data) {
        let myData = data; 
        let dataConfig = data.config; // для формирования ссылки на изображения
        let artWorkData = data.data; // массив с данными о произведениях искусства
        console.log(myData);
        console.log(artWorkData);
        for (let i = 0; i <= artWorkData.length - 1; i++) {
            if (artWorkData[i].artwork_type_title === "Painting") {
                createSlide(artWorkData[i], dataConfig);
            }
        }
   })
   .catch(function(error) {
        console.error('Ошибка при получении данных', error);
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

function createElem(tag, className) {
    let elem = document.createElement(tag);
    elem.className = className;
    return elem;
}

function createImage(className, config, data) {
    let elem = document.createElement('img');
    elem.className = className;
    elem.setAttribute('src', `${config.iiif_url}/${data.image_id}/full/843,/0/default.jpg`);
    elem.setAttribute('alt', `${data.artist_title}`);
    return elem;
}

/* SLIDER */
var swiper = new Swiper(".artSwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 55,
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
