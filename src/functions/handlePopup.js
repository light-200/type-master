import { infoPopup } from "../ui/uiElements";

export default function handlePopup(msg, time) {
  infoPopup.classList.toggle("hide");
  infoPopup.classList.remove("fadeOut");
  infoPopup.innerHTML = msg;

  setTimeout(() => {
    infoPopup.classList.add("fadeOut");
    setTimeout(() => {
      infoPopup.classList.add("hide");
    }, 200);
  }, time);

  document.addEventListener("click", () => {
    if (!infoPopup.classList.contains("hide")) {
      infoPopup.classList.add("fadeOut");
      setTimeout(() => {
        infoPopup.classList.add("hide");
      }, 200);
    }
  });
}
