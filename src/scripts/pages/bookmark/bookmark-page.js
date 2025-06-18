import BookmarkView from './bookmark-view';
import BookmarkModel from './bookmark-model';
import BookmarkPresenter from './bookmark-presenter';

export default class BookmarkPage {
  constructor(navigateCallback) {
    this._view = new BookmarkView();
    this._model = new BookmarkModel();
    this._presenter = new BookmarkPresenter({ view: this._view, model: this._model, navigateCallback });
  }

  async render() {
    return this._view.render();
  }

  async afterRender() {
    await this._presenter.initialize();
  }
}