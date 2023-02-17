import axios from 'axios';

const btnLoadMore = document.querySelector('.load-more');

export default class NewApiService {
  constructor() {
    this.searchForm = '';
    this.responseData = '';
    this.page = 1;
  }

  async getNewData(searchForm) {
    this.isHiddenBtnLoadMore();
    const config = {
      params: {
        q: `${this.searchForm}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: `${this.page}`,
      },
    };
    try {
      const response = await axios.get(
        'https://pixabay.com/api/?key=33562474-9b4f417d280f9894cc2119516',
        config
      );
      this.page += 1;
      this.responseData = await response.data;
      return this.responseData;
    } catch (error) {
      console.log(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  isHiddenBtnLoadMore() {
    btnLoadMore.hidden = true;
  }
}
