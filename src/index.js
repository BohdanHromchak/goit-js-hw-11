// Підключення бібліотеки SimpleLightbox: https://simplelightbox.com/ (import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm")
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
form.addEventListener('input', onInput);
loadMoreBtn.addEventListener('click', onLoadMore);
gallery.addEventListener('click', onGalleryClick);

loadMoreBtn.style.visibility = 'hidden';

let page = 1;

/* 
fetching images
 */
const fetchImage = async (searchedImages, page) => {
  const response = await fetch(
    `https://pixabay.com/api/?key=32715422-e0410e3c137bf18af69487d41&q=${searchedImages}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  const images = await response.json();
  return images;
};

/* 
search button
 */
function onSubmit(evt) {
  evt.preventDefault();
  if (!input.value) {
    return;
  }
  fetchImage(onInput()).then(images => {
    gallery.innerHTML = '';

    if (images.totalHits > 40) {
      loadMoreBtn.style.visibility = 'visible';
    }
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      loadMoreBtn.style.visibility = 'hidden';
    } else {
      createGalleryMarkup(images.hits);
      Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
    }
  });
}

/* 
load more button
 */
function onLoadMore() {
  page += 1;
  fetchImage(onInput(), page).then(images => {
    createGalleryMarkup(images.hits);
    if (images.totalHits === gallery.children.length) {
      loadMoreBtn.style.visibility = 'hidden';
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

/* 
input function
 */
function onInput() {
  return input.value;
}

/* 
on gallery click function
 */

function onGalleryClick(evt) {
  evt.preventDefault();
}

/* 
create gallery markup
 */
function createGalleryMarkup(images) {
  const galleryMarkup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" class="gallery__image" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div></a>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryMarkup);

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
