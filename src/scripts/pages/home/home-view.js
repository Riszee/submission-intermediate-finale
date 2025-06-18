import { showFormattedDate } from "../../utils/index";
import {
  saveStory,
  deleteStory as deleteStoryFromDB,
  isStoryBookmarked,
} from "../../data/indexedDB";

export default class HomeView {
  constructor() {
    this._onNavigate = null;
  }

  setNavigationCallback(callback) {
    this._onNavigate = callback;
  }

  render() {
    return `
      <section class="container">
        <h1 class="section-title">Explore Stories</h1>
        <div id="map" style="height: 350px;"></div>
        <div class="loading-container" id="loading" aria-live="polite" aria-busy="false">
          <div class="loader" aria-label="Loading"></div>
        </div>
        <div id="stories-list" class="stories-grid"></div>
      </section>
    `;
  }

  showLoading() {
    const loadingContainer = document.querySelector("#loading");
    if (loadingContainer) {
      loadingContainer.classList.add("active");
      loadingContainer.setAttribute("aria-busy", "true");
    } else {
      console.warn("Loading container not found in DOM");
    }
  }

  hideLoading() {
    const loadingContainer = document.querySelector("#loading");
    if (loadingContainer) {
      loadingContainer.classList.remove("active");
      loadingContainer.setAttribute("aria-busy", "false");
    } else {
      console.warn("Loading container not found in DOM");
    }
  }

  showLoginMessage() {
    const storiesList = document.querySelector("#stories-list");
    storiesList.innerHTML = `
      <p class="login-message">Please <a href="#/login">login</a> first to view stories.</p>
    `;
  }

  async displayStories(stories) {
    const storiesList = document.querySelector("#stories-list");
    storiesList.innerHTML = "";

    for (const story of stories) {
      const isBookmarked = await isStoryBookmarked(story.id);
      storiesList.innerHTML += `
        <article role="article" aria-labelledby="story-${
          story.id
        }" class="story-card">
          <h2 id="story-${story.id}">${story.name}</h2>
          <img src="${
            story.photoUrl ||
            "https://via.placeholder.com/300x169?text=No+Image"
          }" alt="${
        story.description
      }" loading="lazy" onerror="this.src='https://placehold.co/300x169/png'"/>
          <p>${story.description.substring(0, 100)}${
        story.description.length > 100 ? "..." : ""
      }</p>
          <p class="story-date">Posted on ${showFormattedDate(
            story.createdAt
          )}</p>
          <a href="#/stories/${story.id}" class="story-link">View Details</a>
          <button class="bookmark-story" data-id="${story.id}">${
        isBookmarked ? "Remove Bookmark" : "Bookmark"
      }</button>
          <button class="delete-story" data-id="${story.id}">Delete</button>
        </article>
      `;
    }

    document.querySelectorAll(".bookmark-story").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        const story = stories.find((s) => s.id === id);
        const isBookmarked = await isStoryBookmarked(id);

        if (isBookmarked) {
          await deleteStoryFromDB(id);
          button.textContent = "Bookmark";
          this.showErrorDialog("Story removed from bookmarks", false);
        } else {
          await saveStory(story);
          button.textContent = "Remove Bookmark";
          this.showErrorDialog("Story bookmarked successfully", false);
        }
      });
    });

    document.querySelectorAll(".delete-story").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        if (confirm("Delete this story?")) {
          try {
            await deleteStoryFromDB(id);
            button.closest(".story-card").remove();
            this.showErrorDialog("Story deleted successfully", false);
          } catch (error) {
            this.showErrorDialog(
              `Failed to delete story: ${error.message}`,
              false
            );
          }
        }
      });
    });
  }

  initMap(stories) {
    if (!window.L) {
      console.error("Leaflet library is not loaded.");
      return;
    }

    const map = L.map("map").setView([-6.2088, 106.8456], 5);

    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri",
      }
    );

    osm.addTo(map);

    const baseLayers = {
      OpenStreetMap: osm,
      Satellite: satellite,
    };
    L.control.layers(baseLayers).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(
            `<b>${story.name}</b><br>${story.description.substring(0, 100)}${
              story.description.length > 100 ? "..." : ""
            }`
          );
      }
    });
  }

  showErrorDialog(message, redirectToHome = false) {
    const dialog = document.createElement("dialog");
    dialog.classList.add("alert-dialog");
    dialog.innerHTML = `
      <div class="dialog-content">
        <p>${message}</p>
        <button class="dialog-button">OK</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector(".dialog-button").addEventListener("click", () => {
      dialog.close();
      dialog.remove();
      if (redirectToHome && this._onNavigate) {
        this._onNavigate("#/");
      }
    });
  }
}
