import Notiflix from 'notiflix';

const searchFormHandler = document.querySelector('#search-form');
const inputRef = document.querySelector('input[name="searchQuery"]');

searchFormHandler.addEventListener('submit', fetchImages);

function fetchImages(event) {
  event.preventDefault();
  const input = inputRef.value.trim();
  fetch(
    `https://pixabay.com/api/?key=32921127-0509bb2923ebc5e2476cd7059&q=$${input}&image_type=photo&orientation=horizontal&safesearch=true&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads`
  ).then(response => response.json());
}
