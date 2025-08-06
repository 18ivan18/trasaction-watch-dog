import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../services/database.service.js";
import { Transaction } from "./transaction.model.js";
import { Rule } from "./rule.model.js";

export class TransactionRule extends Model<
  InferAttributes<TransactionRule>,
  InferCreationAttributes<TransactionRule>
> {
  declare id: number;
  declare transactionId: number;
  declare ruleId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

TransactionRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "transactions",
        key: "id",
      },
    },
    ruleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rules",
        key: "id",
      },
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
    modelName: "TransactionRule",
    tableName: "transaction_rules",
    indexes: [
      {
        unique: true,
        fields: ["transactionId", "ruleId"],
      },
    ],
  },
);

Transaction.belongsToMany(Rule, {
  through: TransactionRule,
  foreignKey: "transactionId",
  otherKey: "ruleId",
  as: "rules",
});

Rule.belongsToMany(Transaction, {
  through: TransactionRule,
  foreignKey: "ruleId",
  otherKey: "transactionId",
  as: "transactions",
});
