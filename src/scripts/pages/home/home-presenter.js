import { getAuth, isAuthenticated } from '../../utils/auth';

export default class HomePresenter {
  constructor({ view, model, navigateCallback }) {
    this._view = view;
    this._model = model;
    this._navigateCallback = navigateCallback;
  }

  async initialize() {
    this._view.showLoading();
    try {
      const auth = getAuth();
      const token = isAuthenticated() && auth?.token ? auth.token : null;

      if (!token) {
        this._view.showLoginMessage();
        return;
      }

      const response = await this._model.getStories({ page: 1, size: 10, location: 1, token });
      if (response.error) {
        this._view.showErrorDialog(response.message, true);
        return;
      }
      this._view.displayStories(response.listStory);
      this._view.initMap(response.listStory);
    } catch (error) {
      this._view.showErrorDialog(`Failed to load stories: ${error.message}`, true);
    } finally {
      this._view.hideLoading();
    }
  }
}