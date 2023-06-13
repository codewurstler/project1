class ModeController {
  constructor() {
    this.darkModeBtn = document.querySelector("#btn-style");
    this.bodyMode = document.body;
    this.darkMode = localStorage.getItem("dark-mode");
  }

  setMode() {
    if (this.darkMode === null) {
      localStorage.setItem("dark-mode", "disabled");
    }
  }
  enableDarkMode() {
    this.bodyMode.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "enabled");
  }

  disableDarkMode() {
    this.bodyMode.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", "disabled");
  }

  init() {
    this.setMode();
    this.darkModeBtn.addEventListener("click", () => {
      this.darkMode = localStorage.getItem("dark-mode");
      if (this.darkMode === "disabled") {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    });
  }
}

export default ModeController;
