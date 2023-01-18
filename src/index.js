import Notiflix from 'notiflix';

const searchFormHandler = document.querySelector('#search-form');
const inputRef = document.querySelector('.search-input');
const galleryRef = document.querySelector('.gallery');

searchFormHandler.addEventListener('submit', createGallery);

let page = 1;

function createGallery(event) {
  event.preventDefault();
  galleryRef.innerHTML = '';
  const input = inputRef.value.trim();
  if (input != '') {
    fetchImages(input).then(response => createMarkup(response));
  }
}

async function fetchImages(input) {
  return await fetch(
    `https://pixabay.com/api/?key=32921127-0509bb2923ebc5e2476cd7059&q=$${input}&image_type=photo&orientation=horizontal&safesearch=true&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&page=${page}`
  )
    .then(response => response.json())
    .then((page += 1));
}

function createMarkup(images) {
  if (images.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    const markup = images.hits
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
}
