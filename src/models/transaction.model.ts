import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../services/database.service.js";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: number;
  declare hash?: string;
  declare to?: string;
  declare from?: string;
  declare nonce: number;
  declare gasLimit: string;
  declare gasPrice?: string;
  declare value: string;
  declare type?: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        is: /^0x[a-fA-F0-9]{64}$/,
      },
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    from: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    nonce: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gasLimit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gasPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    modelName: "Transaction",
    tableName: "transactions",
  },
);

export type TransactionType = InferAttributes<Transaction>;
