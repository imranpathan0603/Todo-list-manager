// Dark Mode - Auto and Manual Handling
// check system theme preference

const systemPrefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
// check localStorage theme
let savedTheme = localStorage.getItem("theme");

// apply theme based on preference
if (savedTheme === "dark" || (!savedTheme && systemPrefDark)) {
  document.body.classList.add("dark");
  document.querySelector("#themeToggle").checked = true;
}

// toggle button event
document.querySelector("#themeToggle").addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// keyboard shortcut: Shift + D theme toggle
document.addEventListener("keydown", function (e) {
  if (e.shiftKey && e.key === "D") {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    document.querySelector("#themeToggle").checked = isDark;

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }
});
