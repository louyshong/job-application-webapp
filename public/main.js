const nextButton = $(".next-btn");
const prevButton = $(".prev-btn");

nextButton.click(function() {
    // Second page form fields are not relevant now
    $("form .second-page input").removeAttr("required");

    // If first page form fields are all valid, allow user to move on to next page
    if ($("form")[0].reportValidity()) {
        $("form .first-page").removeClass("active");
        $("form .second-page").addClass("active");
    } 

    // Restore required attribute (note that is a boolean attribute, so "" is used)
    $("form .second-page input").attr("required", "");
})

prevButton.click(function() {
    $("form .second-page").removeClass("active");
    $("form .first-page").addClass("active");
})

const eduAddButton = $(".education .add-btn");
const eduRemoveButton = $(".education .remove-btn");
const empAddButton = $(".employment .add-btn");
const empRemoveButton = $(".employment .remove-btn");

// Add form fields on second page 
eduAddButton.click(function() {
    // Clone set of entries
    const newField = $(".education .entry").first().clone();

    // Reset inputs 
    newField.find("input").val("");

    // Insert horizontal line 
    $(".education .add-btn").before("<hr>");
    
    // Insert new set of entries
    $(".education .add-btn").before(newField);

    // Show remove button
    $(".education .remove-btn").addClass("active");
})

empAddButton.click(function() {
    // Clone set of entries
    const newField = $(".employment .entry").first().clone();

    // Reset inputs 
    newField.find("input").val("");

    // Insert horizontal line 
    $(".employment .add-btn").before("<hr>");
    
    // Insert new set of entries
    $(".employment .add-btn").before(newField);

    // Show remove button
    $(".employment .remove-btn").addClass("active");
})

// Remove form fields on second page 
eduRemoveButton.click(function() {
    const allDivs = $(".education .entry");
    const allLines = $(".education hr");

    // Remove horizontal line
    if (allLines.length > 0) {
        allLines[allLines.length - 1].remove();
    }

    // Remove the last div and button if only 1 div left
    if (allDivs.length > 1) {
        allDivs[allDivs.length - 1].remove();
        if (allDivs.length === 2) {
            $(".education .remove-btn").removeClass("active");
        }
    } 
})

empRemoveButton.click(function() {
    const allDivs = $(".employment .entry");
    const allLines = $(".employment hr");

    // Remove horizontal line
    if (allLines.length > 0) {
        allLines[allLines.length - 1].remove();
    }

    // Remove the last div and button if only 1 div left
    if (allDivs.length > 1) {
        allDivs[allDivs.length - 1].remove();    
        if (allDivs.length === 2) {
            $(".employment .remove-btn").removeClass("active");
        }
    } 
})

const contactField = $("input[name='Contact']");

contactField.attr("oninvalid", "setCustomValidity('Please enter a phone number.')");
contactField.attr("oninput", "setCustomValidity('')");

const form = $("form");

form.keydown(function(e) {
    if (e.keyCode === 13) {
        e.preventDefault(); // Prevent form submission on enter key
    }
})