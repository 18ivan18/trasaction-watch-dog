import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../services/database.service.js";

export type RuleType = InferAttributes<Rule>;
export class Rule extends Model<
  InferAttributes<Rule>,
  InferCreationAttributes<Rule>
> {
  declare id: number;
  declare fromAddress?: string;
  declare toAddress?: string;
  declare valueFrom?: number;
  declare valueTo?: number;
  declare nonce?: number;
  declare gasPrice?: number;
  declare gasLimit?: number;
  declare blockDelay: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Rule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fromAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    toAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    valueFrom: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    valueTo: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    nonce: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gasPrice: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    gasLimit: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    blockDelay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Rule",
    tableName: "rules",
  },
);
