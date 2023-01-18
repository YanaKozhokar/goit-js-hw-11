import Notiflix from 'notiflix';
import axios from 'axios';

const searchFormHandler = document.querySelector('#search-form');
const inputRef = document.querySelector('.search-input');
const galleryRef = document.querySelector('.gallery-list');
const buttonMoreEl = document.querySelector('.load-more');
const alertEl = document.querySelector('.text');

searchFormHandler.addEventListener('submit', createGallery);
buttonMoreEl.addEventListener('click', onButtonClick);

let page = 1;
let keyValue = '';
let totalPages = 0;

function createGallery(event) {
  event.preventDefault();
  keyValue = inputRef.value;
  page = 1;
  galleryRef.innerHTML = '';
  alertEl.classList.add('hidden');
  if (keyValue.trim() === '') {
    Notiflix.Notify.info('Oops! Please, enter smth to search.');
    buttonMoreEl.classList.add('hidden');
    return;
  }
  fetchImages(keyValue);
  event.currentTarget.reset();
}

async function fetchImages(input) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=32921127-0509bb2923ebc5e2476cd7059&q=$${input}&image_type=photo&orientation=horizontal&safesearch=true&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&page=${page}&per_page=40`
    );
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      buttonMoreEl.classList.add('hidden');
      alertEl.classList.add('hidden');
      return;
    }
    if (page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }
    buttonMoreEl.classList.remove('hidden');
    totalPages = Math.ceil(response.data.totalHits / 40);
    createMarkup(response.data.hits);
    page += 1;
    if (page > totalPages) {
      alertEl.classList.remove('hidden');
      buttonMoreEl.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(images) {
  const markup = images
    .map(image => {
      return `<li class="gallery-item">
      <div class="photo-card">
        <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${image.downloads}
          </p>
        </div>
      </div>
    </li>`;
    })
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function onButtonClick() {
  fetchImages(keyValue);
}