const express = require("express");
const multer  = require('multer'); 
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
require('dotenv').config();

const app = express();
const upload = multer({limits: {fileSize: 1024 * 1024}}).single("CV"); // Maximum file upload size is 1MB
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

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/form.html");
});

app.post("/", function(req, res) {
    upload(req, res, function(multerErr) {
        if (multerErr) {
            console.log("Error: ", multerErr);
            if (multerErr.code === "LIMIT_FILE_SIZE") {
                res.redirect("/failure?type=1");
            } else {
                res.redirect("/failure?type=2");
            }
        } else {
            const name = req.body.Name; 
            const contact = req.body.Contact;
            const address = req.body.Address;
            const position = req.body.Position;
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
                const newEntry = "School: " + schools[i] + "\n" + 
                                 "Programme: " + programmes[i] + "\n" + 
                                 "Grade: " + grades[i] + "\n"; 

                text = text + newEntry + "\n"; 
            }

            text = text + "***** Employment History *****" + "\n";

            for (let i = 0; i < titles.length; i++) {
                // These are all same length as they are required fields
                const newEntry = "Title: " + titles[i] + "\n" + 
                                 "Company: " + companies[i] + "\n" + 
                                 "Location: " + locations[i] + "\n" + 
                                 "Start date: " + startDates[i] + "\n" + 
                                 "End date: " + endDates[i] + "\n";
                
                text = text + newEntry + "\n";
            }

            // Construct message
            const message = {
                from: serverEmail,
                to: recipientEmail,
                subject: "New application from " + name + "!",
                attachments: [{filename: name + "_CV.pdf", content: req.file.buffer}],
                text: text
            };

            // Send mail 
            transporter.sendMail(message, function(mailerError, info) {
                if (mailerError) {
                    console.log("Error: ", mailerError);
                    res.redirect("/failure?type=3");
                } else {
                    console.log("Email sent: " + info.response);
                    res.redirect("/success");
                }
            })
        }
    })
});

app.get("/success", function(req, res) {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function(req, res) {
    switch(req.query.type) {
        case "1":
            res.render("failure", {failureMessage: "Please make sure your CV is less than 1MB."});
            break;
        case "2":
            res.render("failure", {failureMessage: "Please try again."});
            break;
        case "3":
            res.render("failure", {failureMessage: "It was an internal error. Please try again later."});
            break;
        default: 
            res.render("failure", {failureMessage: ""});
    }
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
