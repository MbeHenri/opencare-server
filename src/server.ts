import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import https from 'https';
import fs from 'fs';

import { PatientModel as Patient } from "./models/Patient";
import { port, dbURI, key_token, CORS_ALLOW_HOSTS, KEY_PATH, CERT_PATH } from "./config";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

import Routes from "./routes";

const app = express();
const PORT = port;
app.use(
  cors({
    origin: CORS_ALLOW_HOSTS,
    credentials: true,
  })
);

// use bodyParser middleware to receive form data
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlencodedParser);

// connects to mongoDB database
// second parameter removes deprecation errors

const options: ConnectOptions = {};

// SSL OPTIONS
const ssl_options = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
  //ca: fs.readFileSync(process.env.SSL_CA_PATH)
};

mongoose
  .connect(dbURI, options)
  .then(() => {
    // only listen for requests once database data has loaded
    //app.listen(PORT, () => console.log(`Server has started at port ${PORT}`));
    https.createServer(ssl_options, app).listen(PORT, () => {
        console.log(`Server is running on https://doctor.backbone-corp.com:${PORT}`);
    })
  })
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Define basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is working properly' });
});



/*app.post("/login", (req, res) => {
  const { username, password } = req.body;
  Patient.findOne({ username }).then((patient) => {
    if (!patient) {
      return res.json({
        message: "Nom utilisateur ou mot de passe inccorect",
        code: 400,
      });
    }
    bcrypt.compare(password, patient.password, (err, result) => {
      if (result) {
        const payload = {
          uuid: patient.uuid,
          username: patient.username,
          display: patient.person.display
        };
        jwt.sign(
          payload,
          key_token,
          {
            expiresIn: "1hr",
          },
          (err, token) => {
            if (err) return res.json({ message: err });
            return res.json({
              message: "Success",
              patient: patient,
              token: "Bearer " + token,
              code: 201,
            });
          }
        );
      } else {
        return res.json({ message: "Invalid Username or Password", code: 400 });
      }
    });
  });
});

app.get("/protected", verifyJWT);*/

function verifyJWT(req: Request, res: Response) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, key_token, (err, decoded) => {
      if (err || !decoded) {
        return res.status(403).json({
          isLoggedIn: false,
          message: "Failed to Authenticate",
        });

      }
      res.json({
        uuid: (decoded as jwt.JwtPayload).uuid,
        username: (decoded as jwt.JwtPayload).username,
        display: (decoded as jwt.JwtPayload).display
      });

    });
  } else {

    res.status(403).json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
}

Routes.register(app)
