import { getStories } from '../../data/api';
import { getStories as getCachedStories } from '../../data/indexedDB';

export default class HomeModel {
  async getStories({ page = 1, size = 10, location = 0, token }) {
    try {
      const response = await getStories({ page, size, location, token });
      if (!response.error) {
        return response;
      }
      const cachedStories = await getCachedStories();
      return { error: false, listStory: cachedStories };
    } catch (error) {
      const cachedStories = await getCachedStories();
      return { error: false, listStory: cachedStories };
    }
  }
}