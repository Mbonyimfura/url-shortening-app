const selectorElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) return element;
  throw new Error(`Can not find element ${selector}`);
};

const form = document.querySelector("form");
const input = document.querySelector("input");
const result = document.querySelector(".result");
const humberger = selectorElement(".humburger");
const navMenu = selectorElement(".nav-menu");
const newUrl = document.createElement("div");
const errorElement = document.getElementById("error");

humberger.addEventListener("click", () => {
  humberger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = input.value;
  if (!url) {
    errorElement.style.display = "block";
    input.classList.add("error-input");
    return;
  }
  errorElement.style.display = "none";
  shortenUrl(url);
});
input.addEventListener("input", () => {
  errorElement.style.display = "none";
  input.classList.remove("error-input");
});

const shortenUrl = async (url) => {
  try {
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await response.json();

    newUrl.classList.add("item");
    newUrl.innerHTML = `
        <p>${input.value}</p>
        <p>${data.result.short_link}</p>
        <button class="newUrl-btn">Copy</button>`;

    result.prepend(newUrl);
    saveData();
    input.value = "";
  } catch (error) {
    console.log(error);
  }
};

// Event listener for the "Copy" button
result.addEventListener("click", (e) => {
  if (e.target.classList.contains("newUrl-btn")) {
    const copyBtn = e.target;
    const textToCopy = copyBtn.previousElementSibling.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
      }, 2000);
    });
  }
});

const saveData = () => {
  localStorage.setItem("urlData", result.innerHTML);
};

const showUrl = () => {
  result.innerHTML = localStorage.getItem("urlData");
};
showUrl();
