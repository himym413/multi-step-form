"use strict";

const headerImage = document.querySelector(".header__image");
if (innerWidth <= 900)
  headerImage.src =
    "http://127.0.0.1:8080/dist/assets/images/bg-sidebar-mobile.svg";

if (innerWidth > 900) {
  headerImage.src =
    "http://127.0.0.1:8080/dist/assets/images/bg-sidebar-desktop.svg";
}
window.addEventListener("resize", () => {
  if (innerWidth > 900)
    headerImage.src =
      "http://127.0.0.1:8080/dist/assets/images/bg-sidebar-desktop.svg";

  if (innerWidth <= 900)
    headerImage.src =
      "http://127.0.0.1:8080/dist/assets/images/bg-sidebar-mobile.svg";
});
