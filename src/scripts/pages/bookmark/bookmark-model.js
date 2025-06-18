import { getStories as getCachedStories } from '../../data/indexedDB';

export default class BookmarkModel {
  async getBookmarkedStories() {
    try {
      const stories = await getCachedStories();
      return { error: false, listStory: stories };
    } catch (error) {
      return { error: true, message: `Failed to load bookmarked stories: ${error.message}` };
    }
  }
}