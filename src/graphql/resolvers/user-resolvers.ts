import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/User";

dotenv.config();

const secret = process.env.JWT_SECRET || "Backup Secret";

const userResolvers = {
  Query: {
    users: async () => await User.findAll(),
    me: async (_: any, __: any, { user }: any) => user
  },
  Mutation: {
    register: async (_: any, { username, password }: any) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({ username, password: hashedPassword });
      return newUser;
    },
    login: async (_: any, { username, password }: any) => {
      const user = await User.findOne({ where: { username } });
      if (!user) throw new Error("Invalid username or password.");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error("Invalid username or password.");

      const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: "1h" });
      return { token, user };
    },
    changePassword: async (_: any, { currentPassword, newPassword, confirmPassword }: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated.");

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) throw new Error("Invalid current password.");

      if (newPassword !== confirmPassword) throw new Error("New passwords do not match.");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      return true;
    },
    deleteUser: async (_: any, { id }: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated.");

      const deletedUser = await User.destroy({ where: { id } });
      return deletedUser ? true : false;
    }
  }
};

export default userResolvers;
