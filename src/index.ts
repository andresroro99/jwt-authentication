import { PasswordHash } from "./security/passwordHash";
import { createConnection } from "typeorm";
import { Database } from "./database";
import { RegisterDTO } from "./dto/request/register.dto";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";
import { AuthenticationDTO } from "./dto/response/authentication.dto";
import { UserDTO } from "./dto/response/user.dto";
//import { RequestValidator } from "./security/requestValidator";
import { JWT } from "./security/jwt";

const app = express();

// middleware
app.use(express.json());

Database.initialize();

// requests
app.get("/", (req: Request, resp: Response) => {
  resp.send("Hello there");
});

app.post("/register", async (req: Request, resp: Response) => {
  try {
    const body: RegisterDTO = req.body;
    const { username, password, email, repeatPassword, age } = body;

    // request validators
    if (password !== repeatPassword) throw Error("Password not equal");
    if (await Database.userRepository.findOne({ email: email }))
      throw Error("Email already used");

    // save body into user entity
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = await PasswordHash.hashPassword(password);
    user.age = age;

    // insert to database
    await Database.userRepository.save(user);

    // prepare authenticated user response
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    const userDTO: UserDTO = new UserDTO();
    userDTO.id = user.id;
    userDTO.username = user.username;
    userDTO.age = user.age;
    userDTO.email = user.email;

    const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(user);

    authenticationDTO.user = userDTO;
    authenticationDTO.token = tokenAndRefreshToken.token;
    authenticationDTO.refreshToken = tokenAndRefreshToken.refreshToken;

    resp.json(authenticationDTO);
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => console.log("connected on port: ", 4000));

// initialize
createConnection()
  .then(async (connection) => {})
  .catch((error) => console.log(error));
