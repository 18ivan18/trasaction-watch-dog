import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transaction Rules API",
      version: "1.0.0",
      description: "A Node.js/Express API for managing transaction rules and blockchain transactions with a many-to-many relationship.",
      contact: {
        name: "API Support",
        email: "support@example.com"
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ],
    components: {
      schemas: {
        Rule: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the rule"
            },
            fromAddress: {
              type: "string",
              description: "Ethereum address to filter by sender",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            toAddress: {
              type: "string",
              description: "Ethereum address to filter by recipient",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            value: {
              type: "string",
              description: "Transaction value to filter by"
            },
            nonce: {
              type: "integer",
              description: "Transaction nonce to filter by"
            },
            gasPrice: {
              type: "string",
              description: "Gas price to filter by"
            },
            gasLimit: {
              type: "string",
              description: "Gas limit to filter by"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp"
            }
          },
          required: ["id"]
        },
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the transaction"
            },
            hash: {
              type: "string",
              description: "Transaction hash",
              pattern: "^0x[a-fA-F0-9]{64}$"
            },
            to: {
              type: "string",
              description: "Recipient address",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            from: {
              type: "string",
              description: "Sender address",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            nonce: {
              type: "integer",
              description: "Transaction nonce"
            },
            gasLimit: {
              type: "string",
              description: "Gas limit"
            },
            gasPrice: {
              type: "string",
              description: "Gas price"
            },
            data: {
              type: "string",
              description: "Transaction data"
            },
            value: {
              type: "string",
              description: "Transaction value"
            },
            chainId: {
              type: "integer",
              description: "Network chain ID"
            },
            r: {
              type: "string",
              description: "Signature component r"
            },
            s: {
              type: "string",
              description: "Signature component s"
            },
            v: {
              type: "integer",
              description: "Signature component v"
            },
            type: {
              type: "integer",
              description: "Transaction type"
            },
            maxFeePerGas: {
              type: "string",
              description: "EIP-1559 max fee per gas"
            },
            maxPriorityFeePerGas: {
              type: "string",
              description: "EIP-1559 max priority fee per gas"
            },
            accessList: {
              type: "array",
              description: "Access list for EIP-2930 transactions"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp"
            }
          },
          required: ["id", "hash", "from", "nonce", "gasLimit", "data", "value", "chainId"]
        },
        CreateRuleRequest: {
          type: "object",
          properties: {
            fromAddress: {
              type: "string",
              description: "Ethereum address to filter by sender",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            toAddress: {
              type: "string",
              description: "Ethereum address to filter by recipient",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            value: {
              type: "string",
              description: "Transaction value to filter by"
            },
            nonce: {
              type: "integer",
              description: "Transaction nonce to filter by"
            },
            gasPrice: {
              type: "string",
              description: "Gas price to filter by"
            },
            gasLimit: {
              type: "string",
              description: "Gas limit to filter by"
            }
          },
          description: "At least one property must be provided"
        },
        BatchTransactionRequest: {
          type: "object",
          properties: {
            transactions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hash: {
                    type: "string",
                    description: "Transaction hash",
                    pattern: "^0x[a-fA-F0-9]{64}$"
                  },
                  to: {
                    type: "string",
                    description: "Recipient address",
                    pattern: "^0x[a-fA-F0-9]{40}$"
                  },
                  from: {
                    type: "string",
                    description: "Sender address",
                    pattern: "^0x[a-fA-F0-9]{40}$"
                  },
                  nonce: {
                    type: "integer",
                    description: "Transaction nonce"
                  },
                  gasLimit: {
                    type: "string",
                    description: "Gas limit"
                  },
                  gasPrice: {
                    type: "string",
                    description: "Gas price"
                  },
                  data: {
                    type: "string",
                    description: "Transaction data"
                  },
                  value: {
                    type: "string",
                    description: "Transaction value"
                  },
                  chainId: {
                    type: "integer",
                    description: "Network chain ID"
                  },
                  type: {
                    type: "integer",
                    description: "Transaction type"
                  },
                  ruleIds: {
                    type: "array",
                    items: {
                      type: "integer"
                    },
                    description: "Array of rule IDs to associate with this transaction"
                  }
                },
                required: ["hash", "from", "nonce", "gasLimit", "data", "value", "chainId"]
              }
            }
          },
          required: ["transactions"]
        },
        PaginationQuery: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              minimum: 1,
              default: 1,
              description: "Page number for pagination"
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
              description: "Number of items per page"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message"
            },
            status: {
              type: "integer",
              description: "HTTP status code"
            }
          }
        }
      },
      parameters: {
        RuleId: {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer"
          },
          description: "Rule ID"
        },
        TransactionId: {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer"
          },
          description: "Transaction ID"
        }
      }
    },
    tags: [
      {
        name: "Rules",
        description: "Rule management endpoints"
      },
      {
        name: "Transactions",
        description: "Transaction management endpoints"
      }
    ]
  },
  apis: ["./src/controllers/*.ts"]
};

export const specs = swaggerJsdoc(options); 