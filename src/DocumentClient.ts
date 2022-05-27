// import { AWSError as AWSLocalError, Request, DynamoDB } from 'aws-sdk';
import {
  UpdateCommandInput,
  UpdateCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
  QueryCommandInput,
  QueryCommandOutput,
  PutCommandInput,
  PutCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  DeleteCommandInput,
  DeleteCommandOutput,
  DynamoDBDocument,
} from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';

export type Item = {
  [key: string]: NativeAttributeValue;
};

export type Key = { [key: string]: string | number | Buffer };

export type {
  ScanCommandInput,
  ScanCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  QueryCommandInput,
  QueryCommandOutput,
  PutCommandInput,
  PutCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
  DeleteCommandInput,
  DeleteCommandOutput,
};

export type UpdateExpression = NonNullable<
  UpdateCommandInput['UpdateExpression']
>;

export default DynamoDBDocument;
