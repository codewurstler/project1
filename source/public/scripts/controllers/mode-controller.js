class ModeController {
  constructor() {
    this.darkModeBtn = document.querySelector("#btn-style");
    this.bodyMode = document.body;
    this.darkMode = localStorage.getItem("dark-mode");
  }

  setMode() {
    if (this.darkMode === "enabled") {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
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
    if (this.darkMode === "enabled") {
      this.enableDarkMode();
    } else {
      localStorage.setItem("dark-mode", "disabled");
    }

    this.darkModeBtn.addEventListener("click", () => {
      this.setMode();
    });
  }
}

export default ModeController;
