import {
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../services/database.service.js";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare createdAt: Date;
  declare from?: string;
  declare gasLimit: string;
  declare gasPrice?: string;
  declare hash?: string;
  declare id: number;
  declare nonce: number;
  declare to?: string;
  declare type?: number;
  declare updatedAt: Date;
  declare value: string;
}

Transaction.init(
  {
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    from: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    gasLimit: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    gasPrice: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    hash: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: /^0x[a-fA-F0-9]{64}$/,
      },
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nonce: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    to: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    type: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    value: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "Transaction",
    sequelize,
    tableName: "transactions",
  },
);

export type TransactionType = InferAttributes<Transaction>;
