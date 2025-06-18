import { showFormattedDate } from '../../utils/index';
import { saveStory, deleteStory, isStoryBookmarked } from '../../data/indexedDB';

export default class DetailView {
  constructor() {
    this._onNavigate = null;
  }

  setNavigationCallback(callback) {
    this._onNavigate = callback;
  }

  render() {
    return `
      <section class="container detail-container">
        <div class="detail-header">
          <h1 class="section-title">Story Details</h1>
        </div>
        <article id="story-detail" class="story-detail-card" role="article"></article>
        <div class="map-container">
          <h2 class="map-title">Location</h2>
          <div id="map" class="map"></div>
        </div>
      </section>
    `;
  }

  async displayStory(story) {
    const isBookmarked = await isStoryBookmarked(story.id);
    document.querySelector('#story-detail').innerHTML = `
      <div class="story-content">
        <h2 id="story-${story.id}" class="story-title" tabindex="0">${story.name}</h2>
        <div class="story-image-container">
          <img src="${story.photoUrl || 'https://placehold.co/300x169/png'}" alt="${story.description}" class="story-image" loading="lazy" onerror="this.src='https://placehold.co/300x169/png'"/>
        </div>
        <div class="story-meta">
          <p class="story-date"><i class="fas fa-calendar-alt"></i> Posted on ${showFormattedDate(story.createdAt)}</p>
        </div>
        <p class="story-description">${story.description}</p>
        <button class="bookmark-story" data-id="${story.id}">${isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</button>
      </div>
    `;

    document.querySelector('.bookmark-story').addEventListener('click', async () => {
      const isBookmarked = await isStoryBookmarked(story.id);
      if (isBookmarked) {
        await deleteStory(story.id);
        document.querySelector('.bookmark-story').textContent = 'Bookmark';
        this.showErrorDialog('Story removed from bookmarks', false);
      } else {
        await saveStory(story);
        document.querySelector('.bookmark-story').textContent = 'Remove Bookmark';
        this.showErrorDialog('Story bookmarked successfully', false);
      }
    });
  }

  setupMap(story, onMapReady) {
    const map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView(story.lat && story.lon ? [story.lat, story.lon] : [-6.2088, 106.8456], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: 'map-tiles',
    }).addTo(map);

    if (story.lat && story.lon) {
      L.marker([story.lat, story.lon], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-pin"><i class="fas fa-map-marker-alt"></i></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        }),
      })
        .addTo(map)
        .bindPopup(`
          <div class="map-popup">
            <h3>${story.name}</h3>
            <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
          </div>
        `)
        .openPopup();
    }

    onMapReady();
  }

  animateStoryCard() {
    const storyCard = document.querySelector('.story-detail-card');
    if (storyCard) {
      storyCard.classList.add('animate');
    }
  }

  showErrorDialog(message, redirectToContent = false) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('alert-dialog');
    dialog.innerHTML = `
      <div class="dialog-content">
        <p>${message}</p>
        <button class="dialog-button">OK</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('.dialog-button').addEventListener('click', () => {
      dialog.close();
      dialog.remove();
      if (redirectToContent && this._onNavigate) {
        this._onNavigate('#/content');
      }
    });
  }
}