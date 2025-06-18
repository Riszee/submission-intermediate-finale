import { getAuth } from '../../utils/auth';
import { parseActivePathname } from '../../routes/url-parser';

export default class DetailPresenter {
  constructor({ view, model, navigateCallback }) {
    this._view = view;
    this._model = model;
    this._navigateCallback = navigateCallback;
  }

  async initialize() {
    const auth = getAuth();
    if (!auth) {
      this._navigateCallback('#/login');
      return;
    }

    const { id } = parseActivePathname();
    try {
      const response = await this._model.getStoryDetail(id, auth.token);
      if (response.error) {
        this._view.showErrorDialog(response.message, true);
        return;
      }

      this._view.displayStory(response.story);
      this._view.setupMap(response.story, () => {
        this._view.animateStoryCard();
      });
    } catch (error) {
      this._view.showErrorDialog(`Failed to load story: ${error.message}`, true);
    }
  }
}