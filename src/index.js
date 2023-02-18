import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewApiService from './components/newApiService';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryConteiner: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
const { searchForm, galleryConteiner, btnLoadMore } = refs;

const newApiService = new NewApiService();
let gallery = new SimpleLightbox('.gallery a', {
  showCounter: false,
  widthRatio: 0.9,
  heightRatio: 0.9,
});

searchForm.addEventListener('submit', onSearchFormSubmit);
btnLoadMore.addEventListener('click', onBtnLoadMoreClick);
galleryConteiner.addEventListener('click', onGalleryConteinerClick);

function onSearchFormSubmit(evt) {
  evt.preventDefault();

  clearGalleryContainer();
  newApiService.searchForm = evt.currentTarget.elements.searchQuery.value;
  newApiService.resetPage();
  newApiService.getNewData().then(responseData => {
    notification(responseData);
    drawInterface(responseData);
    if (responseData.totalHits !== 0) {
      isNotHiddenBtnLoadMore();
    }
  });
}

function onBtnLoadMoreClick() {
  newApiService.isHiddenBtnLoadMore();
  newApiService.getNewData().then(responseData => {
    drawInterface(responseData);
    smoothScrolling();
    if (responseData.hits.length === 0) {
      newApiService.isHiddenBtnLoadMore();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      isNotHiddenBtnLoadMore();
    }
  });
}

function drawInterface(responseData) {
  const markup = responseData.hits
    .map(
      ({
        webformatURL,
        tags,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a href="${largeImageURL}">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /> 
        <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </div>
        </div>
        </a>`
    )
    .join('');
  galleryConteiner.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearGalleryContainer() {
  galleryConteiner.innerHTML = '';
}

function notification(responseData) {
  if (responseData.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.info(`Hooray! We found ${responseData.totalHits} images.`);
  }
}

function onGalleryConteinerClick(evt) {
  evt.preventDefault();
}

function isNotHiddenBtnLoadMore() {
  btnLoadMore.hidden = false;
}

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight - 100,
    behavior: 'smooth',
  });
}
