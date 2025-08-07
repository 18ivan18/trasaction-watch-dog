import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  apis: ["./src/controllers/*.ts"],
  definition: {
    components: {
      parameters: {
        RuleId: {
          description: "Rule ID",
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
        },
        TransactionId: {
          description: "Transaction ID",
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
        },
      },
      schemas: {
        BatchTransactionRequest: {
          properties: {
            transactions: {
              items: {
                properties: {
                  chainId: {
                    description: "Network chain ID",
                    type: "integer",
                  },
                  data: {
                    description: "Transaction data",
                    type: "string",
                  },
                  from: {
                    description: "Sender address",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    type: "string",
                  },
                  gasLimit: {
                    description: "Gas limit",
                    type: "string",
                  },
                  gasPrice: {
                    description: "Gas price",
                    type: "string",
                  },
                  hash: {
                    description: "Transaction hash",
                    pattern: "^0x[a-fA-F0-9]{64}$",
                    type: "string",
                  },
                  nonce: {
                    description: "Transaction nonce",
                    type: "integer",
                  },
                  ruleIds: {
                    description:
                      "Array of rule IDs to associate with this transaction",
                    items: {
                      type: "integer",
                    },
                    type: "array",
                  },
                  to: {
                    description: "Recipient address",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    type: "string",
                  },
                  type: {
                    description: "Transaction type",
                    type: "integer",
                  },
                  value: {
                    description: "Transaction value",
                    type: "string",
                  },
                },
                required: [
                  "hash",
                  "from",
                  "nonce",
                  "gasLimit",
                  "data",
                  "value",
                  "chainId",
                ],
                type: "object",
              },
              type: "array",
            },
          },
          required: ["transactions"],
          type: "object",
        },
        CreateRuleRequest: {
          description: "At least one property must be provided",
          properties: {
            fromAddress: {
              description: "Ethereum address to filter by sender",
              pattern: "^0x[a-fA-F0-9]{40}$",
              type: "string",
            },
            gasLimit: {
              description: "Gas limit to filter by",
              type: "string",
            },
            gasPrice: {
              description: "Gas price to filter by",
              type: "string",
            },
            nonce: {
              description: "Transaction nonce to filter by",
              type: "integer",
            },
            toAddress: {
              description: "Ethereum address to filter by recipient",
              pattern: "^0x[a-fA-F0-9]{40}$",
              type: "string",
            },
            value: {
              description: "Transaction value to filter by",
              type: "string",
            },
          },
          type: "object",
        },
        Error: {
          properties: {
            message: {
              description: "Error message",
              type: "string",
            },
            status: {
              description: "HTTP status code",
              type: "integer",
            },
          },
          type: "object",
        },
        PaginationQuery: {
          properties: {
            limit: {
              default: 10,
              description: "Number of items per page",
              maximum: 100,
              minimum: 1,
              type: "integer",
            },
            page: {
              default: 1,
              description: "Page number for pagination",
              minimum: 1,
              type: "integer",
            },
          },
          type: "object",
        },
        Rule: {
          properties: {
            createdAt: {
              description: "Creation timestamp",
              format: "date-time",
              type: "string",
            },
            fromAddress: {
              description: "Ethereum address to filter by sender",
              pattern: "^0x[a-fA-F0-9]{40}$",
              type: "string",
            },
            gasLimit: {
              description: "Gas limit to filter by",
              type: "string",
            },
            gasPrice: {
              description: "Gas price to filter by",
              type: "string",
            },
            id: {
              description: "Unique identifier for the rule",
              type: "integer",
            },
            nonce: {
              description: "Transaction nonce to filter by",
              type: "integer",
            },
            toAddress: {
              description: "Ethereum address to filter by recipient",
              pattern: "^0x[a-fA-F0-9]{40}$",
              type: "string",
            },
            updatedAt: {
              description: "Last update timestamp",
              format: "date-time",
              type: "string",
            },
            value: {
              description: "Transaction value to filter by",
              type: "string",
            },
          },
          required: ["id"],
          type: "object",
        },
        Transaction: {
          properties: {
            accessList: {
              description: "Access list for EIP-2930 transactions",
              type: "array",
            },
            chainId: {
              description: "Network chain ID",
              type: "integer",
            },
            createdAt: {
              description: "Creation timestamp",
              format: "date-time",
              type: "string",
            },
            data: {
              description: "Transaction data",
              type: "string",
            },
            from: {
              description: "Sender address",
              pattern: "^0x[a-fA-F0-9]{40}$",
              type: "string",
            },
            gasLimit: {
              description: "Gas limit",
              type: "string",
            },
            gasPrice: {
              description: "Gas price",
              type: "string",
            },
            hash: {
              description: "Transaction hash",
              pattern: "^0x[a-fA-F0-9]{64}$",
              type: "string",
            },
            id: {
              description: "Unique identifier for the transaction",
              type: "integer",
            },
            maxFeePerGas: {
              description: "EIP-1559 max fee per gas",
              type: "string",
            },
            maxPriorityFeePerGas: {
              description: "EIP-1559 max priority fee per gas",
              type: "string",
            },
            nonce: {
              description: "Transaction nonce",
              type: "integer",
            },
            r: {
              description: "Signature component r",
              type: "string",
            },
            s: {
              description: "Signature component s",
              type: "string",
            },
            to: {
              description: "Recipient address",
              pattern: "^0x[a-fA-F0-9]{40}$",
              type: "string",
            },
            type: {
              description: "Transaction type",
              type: "integer",
            },
            updatedAt: {
              description: "Last update timestamp",
              format: "date-time",
              type: "string",
            },
            v: {
              description: "Signature component v",
              type: "integer",
            },
            value: {
              description: "Transaction value",
              type: "string",
            },
          },
          required: [
            "id",
            "hash",
            "from",
            "nonce",
            "gasLimit",
            "data",
            "value",
            "chainId",
          ],
          type: "object",
        },
      },
    },
    info: {
      contact: {
        email: "support@example.com",
        name: "API Support",
      },
      description:
        "A Node.js/Express API for managing transaction rules and blockchain transactions with a many-to-many relationship.",
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
      title: "Transaction Rules API",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    servers: [
      {
        description: "Development server",
        url: "http://localhost:3000",
      },
    ],
    tags: [
      {
        description: "Rule management endpoints",
        name: "Rules",
      },
      {
        description: "Transaction management endpoints",
        name: "Transactions",
      },
    ],
  },
};

export const specs = swaggerJsdoc(options);
