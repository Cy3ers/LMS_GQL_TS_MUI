// ./src/models/Task.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: string;
  public priority!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Task"
  }
);

// Define associations
User.hasMany(Task, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "tasks"
});

Task.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

export default Task;
