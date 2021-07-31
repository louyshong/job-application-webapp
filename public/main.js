const nextButton = document.querySelector("form .next-btn");
const prevButton = document.querySelector("form .prev-btn");

nextButton.addEventListener("click", (e) => {
    document.querySelector("form .first-page").classList.remove("active");
    document.querySelector("form .second-page").classList.add("active");
})

prevButton.addEventListener("click", (e) => {
    document.querySelector("form .second-page").classList.remove("active");
    document.querySelector("form .first-page").classList.add("active");
})