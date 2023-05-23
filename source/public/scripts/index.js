// CHANGE STYLE
document.querySelector("#btn-style").addEventListener("click", changeMode);
function changeMode() {
  const element = document.body;
  element.classList.toggle("dark-mode");
}
