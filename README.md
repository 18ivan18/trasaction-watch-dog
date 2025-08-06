# Transaction Rules API

A Node.js/Express API for managing transaction rules and blockchain transactions with a many-to-many relationship.

## Features

- **Rule Management**: Create, read, update, and delete transaction filtering rules
- **Transaction Management**: Store and manage blockchain transactions
- **Batch Operations**: Insert multiple transactions at once
- **Rule-Transaction Associations**: Link transactions to multiple rules
- **Validation**: Comprehensive input validation using Zod schemas
- **TypeScript**: Full type safety throughout the application

## Data Models

### Rule

A rule object with at least one optional property for filtering transactions:

- `fromAddress` (optional): Ethereum address to filter by sender
- `toAddress` (optional): Ethereum address to filter by recipient
- `value` (optional): Transaction value to filter by
- `nonce` (optional): Transaction nonce to filter by
- `gasPrice` (optional): Gas price to filter by
- `gasLimit` (optional): Gas limit to filter by

### Transaction

Based on the ethers.js TransactionResponse type with all standard fields:

- `hash`: Transaction hash (required, unique)
- `to`: Recipient address (optional)
- `from`: Sender address (required)
- `nonce`: Transaction nonce (required)
- `gasLimit`: Gas limit (required)
- `gasPrice`: Gas price (optional)
- `data`: Transaction data (required)
- `value`: Transaction value (required)
- `chainId`: Network chain ID (required)
- `r`, `s`, `v`: Signature components (optional)
- `type`: Transaction type (optional)
- `maxFeePerGas`, `maxPriorityFeePerGas`: EIP-1559 fields (optional)
- `accessList`: Access list (optional)

### TransactionRule (Pivot Table)

Manages the many-to-many relationship between transactions and rules.

## API Endpoints

### Rules

#### GET /rules/all

Get all rules with their associated transactions.

#### GET /rules/:id

Get a specific rule by ID with its associated transactions.

#### POST /rules

Create a new rule. At least one property must be provided.

**Request Body:**

```json
{
  "fromAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "toAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7",
  "value": "1000000000000000000",
  "gasPrice": "20000000000"
}
```

#### PUT /rules/:id

Update an existing rule.

#### DELETE /rules/:id

Delete a rule.

#### GET /rules/:id/transactions

Get all transactions associated with a specific rule.

### Transactions

#### GET /transactions/all

Get all transactions with their associated rules.

#### GET /transactions/:id

Get a specific transaction by ID with its associated rules.

#### GET /transactions/hash/:hash

Get a transaction by its hash with associated rules.

#### POST /transactions

Create a single transaction with optional rule associations.

**Request Body:**

```json
{
  "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "to": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "from": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7",
  "nonce": 1,
  "gasLimit": "21000",
  "gasPrice": "20000000000",
  "data": "0x",
  "value": "1000000000000000000",
  "chainId": 1,
  "type": 0,
  "ruleIds": [1, 2]
}
```

#### POST /transactions/batch

Insert multiple transactions at once.

**Request Body:**

```json
{
  "transactions": [
    {
      "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "to": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8",
      "from": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9",
      "nonce": 2,
      "gasLimit": "21000",
      "gasPrice": "20000000000",
      "data": "0x",
      "value": "500000000000000000",
      "chainId": 1,
      "type": 0,
      "ruleIds": [1]
    }
  ]
}
```

#### PUT /transactions/:id

Update a transaction and its rule associations.

#### DELETE /transactions/:id

Delete a transaction.

#### GET /transactions/rule/:ruleId

Get all transactions associated with a specific rule.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Database

The application uses SQLite as the database. The database file (`database.sqlite`) will be created automatically when you first run the application.

## Validation

All endpoints include comprehensive validation:

- Ethereum addresses must be valid 0x-prefixed hex strings
- Transaction hashes must be valid 64-character hex strings
- Rule creation requires at least one property to be provided
- All numeric fields are validated for appropriate ranges
- Required fields are enforced

## Error Handling

The API includes comprehensive error handling:

- Validation errors return 400 status with detailed messages
- Not found errors return 404 status
- Database errors are properly handled and logged
- Batch operations return detailed success/failure information

## Testing

Use the provided `requests.http` file to test all endpoints with example data.
