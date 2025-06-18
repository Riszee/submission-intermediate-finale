export default class NotFoundPage {
  async render() {
    return `
      <section class="container not-found-section">
        <h1 class="section-title">404 - Page Not Found</h1>
        <p class="not-found-message">The page you are looking for does not exist.</p>
        <a href="#/" class="home-link">Back to Home</a>
      </section>
    `;
  }

  async afterRender() {}
}