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

#### GET /rules/cache/stats

Get cache statistics (number of keys, key names).

#### POST /rules/cache/clear

Clear all cached data.

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

Insert multiple transactions at once using optimized bulk operations.

**Features:**

- Uses Sequelize's `bulkCreate` for efficient batch insertion
- Creates pivot table entries in bulk for rule associations
- Wrapped in a database transaction for data consistency
- If any transaction fails, the entire batch is rolled back

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
      "value": "500000000000000000",
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
3. Set up Redis (required for caching):

   ```bash
   # Install Redis (macOS)
   brew install redis

   # Start Redis
   brew services start redis

   # Or run Redis manually
   redis-server
   ```

4. Configure environment variables:

   ```bash
   # Create .env file
   touch .env

   # Add the following environment variables:
   REDIS_URL=redis://localhost:6379
   INFURA_PROJECT_ID=your_infura_project_id_here
   MONITOR_ENABLED=false
   API_BASE_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Ethereum Transaction Monitor

The application includes a real-time Ethereum transaction monitor that:

- Listens to new blocks on the Ethereum mainnet
- Batches transactions into groups of 200
- Spawns worker processes to process each batch
- Matches transactions against configured rules
- Automatically inserts matching transactions with their rule associations

### Monitor Features

- **Real-time Block Monitoring**: Uses Infura to listen for new Ethereum blocks
- **Batch Processing**: Groups transactions into batches of 200 for efficient processing
- **Worker Processes**: Each batch is processed in a separate child process
- **Rule Matching**: Automatically matches transactions against all configured rules
- **Batch Insertion**: Efficiently inserts matching transactions with their rule associations

### Running the Monitor

#### Option 1: Run monitor with API server

```bash
# Start both API server and monitor
npm run monitor:dev
```

#### Option 2: Run monitor separately

```bash
# Start API server
npm run dev

# In another terminal, start monitor
npm run monitor
```

### Monitor Configuration

Set the following environment variables:

- `INFURA_PROJECT_ID`: Your Infura project ID (required)
- `MONITOR_ENABLED`: Set to "true" to enable monitor with API server
- `API_BASE_URL`: Base URL for the API (default: http://localhost:3000)

### Monitor Process Flow

1. **Block Detection**: Monitor listens for new Ethereum blocks
2. **Transaction Extraction**: Extracts all transactions from each block
3. **Batching**: Groups transactions into batches of 200
4. **Worker Spawning**: Spawns a child process for each batch
5. **Rule Fetching**: Worker fetches all rules from the API
6. **Rule Matching**: Worker matches each transaction against all rules
7. **Batch Insertion**: Worker inserts matching transactions with rule associations

### Worker Process

Each worker process:

1. Receives transaction data via stdin
2. Fetches all rules from the API using axios
3. Matches each transaction against all rules
4. Batch inserts matching transactions with their rule associations
5. Reports results and exits

### Performance Considerations

- **Batch Size**: Configurable batch size (default: 200 transactions)
- **Parallel Processing**: Each batch runs in a separate process
- **Error Handling**: Graceful error handling and logging
- **Resource Management**: Automatic cleanup of worker processes

## Docker Setup

The application includes Docker Compose configuration for MySQL and Redis services.

### Prerequisites

- Docker and Docker Compose installed on your system

### Environment Configuration

Create a `.env` file in the root directory with the following configuration:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=test_db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Starting Services

```bash
# Start MySQL and Redis services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using NPM Scripts

The project includes convenient npm scripts for Docker management:

```bash
# Setup environment file
npm run setup:env

# Start Docker services
npm run docker:up

# Stop Docker services
npm run docker:down

# View Docker logs
npm run docker:logs

# Restart Docker services
npm run docker:restart

# Test Docker setup
npm run test:docker
```

### Database

The application uses MySQL as the database. The database will be created automatically when you first run the application with the Docker services running.

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

## Caching

The API includes Redis-based caching for improved performance:

### Cache Features

- **Automatic Caching**: GET requests for rules are automatically cached
- **Cache Invalidation**: Cache is automatically invalidated when rules are created, updated, or deleted
- **TTL Support**: Cached data expires after 5 minutes by default
- **Pattern-based Invalidation**: Cache invalidation uses pattern matching to clear related cache entries

### Cache Configuration

- **Redis URL**: Configure via `REDIS_URL` environment variable (default: `redis://localhost:6379`)
- **Cache TTL**: 5 minutes for rule data
- **Cache Keys**:
  - `rules:all` - All rules cache
  - `rules:id:*` - Individual rule cache (future implementation)

### Cache Behavior

- **GET /rules/all**: Returns cached data if available, otherwise fetches from database and caches
- **POST/PUT/DELETE /rules**: Automatically invalidates all rule-related cache entries
- **Graceful Degradation**: If Redis is unavailable, the API continues to work without caching
- **Connection Monitoring**: Automatic detection of Redis connection status
- **Error Handling**: Cache failures are logged but don't affect API functionality

## Testing

Use the provided `requests.http` file to test all endpoints with example data.
