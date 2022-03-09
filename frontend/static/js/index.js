import Home from "./pages/Home.js";
import Posts from "./pages/Posts.js";
import Settings from "./pages/Settings.js";

const router = async () => {
  const routes = [
    { path: "/", view: Home },
    { path: "/posts", view: Posts },
    { path: "/settings", view: Settings },
  ];

  const pageMatches = routes.map((route) => {
    return {
      route, // route: route
      isMatch: route.path === location.pathname,
    };
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        history.pushState(null, null, e.target.href);
        router();
      }
    });
    router();
  });

  let match = pageMatches.find((pageMatch) => pageMatch.isMatch);

  console.log(match.route.view());

  window.addEventListener("popstate", () => {
    router();
  });

  const page = new match.route.view();

  document.querySelector("#root").innerHTML = await page.getHtml();
};
