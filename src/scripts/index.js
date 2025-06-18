import App from "./pages/app";
import "../styles/styles.css";
import "regenerator-runtime/runtime";

const app = new App({
  navigationDrawer: document.querySelector("#navigation-drawer"),
  drawerButton: document.querySelector("#drawer-button"),
  content: document.querySelector("#main-content"),
});

window.addEventListener("hashchange", () => {
  app.renderPage();
});

window.addEventListener("load", () => {
  app.renderPage();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Service Worker registered");
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  if (skipLink && mainContent) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    });

    skipLink.addEventListener("focus", () => {
      skipLink.style.opacity = "1";
      skipLink.style.transform = "translateY(0)";
    });

    skipLink.addEventListener("blur", () => {
      skipLink.style.opacity = "0";
      skipLink.style.transform = "translateY(-100%)";
    });
  }

  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.createElement("button");
    installButton.textContent = "My Apps";
    installButton.className = "install-button";
    document.body.appendChild(installButton);
    installButton.addEventListener("click", () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
        installButton.remove();
      });
    });
  });
});
