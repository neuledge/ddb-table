import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

export type Item = DocumentClient.PutItemInputAttributeMap;
export type Key = DocumentClient.Key;

export type StringSet = DocumentClient.StringSet;
export type NumberSet = DocumentClient.NumberSet;
export type BinarySet = DocumentClient.BinarySet;

export type AttributeName = DocumentClient.AttributeName;
export type ExpressionAttributeNameMap = DocumentClient.ExpressionAttributeNameMap;
export type ExpressionAttributeValueMap = DocumentClient.ExpressionAttributeValueMap;

export type PutItemInput = DocumentClient.PutItemInput;
export type PutItemOutput = DocumentClient.PutItemOutput;

export type GetItemInput = DocumentClient.GetItemInput;
export type GetItemOutput = DocumentClient.GetItemOutput;

export type ScanInput = DocumentClient.ScanInput;
export type ScanOutput = DocumentClient.ScanOutput;

export type QueryInput = DocumentClient.QueryInput;
export type QueryOutput = DocumentClient.QueryOutput;

export type UpdateItemInput = DocumentClient.UpdateItemInput;
export type UpdateItemOutput = DocumentClient.UpdateItemOutput;
export type UpdateExpression = DocumentClient.UpdateExpression;

export type DeleteItemInput = DocumentClient.DeleteItemInput;
export type DeleteItemOutput = DocumentClient.DeleteItemOutput;

export type AWSError = AWS.AWSError;
export type AWSRequest<D, E = AWSError> = AWS.Request<D, E>;

export default AWS.DynamoDB.DocumentClient;
