<h1 align="center" style="text-align:center">🔒 DDB-Table</h1>

<h4 align="center">Strongly typed library for querying and modeling DynamoDB documents in Node.js.</h4>

<p align="center">
  <a href="https://www.npmjs.org/package/ddb-table">
    <img src="http://img.shields.io/npm/v/ddb-table.svg" alt="View On NPM">
  </a>
  <a href="https://travis-ci.org/neuledge/ddb-table">
    <img src="https://travis-ci.org/neuledge/ddb-table.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://libraries.io/npm/ddb-table/">
    <img src="https://img.shields.io/librariesio/release/npm/ddb-table" alt="Dependency Status">
  </a>
  <a href="https://coveralls.io/github/neuledge/ddb-table?branch=master">
    <img src="https://coveralls.io/repos/github/neuledge/ddb-table/badge.svg?branch=master"
      alt="Coverage Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/ddb-table.svg" alt="License">
  </a>
</p>
<br>

**DDB-Table** was built to provide strongly-typed data structures over DynamoDB tables. Using AWS
DocumentClient & TypeScript you can easily fetch and store any JSON document and validate it’s
structure statically. Query secondary indexes or run complicated update expressions without a single
error on runtime.

### Main Features

- **Strongly Typed** - End-to-end TypeScript validation for your data.
- **Easy Query Expressions** - Automatically escape name attributes and values.
- **Smart Projections** - Make sure you only access the fields you project.
- **Query & Scan Indexes** - Complete support for global or local indexes.
- **Pure JavaScript** - Also works without TypeScript.

<br>

## Install

```bash
npm i ddb-table
```

<br>

## Usage

```ts
import Table from 'ddb-table';

interface MessageSchema {
  threadId: string;
  timestamp: number;
  senderId: string;
  message: string;
  status: 'sent' | 'received';
  attachments?: {
    name: string;
    URL: string;
  }[];
}

// define the basic table definition
const messages = new Table<MessageSchema, 'threadId', 'timestamp'>({
  tableName: 'Messages',
  primaryKey: 'threadId',
  sortKey: 'timestamp',
});

// use the outbox secondary index
const outboxIndex = messages.index('senderId-timestamp-index', 'senderId', 'timestamp');

const res = await outboxIndex
  .query()
  .keyCondition((names, values) => `${names.add('senderId')} = ${values.add('john@gmail.com')}`)
  .keyCondition((names, values) => `${names.add('timestamp')} > ${values.add(Date.now() - 3600e3)}`)
  .project({ threadId: 1, message: 1 })
  .reverseIndex()
  .exec();

console.log(res.Items);
```

<br>

## License

[MIT](LICENSE) license &copy; 2020 [Neuledge](https://neuledge.com)