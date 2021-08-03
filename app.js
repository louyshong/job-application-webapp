const express = require("express");
const request = require("request");
const multer  = require('multer'); 
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
require('dotenv').config();

const app = express();
const upload = multer();
const OAuth2 = google.auth.OAuth2;

// Configure recipient email and service
const recipientEmail = process.env.RECIPIENT_EMAIL;
const service = process.env.SERVICE;
const redirectURL = process.env.REDIRECT_URL;

// OAuth2 credentials 
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const serverEmail = process.env.EMAIL;

const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    redirectURL
);

oauth2Client.setCredentials({
    refresh_token: refreshToken
});

const accessToken = oauth2Client.getAccessToken() // Access token refreshes every 3600 seconds

const transporter = nodemailer.createTransport({
    service: service,
    auth: {
        type: "OAuth2",
        user: serverEmail, 
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken
    }
});

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/form.html");
});

app.post("/", upload.single('CV'), function(req, res) {
    let name = req.body.Name; 
    let contact = req.body.Contact;
    let address = req.body.Address;
    let position = req.body.Position;
    let schools = req.body.School; 
    let programmes = req.body.Programme; 
    let grades = req.body.Grade;
    let titles = req.body.Title; 
    let companies = req.body.Company;
    let locations = req.body.Location;
    let startDates = req.body.StartDate; 
    let endDates = req.body.EndDate; 

    // Build message text
    let text = "***** Applicant Details *****" + "\n";
    
    text = text + "Applicant name: " + name + "\n" +
           "Contact: " + contact + "\n" +
           "Address: " + address + "\n" + 
           "Position applied for: " + position + "\n" + "\n";

    // Ensure that these are always arrays (to loop through in for loop)
    if (!Array.isArray(schools)) {
        schools = [schools];
        programmes = [programmes];
        grades = [grades];
    }

    // Ensure that these are always arrays (to loop through in for loop)
    if (!Array.isArray(titles)) {
        titles = [titles];
        companies = [companies];
        locations = [locations];
        startDates = [startDates];
        endDates = [endDates];
    }
    
    text = text + "***** Education *****" + "\n";

    for (let i = 0; i < schools.length; i++) {
        // These are all same length as they are required fields 
        let newEntry = "School: " + schools[i] + "\n" + 
                       "Programme: " + programmes[i] + "\n" + 
                       "Grade: " + grades[i] + "\n"; 

        text = text + newEntry + "\n"; 
    }

    text = text + "***** Employment History *****" + "\n";

    for (let i = 0; i < titles.length; i++) {
        // These are all same length as they are required fields
        let newEntry = "Title: " + titles[i] + "\n" + 
                       "Company: " + companies[i] + "\n" + 
                       "Location: " + locations[i] + "\n" + 
                       "Start date: " + startDates[i] + "\n" + 
                       "End date: " + endDates[i] + "\n";
        
        text = text + newEntry + "\n";
    }

    // console.log(text);
    // console.log(req);
    // console.log(req.file);

    // Construct message
    let message = {
        from: serverEmail,
        to: recipientEmail,
        subject: "New application from " + name + "!",
        attachments: [{filename: name + "_CV.pdf", content: req.file.buffer}],
        text: text
    };

    // Send mail 
    transporter.sendMail(message, function(error, info) {
        if (error) {
            console.log("Error: ", error);
            res.redirect("/failure");
        } else {
            console.log("Email sent: " + info.response);
            res.redirect("/success");
        }
    })
});

app.get("/success", function(req, res) {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function(req, res) {
    res.sendFile(__dirname + "/failure.html");
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
