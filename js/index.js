const faceImg = document.getElementById("faceImg");
const wheel = document.getElementById("wheel");
const info_icon = document.getElementById("info_icon");

const DEFAULT_FACE = "/images/speaker/neutral.png";

wheel.addEventListener("mouseover", (e) => {
  const link = e.target.closest("a[data-face]");
  if (!link) return;
  const face = link.getAttribute("data-face");
  if (faceImg && face) faceImg.src = face;
});

info_icon.addEventListener("mouseover", () => {
  if (faceImg) faceImg.src = DEFAULT_FACE;
});
