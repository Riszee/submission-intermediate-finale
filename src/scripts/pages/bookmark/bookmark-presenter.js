export default class BookmarkPresenter {
  constructor({ view, model, navigateCallback }) {
    this._view = view;
    this._model = model;
    this._navigateCallback = navigateCallback;
  }

  async initialize() {
    this._view.showLoading();
    try {
      const response = await this._model.getBookmarkedStories();
      if (response.error) {
        this._view.showErrorDialog(response.message, true);
        return;
      }
      this._view.displayStories(response.listStory);
      this._view.initMap(response.listStory);
    } catch (error) {
      this._view.showErrorDialog(`Failed to load bookmarked stories: ${error.message}`, true);
    } finally {
      this._view.hideLoading();
    }
  }
}