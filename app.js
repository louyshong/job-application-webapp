const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/form.html");
});

app.post("/", function(req, res) {
    const name = req.body.Name; 
    const contact = req.body.Contact;
    const address = req.body.Address;
    const position = req.body.Position;
    console.log(req);
    console.log(name, contact, address, position);
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
