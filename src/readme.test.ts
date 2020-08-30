import 'mocha';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { assert } from 'chai';
import Table, { Set, setOf } from './';

/* eslint-disable @typescript-eslint/no-unused-vars */

describe('README.md', () => {
  before(() => {
    AWSMock.setSDKInstance(AWS);

    AWSMock.mock(
      'DynamoDB.DocumentClient',
      'update',
      (params: unknown, callback: (err: Error | null, item: unknown) => void) =>
        callback(null, params),
    );

    AWSMock.mock(
      'DynamoDB.DocumentClient',
      'query',
      (
        params: Record<string, undefined>,
        callback: (err: Error | null, item: unknown) => void,
      ) =>
        callback(null, {
          Items: [
            { i: 0, ...params },
            { i: 1, ...params },
          ],
          LastEvaluatedKey: params.ExclusiveStartKey ? undefined : { key: 2 },
        }),
    );
  });

  after(() => {
    AWSMock.restore('DynamoDB');
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

    const documentClient = new AWS.DynamoDB.DocumentClient();

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
      .add('tags', setOf('unread', 'important'))
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
        ':tags': documentClient.createSet(['unread', 'important']),
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
      documentClient: new AWS.DynamoDB.DocumentClient(),
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
