import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../entity/RefreshToken";
import * as moment from "moment";
import { Database } from "../database";

export class JWT {
  private static JWT_SECRET = "123456";
  public static async generateTokenAndRefreshToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const jwtId = uuidv4();

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "1h",
      jwtid: jwtId,
      subject: user.id.toString(),
    });

    const refreshToken = await this.generateRefreshTokenForUserAndToken(
      user,
      jwtId
    );

    return { token, refreshToken };
  }

  private static async generateRefreshTokenForUserAndToken(
    user: User,
    jwtId: string
  ) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    refreshToken.expiryDate = moment().add(10, "d").toDate();

    await Database.refreshTokenRepository.save(refreshToken);

    return refreshToken.id;
  }
}
