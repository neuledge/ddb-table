import 'mocha';
import sinon from 'sinon';
import { assert } from 'chai';
import Table from './';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

/* eslint-disable @typescript-eslint/no-unused-vars */

describe('README.md', () => {
  let documentClient: DynamoDBDocument;

  before(() => {
    documentClient = sinon.createStubInstance(DynamoDBDocument, {
      update: ((params: unknown) => Promise.resolve(params)) as never,
      query: ((params: Record<string, undefined>) =>
        Promise.resolve({
          Items: [
            { i: 0, ...params },
            { i: 1, ...params },
          ],
          LastEvaluatedKey: params.ExclusiveStartKey ? undefined : { key: 2 },
        })) as never,
    });
  });

  it('Usage 1', async () => {
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
      documentClient,
    });

    const updateRes = await messages
      .update('john@gmail.com', 1588191225322)
      .set('message', 'Hello World!')
      .add('tags', new Set(['unread', 'important']))
      .set('attachments', (exp) =>
        exp.listAppend([{ name: 'Test', URL: 'demo.com' }]),
      )
      .return('ALL_NEW')
      .exec();

    assert.deepEqual(updateRes as never, {
      TableName: 'Messages',
      Key: {
        threadId: 'john@gmail.com',
        timestamp: 1588191225322,
      },
      UpdateExpression:
        'SET #message = :message, #attachments = list_append(#attachments, :attachments) ' +
        'ADD #tags :tags',
      ExpressionAttributeNames: {
        '#attachments': 'attachments',
        '#message': 'message',
        '#tags': 'tags',
      },
      ExpressionAttributeValues: {
        ':attachments': [
          {
            URL: 'demo.com',
            name: 'Test',
          },
        ],
        ':message': 'Hello World!',
        ':tags': new Set(['unread', 'important']),
      },
      ReturnValues: 'ALL_NEW',
    });

    // console.log(updateRes.Attributes);
  });

  it('Usage 2', async () => {
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

    const messages = new Table<MessageSchema, 'threadId', 'timestamp'>({
      tableName: 'Messages',
      primaryKey: 'threadId',
      sortKey: 'timestamp',
      documentClient,
    });

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

    const now = Date.now();
    const hourAgo = now - 3600e3;

    const it = outboxIndex
      .query()
      .keyCondition((cond) => cond.eq('senderId', 'john@gmail.com'))
      .keyCondition((cond) => cond.between('timestamp', hourAgo, now))
      .project({ threadId: 1, message: 1 })
      .reverseIndex()
      .entries();

    let i = 0;
    for await (const item of it) {
      assert.deepEqual(item as never, {
        i: i % 2,
        TableName: 'Messages',
        IndexName: 'senderId-timestamp-index',
        KeyConditionExpression:
          '#senderId = :senderId' +
          ' AND #timestamp BETWEEN :timestamp AND :timestamp2',
        ProjectionExpression: '#threadId, #message',
        ExpressionAttributeNames: {
          '#message': 'message',
          '#senderId': 'senderId',
          '#threadId': 'threadId',
          '#timestamp': 'timestamp',
        },
        ExpressionAttributeValues: {
          ':senderId': 'john@gmail.com',
          ':timestamp': hourAgo,
          ':timestamp2': now,
        },
        ScanIndexForward: false,
        ...(i >= 2 ? { ExclusiveStartKey: { key: 2 } } : null),
      });

      i += 1;
    }
    assert.equal(i, 4);
  });
});
