import axios from "axios";
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

const listRevievsEl = document.querySelector('.js-reviews-wrapper');

async function getReviews() {
  const BASE_URL = 'https://portfolio-js.b.goit.study/api/reviewsі';

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });

    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function createMurkupListReviews(data) {
  const murkupReviews = data.map(item => {
    const { author, avatar_url, review } = item;
    return `
      <li class="reviews-wrapper-cart swiper-slide">
        <p class="reviews-descr">
          ${review}
        </p>
        <div class="reviews-autor-wrapper">
          <img
            class="reviews-autor-photo"
            width="40"
            height="40"
            src="${avatar_url}"
            alt="${author}"
          />
          <p class="reviews-autor-name">${author}</p>
        </div>
      </li>
    `;
  }).join('');
  return murkupReviews;
}

// Функція для відображення повідомлення "Not found"
function displayNotFoundMessage() {
  listRevievsEl.innerHTML = `<div class="reviev-not-found-wrapper">
                              <p class="revievs-not-found">Not found</p></div>`; // Додаємо повідомлення
}

async function useReviews() {
  try {
    const reviews = await getReviews();
    
    if (reviews.length === 0) { // Перевірка на порожній масив
      displayNotFoundMessage(); // Відображення повідомлення, якщо немає відгуків
    } else {
      listRevievsEl.insertAdjacentHTML('afterbegin', createMurkupListReviews(reviews));
    }
  } catch (error) {
    console.error('Error using reviews:', error);
    displayNotFoundMessage(); // Відображення повідомлення при помилці
  }
}
useReviews();

// Налаштування Swiper
const swiper = new Swiper('.swiper', {
  // Налаштування для кількості слайдів
  slidesPerView: 1, // за замовчуванням - 1 слайд
  spaceBetween: 32, // відстань між слайдами

  // Налаштування для адаптивності
  breakpoints: {
    1280: {
      slidesPerView: 2, // 2 слайди при ширині 1280 пікселів та більше
    },
  },

  // Кнопки навігації
  navigation: {
    nextEl: '.reviews-arrow-box-right',
    prevEl: '.reviews-arrow-box-left',
    disabledClass: 'disabled', // клас для відключених кнопок
  },

  loop: false, // Вимкнено зациклення
});

// Функція для оновлення стану кнопок навігації
function updateNavigation() {
  const totalSlides = swiper.slides.length;
  const currentIndex = swiper.activeIndex;
  const viewportWidth = window.innerWidth;

  // Увімкнення/вимкнення кнопок навігації
  swiper.navigation.prevEl.disabled = currentIndex === 0;

  if (viewportWidth >= 1280) {
    swiper.navigation.nextEl.disabled = currentIndex >= totalSlides - 2;
  } else {
    swiper.navigation.nextEl.disabled = currentIndex >= totalSlides - 1;
  }
}

swiper.on('slideChange', updateNavigation);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    swiper.slidePrev();
  } else if (event.key === 'ArrowRight') {
    swiper.slideNext();
  }
});
