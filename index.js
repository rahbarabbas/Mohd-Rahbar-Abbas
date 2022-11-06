const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const otpGenerator = require("otp-generator");
const path = require("path");

const router = express.Router();
app.use(bodyParser.json());

// A map to sore email and a object of {otp, timestamp}
const otpMap = new Map();

router.post("/sendOTP", (req, res) => {
  const { email } = req.body;
  // send error if email does not exists in req.body
  if (!email) {
    return res.status(400).json({ error: "Email is requried" });
  }
  // Used a library to generate 6 digit random otp
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  // Add a entry in otpMap
  otpMap.set(email, JSON.stringify({ otp, timestamp: new Date() }));

  console.log(`OTP for ${email} : ${otp}`);
  // Sending back 200 ok response
  res.json({ msg: "OTP sent" });
});

router.post("/signIn", (req, res) => {
  const { email, otp } = req.body;
  // send error if email does not exists in req.body
  if (!email) {
    return res.status(400).json({ error: "Email is requried" });
  }
  // send error if otp does not exists in req.body
  if (!otp) {
    return res.status(400).json({ error: "OTP is requried" });
  }
  // check for entry in map
  if (!otpMap.get(email)) {
    return res.status(400).json({ error: "Invalid / Expired OTP" });
  }
  const obj = JSON.parse(otpMap.get(email));
  // If otp entered is wrong
  if (otp != obj.otp) {
    return res.status(400).json({ error: "Invalid / Expired OTP" });
  }
  // Delete the given entry for both case(time difference is > 30 or when user successfully signedin)
  otpMap.delete(email);
  const secondDifference =
    Math.abs(new Date().getTime() - new Date(obj.timestamp).getTime()) / 1000;
  // Delete map entry if time difference exceeds 30 seconds
  if (secondDifference > 30) {
    return res.status(400).json({ error: "Invalid / Expired OTP" });
  }
  // send a 200 ok response
  res.send({ msg: "Successfully signed In" });
});

app.use("/api", router);

// host static files

const clientPath = path.normalize(path.join(__dirname, "client"));

app.get("*", express.static(clientPath), async (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server is running at port ${port}`));