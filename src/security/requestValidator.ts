import { Database } from "../database";
export class RequestValidator {
  public static async emailValidator(email: string) {
    if (await Database.userRepository.findOne({ email: email }))
      throw Error("Email already used");
  }
  public static async passwordValidator(
    password: string,
    repeatPassword: string
  ) {
    if (password !== repeatPassword) throw Error("Password not equal");
  }
}
