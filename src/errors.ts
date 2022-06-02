export interface DynamoDBError extends Error {
  name: DynamoDBException | string;
}

export enum DynamoDBException {
  /**
   * **Message:** *Access denied.*
   *
   * The client did not correctly sign the request. If you are using an AWS SDK, requests are signed for you automatically; otherwise, go to the Signature Version 4 Signing Process in the AWS General Reference.
   *
   * **OK to retry?** No
   */
  AccessDeniedException = 'AccessDeniedException',

  /**
   * **Message:** *The conditional request failed.*
   *
   * You specified a condition that evaluated to false. For example, you might have tried to perform a conditional update on an item, but the actual value of the attribute did not match the expected value in the condition.
   *
   * **OK to retry?** No
   */
  ConditionalCheckFailedException = 'ConditionalCheckFailedException',

  /**
   * **Message:** *The request signature does not conform to AWS standards.*
   *
   * The request signature did not include all of the required components. If you are using an AWS SDK, requests are signed for you automatically; otherwise, go to the [Signature Version 4 Signing Process](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) in the AWS General Reference.
   *
   * **OK to retry?** No
   */
  IncompleteSignatureException = 'IncompleteSignatureException',

  /**
   * **Message:** *Collection size exceeded.*
   *
   * For a table with a local secondary index, a group of items with the same partition key value has exceeded the maximum size limit of 10 GB. For more information on item collections, see [Item Collections in Local Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html#LSI.ItemCollections).
   *
   * **OK to retry?** Yes
   */
  ItemCollectionSizeLimitExceededException = 'ItemCollectionSizeLimitExceededException',

  /**
   * **Message:** *Too many operations for a given subscriber.*
   *
   * There are too many concurrent control plane operations. The cumulative number of tables and indexes in the `CREATING`, `DELETING`, or `UPDATING` state cannot exceed 500.
   *
   * **OK to retry?** Yes
   */
  LimitExceededException = 'LimitExceededException',

  /**
   * **Message:** *Request must contain a valid (registered) AWS Access Key ID.*
   *
   * The request did not include the required authorization header, or it was malformed. See [DynamoDB Low-Level API](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html).
   *
   * **OK to retry?** No
   */
  MissingAuthenticationTokenException = 'MissingAuthenticationTokenException',

  /**
   * **Message:** *You exceeded your maximum allowed provisioned throughput for a table or for one or more global secondary indexes. To view performance metrics for provisioned throughput vs. consumed throughput, open the [Amazon CloudWatch console](https://console.aws.amazon.com/cloudwatch/home).*
   *
   * Example: Your request rate is too high. The AWS SDKs for DynamoDB automatically retry requests that receive this exception. Your request is eventually successful, unless your retry queue is too large to finish. Reduce the frequency of requests using [Error Retries and Exponential Backoff](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.Errors.html#Programming.Errors.RetryAndBackoff).
   *
   * **OK to retry?** Yes
   */
  ProvisionedThroughputExceededException = 'ProvisionedThroughputExceededException',

  /**
   * **Message:** *Throughput exceeds the current throughput limit for your account. To request a limit increase, contact AWS Support at https://aws.amazon.com/support.*
   *
   * Example: Rate of on-demand requests exceeds the allowed account throughput.
   *
   * **OK to retry?** Yes
   */
  RequestLimitExceeded = 'RequestLimitExceeded',

  /**
   * **Message:** *The resource which you are attempting to change is in use.*
   *
   * You tried to re-create an existing table, or delete a table currently in the `CREATING` state.
   *
   * **OK to retry?** No
   */
  ResourceInUseException = 'ResourceInUseException',

  /**
   * **Message:** *Requested resource not found.*
   *
   * Example: The table that is being requested does not exist, or is too early in the `CREATING` state.
   *
   * **OK to retry?** No
   */
  ResourceNotFoundException = 'ResourceNotFoundException',

  /**
   * **Message:** *Rate of requests exceeds the allowed throughput.*
   *
   * This exception is returned as an AmazonServiceException response with a THROTTLING_EXCEPTION status code. This exception might be returned if you perform [control plane](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.API.html#HowItWorks.API.ControlPlane) API operations too rapidly.
   *
   * For tables using on-demand mode, this exception might be returned for any (data plane)[https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.API.html#HowItWorks.API.DataPlane] API operation if your request rate is too high. To learn more about on-demand scaling, see [Peak Traffic and Scaling Properties](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.PeakTraffic)
   *
   * **OK to retry?** Yes
   */
  ThrottlingException = 'ThrottlingException',

  /**
   * **Message:** *The Access Key ID or security token is invalid.*
   *
   * The request signature is incorrect. The most likely cause is an invalid AWS access key ID or secret key.
   *
   * **OK to retry?** Yes
   */
  UnrecognizedClientException = 'UnrecognizedClientException',

  /**
   * **Message:** *Varies, depending upon the specific error(s) encountered*
   *
   * This error can occur for several reasons, such as a required parameter that is missing, a value that is out of range, or mismatched data types. The error message contains details about the specific part of the request that caused the error.
   *
   * **OK to retry?** No
   */
  ValidationException = 'ValidationException',
}
