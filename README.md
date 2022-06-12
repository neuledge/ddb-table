<h1 align="center" style="text-align:center">🔒 DDB-Table</h1>

<h4 align="center">Strongly typed library for querying and modeling DynamoDB documents in TypeScript.</h4>

<p align="center">
  <a href="https://www.npmjs.org/package/ddb-table">
    <img src="http://img.shields.io/npm/v/ddb-table.svg" alt="View On NPM">
  </a>
  <a href="https://github.com/neuledge/ddb-table/actions/workflows/build.yml">
    <img src="https://github.com/neuledge/ddb-table/actions/workflows/build.yml/badge.svg"
      alt="Build Status">
  </a>
  <a href="https://depfu.com/github/neuledge/ddb-table?project_id=13055">
    <img src="https://badges.depfu.com/badges/c06bc1e007e8b7f804d8563a56bb2ced/overview.svg"
      alt="Dependency Status">
  </a>
  <a href="https://codecov.io/gh/neuledge/ddb-table">
    <img src="https://codecov.io/gh/neuledge/ddb-table/branch/master/graph/badge.svg?token=JQG7E9QJ3B"
      alt="Coverage Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/ddb-table.svg" alt="License">
  </a>
</p>
<br>

**DDB-Table** was built to provide strongly-typed data structures over DynamoDB tables. Using **AWS
DocumentClient** & **TypeScript** you can easily fetch and store any JSON document and validate it’s
structure statically. Query secondary indexes and run complicated update expressions without any
error on runtime.

```ts
await table
  .update('demo@example.com')
  .set('FullName', 'John Doe')
  // 🚨 TypeScript Error: 'fullName' is not assignable to 'Email' | 'FullName'
  .condition((cond) => cond.eq('fullName', 'Johnny Doe'))
  .exec();
```

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
import Table, { Set, setOf } from 'ddb-table';

interface MessageSchema {
  threadId: string;
  timestamp: number;
  senderId: string;
  message: string;
  status: 'sent' | 'received';
  tags?: Set<string>;
  attachments: {
    name: string;
    URL: string;
  }[];
}

// create the basic table definition
const messages = new Table<MessageSchema, 'threadId', 'timestamp'>({
  tableName: 'Messages',
  primaryKey: 'threadId',
  sortKey: 'timestamp',
});

const updateRes = await messages
  .update('john@gmail.com', 1588191225322)
  .set('message', 'Hello World!')
  .add('tags', setOf('unread', 'important'))
  .set('attachments', (exp) =>
    exp.listAppend([{ name: 'Test', URL: 'demo.com' }]),
  )
  .return('ALL_NEW')
  .exec();

console.log(updateRes.Attributes);
```

#### Working with indexes as well:

```ts
// create a secondary index definition
type SenderTimestampIndex = Pick<
  MessageSchema,
  'threadId' | 'timestamp' | 'senderId'
>;

const outboxIndex = messages.index<
  SenderTimestampIndex,
  'senderId',
  'timestamp'
>('senderId-timestamp-index', 'senderId', 'timestamp');

const it = outboxIndex
  .query()
  .keyCondition((cond) => cond.eq('senderId', 'john@gmail.com'))
  .keyCondition((cond) =>
    cond.between('timestamp', Date.now() - 3600e3, Date.now()),
  )
  .project({ threadId: 1, message: 1 })
  .reverseIndex()
  .entries();

for await (const item of it) {
  console.log(item);
}
```

<br>

## License

[MIT](LICENSE) license &copy; 2020 [Neuledge](https://neuledge.com)
