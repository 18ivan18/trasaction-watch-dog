import {
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../services/database.service.js";
import { Rule } from "./rule.model.js";
import { Transaction } from "./transaction.model.js";

export class TransactionRule extends Model<
  InferAttributes<TransactionRule>,
  InferCreationAttributes<TransactionRule>
> {
  declare createdAt: Date;
  declare id: number;
  declare ruleId: number;
  declare transactionId: number;
  declare updatedAt: Date;
}

TransactionRule.init(
  {
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    ruleId: {
      allowNull: false,
      references: {
        key: "id",
        model: "rules",
      },
      type: DataTypes.INTEGER,
    },
    transactionId: {
      allowNull: false,
      references: {
        key: "id",
        model: "transactions",
      },
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [
      {
        fields: ["transactionId", "ruleId"],
        unique: true,
      },
    ],
    modelName: "TransactionRule",
    sequelize,
    tableName: "transaction_rules",
  },
);

Transaction.belongsToMany(Rule, {
  as: "rules",
  foreignKey: "transactionId",
  otherKey: "ruleId",
  through: TransactionRule,
});

Rule.belongsToMany(Transaction, {
  as: "transactions",
  foreignKey: "ruleId",
  otherKey: "transactionId",
  through: TransactionRule,
});
