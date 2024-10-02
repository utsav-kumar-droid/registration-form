const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.9nlrb.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname,'pages')));

app.get("/", (req, res) => {
    res.sendFile(__dirname +"/dist/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;


        const existingUser= await Registration.findOne({email: email});

        // check for existing user
        if(!existingUser){
            const registrationData = new Registration({ name, email, password });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }


        } catch (error) {
            console.log(error);
            res.redirect("/error");
        }



       
    }
);

app.get("/success", (req, res) => {
    res.sendFile(__dirname+"/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname+"/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
