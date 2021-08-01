const nextButton = document.querySelector(".next-btn");
const prevButton = document.querySelector(".prev-btn");

nextButton.addEventListener("click", function() {
    document.querySelector("form .first-page").classList.remove("active");
    document.querySelector("form .second-page").classList.add("active");
})

prevButton.addEventListener("click", function() {
    document.querySelector("form .second-page").classList.remove("active");
    document.querySelector("form .first-page").classList.add("active");
})

const eduAddButton = document.querySelector(".education .add-btn");
const eduRemoveButton = document.querySelector(".education .remove-btn");
const empAddButton = document.querySelector(".employment .add-btn");
const empRemoveButton = document.querySelector(".employment .remove-btn");

// Add form fields on second page 
eduAddButton.addEventListener("click", function() {
    // Clone set of entries
    const newField = document.querySelector(".education .entry").cloneNode(true);

    // Reset inputs 
    const inputs = newField.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = null;
    }

    // Insert horizontal line 
    const line = document.createElement("hr")
    document.querySelector(".education").insertBefore(line, document.querySelector(".education .add-btn"));
    
    // Insert new set of entries
    document.querySelector(".education").insertBefore(newField, document.querySelector(".education .add-btn"));
})

// Remove form fields on second page 
eduRemoveButton.addEventListener("click", function() {
    const allDivs = document.querySelectorAll(".education .entry");
    const allLines = document.querySelectorAll(".education hr");

    // Remove horizontal line
    if (allLines.length > 0) {
        allLines[allLines.length - 1].remove();
    }

    // Remove the last div 
    if (allDivs.length > 1) {
        allDivs[allDivs.length - 1].remove();
    }
})