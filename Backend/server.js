const express = require("express");
require("dotenv").config();

const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");

const sendMail = require("./sendMail.js");
const app = express();

let passGenerat = null;
let usernameGlobal = null;
let emailGlobal = null;

app.use(cors());
app.use(express.json());

const dbpath = path.join(__dirname, "database.db");
let db = null;

const intializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });

    app.listen(process.env.PORT, () => {
      console.log(`server running at ${process.env.PORT} port`);
    });
  } catch (e) {
    console.log(`DB Error `);
  }
};

intializeDbAndServer();

const authentication = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  //   console.log(authHeader);
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (authHeader === undefined) {
    response.status(407);
    response.send({ msg: "Inavlid user" });
  } else {
    jsonwebtoken.verify(jwtToken, "my-secret-token", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send({ msg: "invalid jwt token" });
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

app.get("/api/testing", async (req, res) => {
  //   const query = `select * from offers`;
  //   const dt = await db.all(query);
  res.send("hey jahnu ms nw");
});

app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  //   console.log(req);
  passGenerat = Math.ceil(Math.random() * 100001);

  const query = `select * from userdetails where email=?`;

  const user = await db.get(query, [email]);
  //   console.log(user);
  if (user === undefined) {
    res.status(400);
    res.send({ msg: "Invalid user" });
  } else {
    usernameGlobal = user.email;
    // console.log(user);
    const sub = "Login OTP from ANCHORES";
    const tex = ` Hi,
       ${passGenerat} is your ANCHORES verification OTP. Please do not
        share it with anyone.
        
        Team ANCHORES`;

    sendMail(email, sub, tex);
    // console.log(token);
    res.send({ msg: "password sent to email" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { email, username } = req.body;
  usernameGlobal = email;
  passGenerat = Math.ceil(Math.random() * 100001);

  const user = `select * from userdetails where email=?;`;
  const userdtls = await db.get(user, [email]);

  if (userdtls === undefined) {
    const sub = "Login OTP from ANCHORES";
    const tex = ` Hi,
       ${passGenerat} is your ANCHORES verification OTP. Please do not
        share it with anyone.
        
        Team ANCHORES`;

    sendMail(email, sub, tex);

    const query = `insert into userdetails(username,email)
    values(?,?);`;

    const upload = await db.run(query, [username, email]);
    res.send({ msg: "successfully send OTP please verify" });
  } else {
    res.send({ msg: "User already exist please login" });
  }
});

app.post("/api/verify", (req, res) => {
  const { otp } = req.body;
  //   console.log("otp  ", otp, " passgen", passGenerat);
  if (passGenerat == otp) {
    const payload = { username: usernameGlobal };

    const token = jsonwebtoken.sign(payload, "my-secret-token");
    res.send({ token });
  } else {
    res.status(400);
    res.send({ msg: "Invalid password" });
  }
});

app.get("/api/profile", authentication, async (req, res) => {
  let { username } = req;
  const qry = `select * from userdetails where email=?`;
  const userdtails = await db.get(qry, [username]);
  //   console.log(username);
  res.send(userdtails);
});

app.get("/api/allpost", authentication, async (req, res) => {
  const query = `select * from messages `;
  const posts = await db.all(query);
  res.send(posts);
});

app.get("/api/commented", authentication, async (req, res) => {
  let { username } = req;
  const query = `select * from userdetails where email=?`;
  const userdtails = await db.get(query, [username]);

  const qryMsg = `select * from messages INNER JOIN comments 
    ON messages.id=comments.massageId 
     where messages.userId=?`;

  const commentMsg = await db.all(qryMsg, [userdtails.id]);
  res.send(commentMsg);
});

app.get("/api/replied", authentication, async (req, res) => {
  let { username } = req;
  const query = `select * from userdetails where email=?`;
  const userdtails = await db.get(query, [username]);

  const qryMsg = `select comments.id as commentId from messages INNER JOIN comments 
    ON messages.id=comments.massageId
     where messages.userId=?`;

  const commentMsg = await db.all(qryMsg, [userdtails.id]);

  const qryreply = `select * from reply
  where commentId=?`;
  const replyData = await db.all(qryreply, [commentMsg.commentId]);

  res.send(replyData);
});

app.post("/api/postcomment", authentication, async (req, res) => {
  let { username } = req;
  const { title, description } = req.body;
  //   console.log(title);
  const query = `select * from userdetails where email=?`;
  const userdtails = await db.get(query, [username]);

  const massageQry = `INSERT INTO messages(massage,userId,massageTitle) VALUES(?,?,?)`;
  const msgDetails = await db.run(massageQry, [
    description,
    userdtails.id,
    title,
  ]);
  const sub = "POST IS LIVE";
  const tex = `your post is posted you sea in all posts your post title is ${title}`;
  sendMail(username, sub, tex);
  res.send({ msg: "success fully uploaded" });
});
