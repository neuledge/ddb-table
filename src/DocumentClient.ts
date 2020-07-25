import { AWSError as AWSLocalError, Request, DynamoDB } from 'aws-sdk';
import { DocumentClient as Namespace } from 'aws-sdk/lib/dynamodb/document_client';

export type Item = Namespace.PutItemInputAttributeMap;
export type Key = Namespace.Key;

export type StringSet = Namespace.StringSet;
export type NumberSet = Namespace.NumberSet;
export type BinarySet = Namespace.BinarySet;
export type BinaryType = Namespace.binaryType;

export type AttributeName = Namespace.AttributeName;
export type ExpressionAttributeNameMap = Namespace.ExpressionAttributeNameMap;
export type ExpressionAttributeValueMap = Namespace.ExpressionAttributeValueMap;

export type PutItemInput = Namespace.PutItemInput;
export type PutItemOutput = Namespace.PutItemOutput;

export type GetItemInput = Namespace.GetItemInput;
export type GetItemOutput = Namespace.GetItemOutput;

export type ScanInput = Namespace.ScanInput;
export type ScanOutput = Namespace.ScanOutput;

export type QueryInput = Namespace.QueryInput;
export type QueryOutput = Namespace.QueryOutput;

export type UpdateItemInput = Namespace.UpdateItemInput;
export type UpdateItemOutput = Namespace.UpdateItemOutput;
export type UpdateExpression = Namespace.UpdateExpression;

export type DeleteItemInput = Namespace.DeleteItemInput;
export type DeleteItemOutput = Namespace.DeleteItemOutput;

export type AWSError = AWSLocalError;
export type AWSRequest<D, E = AWSError> = Request<D, E>;

export default DynamoDB.DocumentClient;
