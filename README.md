# Transaction Watch Dog

A real-time Ethereum blockchain monitoring system that tracks transactions and applies dynamic rules for filtering and storing relevant transaction data.

## Description

Transaction Watch Dog is a Node.js application that monitors the Ethereum blockchain in real-time using Infura as the provider. It implements a dynamic rule-based system that allows you to configure specific criteria for filtering transactions. When transactions match the defined rules, they are stored in a database with references to the triggering rules.

The system supports:

- **Dynamic Rule Configuration**: Create and manage transaction filtering rules via REST API
- **Real-time Monitoring**: Continuously monitors new Ethereum blocks
- **Delayed Processing**: Support for processing transactions with configurable block delays
- **Rule-based Filtering**: Filter transactions by addresses, value, nonce, gas parameters, and more
- **Hot Reload**: Configuration changes without service restart
- **Comprehensive Logging**: Detailed tracking for monitoring and debugging

## Technologies Used

### Backend

- **Node.js** with TypeScript
- **Express.js**
- **Ethers.js**
- **Sequelize**
- **MySQL**
- **Redis** - Caching layer
- **Axios** - HTTP client for API requests

### Development & Quality

- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Swagger/OpenAPI** - API documentation

### Infrastructure

- **Docker Compose** - Local development environment
- **Infura** - Ethereum node provider
- **Worker Threads** - Parallel transaction processing

## Quick Start

### Prerequisites

- Node.js 22.18.0
- Docker and Docker Compose
- Infura account and project ID

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/18ivan18/trasaction-watch-dog
   cd trasaction-watch-dog
   ```

2. **Create environment file**

   ```bash
   cp .env.sample .env
   ```

3. **Configure environment variables**

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=test_db
   DB_USER=test_user
   DB_PASSWORD=test_password

   # Redis
   REDIS_URL=redis://localhost:6379

   # Ethereum
   INFURA_PROJECT_ID=your_infura_project_id

   # API
   API_BASE_URL=http://localhost:3000
   PORT=3000
   ```

### Running the Application

1. **Start dependencies with Docker**

   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the API server**

   ```bash
   npm run dev
   ```

4. **Start the monitoring service** (in a separate terminal)
   ```bash
   npm run monitor
   ```

## Workflow

The main units are rules and transactions. Each rule consists of several fields of interest like address from, address to, value (from/to range) and so on. Rules can be creates through the REST api. Once a rule is created its automatically used. The monitor script does not need to be reloaded because it fetches all the rules at each block processing so the most recent configuration is always fetched. Rules are not deleted, but rather marked as inactive so the links between transaction and link are still saved in the database. The blocks are placed in a queue and only processed after X block delay where X is the maximum block delay from any rule in the given configuration.

## API Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## Data Models

### Transaction Model

Stores Ethereum transaction data that matches configured rules.

**Fields:**

- `id` - Primary key
- `hash` - Transaction hash (unique)
- `from` - Sender address
- `to` - Recipient address
- `nonce` - Transaction nonce
- `gasLimit` - Gas limit
- `gasPrice` - Gas price
- `value` - Transaction value in Wei
- `type` - Transaction type
- `createdAt/updatedAt` - Timestamps

### Rule Model

Defines filtering criteria for transactions.

**Fields:**

- `id` - Primary key
- `fromAddress` - Filter by sender address
- `toAddress` - Filter by recipient address
- `valueFrom/valueTo` - Value range filter
- `nonce` - Specific nonce filter
- `gasPrice` - Gas price filter
- `gasLimit` - Gas limit filter
- `blockDelay` - Number of blocks to wait before processing
- `isActive` - Whether rule is active
- `createdAt/updatedAt` - Timestamps

### TransactionRule Model

Junction table linking transactions to their matching rules.

**Fields:**

- `id` - Primary key
- `transactionId` - Reference to transaction
- `ruleId` - Reference to rule
- `createdAt/updatedAt` - Timestamps

## Monitoring System

The monitoring system consists of two main components:

### 1. Block Monitor (`src/monitoring/monitor.ts`)

- Listens to new Ethereum blocks via Infura WebSocket
- Maintains a queue of blocks to process
- Spawns worker threads for parallel processing
- Handles block queue management and worker coordination

### 2. Transaction Worker (`src/monitoring/worker.ts`)

- Processes individual blocks in parallel
- Fetches all active rules from the API
- Filters rules based on block delay requirements
- Retrieves block transactions from Ethereum
- Matches transactions against applicable rules
- Batches and stores matching transactions via API

### How It Works

1. **Block Detection**: The monitor listens for new blocks on the Ethereum mainnet
2. **Rule Filtering**: For each block, the system determines which rules should be applied based on their `blockDelay` setting
3. **Transaction Processing**: All transactions in the block are evaluated against the applicable rules
4. **Matching Logic**: Transactions are matched using criteria like:
   - Address matching (from/to)
   - Value range checking
   - Gas parameter validation
   - Nonce verification
5. **Storage**: Matching transactions are stored with references to their triggering rules
6. **Queue Management**: Blocks are removed from the queue once processing is complete

### Rule Matching Criteria

- **Address Matching**: Exact match for `fromAddress` and `toAddress` fields
- **Value Range**: Transaction value must be within `valueFrom` and `valueTo` range
- **Gas Parameters**: Exact match for `gasPrice` and `gasLimit`
- **Nonce**: Exact match for transaction nonce
- **Block Delay**: Rules are only applied after the specified number of blocks have passed

### Performance Features

- **Parallel Processing**: Multiple blocks processed simultaneously using worker threads
- **Batch Operations**: Transactions are inserted in batches of 100 for efficiency
- **Caching**: Redis is used for caching frequently accessed data
- **Connection Pooling**: Database connections are managed efficiently

## Architecture

The application follows a clean architecture pattern with:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and external integrations
- **Models**: Database entities and relationships
- **Middleware**: Request processing and error handling
- **Monitoring**: Separate process for blockchain monitoring
- **Dependency Injection**: Using Awilix for service management

## Development

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

### API Design

- RESTful endpoints
- OpenAPI/Swagger documentation
- Request validation using Zod
- Comprehensive error handling

### Known Issues

- [x] Rules are not correctly evaluated when there are many rules with different blockDelay, e.g. there's a rule with `blockDelay: 1` and rule with `blockDelay: 2`, the first will only run in the beginning. FIXED

### Planned improvements

- type can be changed to human readable enum of values `ETH_TRANSFER, CONTRACT_INTERACTION`
- even more logging
- actual tests
- env variables validation
