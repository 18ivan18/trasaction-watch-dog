import {
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../services/database.service.js";

export type RuleType = InferAttributes<Rule>;
export class Rule extends Model<
  InferAttributes<Rule>,
  InferCreationAttributes<Rule>
> {
  declare blockDelay: number;
  declare createdAt: Date;
  declare fromAddress?: string;
  declare gasLimit?: number;
  declare gasPrice?: number;
  declare id: number;
  declare isActive: boolean;
  declare nonce?: number;
  declare toAddress?: string;
  declare updatedAt: Date;
  declare valueFrom?: number;
  declare valueTo?: number;
}

Rule.init(
  {
    blockDelay: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    fromAddress: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    gasLimit: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
    gasPrice: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    isActive: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
    nonce: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    toAddress: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    valueFrom: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
    valueTo: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
  },
  {
    modelName: "Rule",
    sequelize,
    tableName: "rules",
  },
);
