import HomePage from "../pages/home/home-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import DetailPage from "../pages/detail/detail-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import AboutPage from "../pages/about/about-page";
import NotFoundPage from "../pages/not-found/not-found-page";
import BookmarkPage from "../pages/bookmark/bookmark-page";

const routes = {
  "/": new HomePage(),
  "/add-story": new AddStoryPage(),
  "/stories/:id": new DetailPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/about": new AboutPage(),
  "/bookmarks": new BookmarkPage(),
  "/nothing-found": new NotFoundPage(),
};

export default routes;
