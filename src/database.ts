import { Connection, Repository, createConnection } from "typeorm";
import { User } from "./entity/User";
import { RefreshToken } from "./entity/RefreshToken";
export class Database {
  public static connection: Connection;
  public static userRepository: Repository<User>;
  public static refreshTokenRepository: Repository<RefreshToken>;

  public static async initialize() {
    this.connection = await createConnection();
    this.userRepository = this.connection.getRepository(User);
    this.refreshTokenRepository = this.connection.getRepository(RefreshToken);
  }
}
