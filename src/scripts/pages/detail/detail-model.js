import { getStoryDetail } from '../../data/api';

export default class DetailModel {
  async getStoryDetail(id, token) {
    return await getStoryDetail(id, token);
  }
}