import 'mocha';
import { assert } from 'chai';
import DDBTable from './DDBTable';

interface DemoItem {
  Id: string;
  Ver: number;
  foo: number;
  maybe?: boolean;
}

describe('DDBTable', () => {
  it('Basic Usage', () => {
    const table = new DDBTable<DemoItem, 'Id', 'Ver'>({
      tableName: 'MyTable',
      primaryKey: 'Id',
      sortKey: 'Ver',
    });

    // table.get('ss', 1).project({ foo: false as boolean, Id: 1, maybe: 1 });
    // .exec()
    // .then((res) => {
    //   if (!res.Item) return;
    //
    //   // console.log(res.Item.Id);
    //   // console.log(res.Item.foo);
    //   // console.log(res.Item.Ver);
    //   // console.log(res.Item.maybe);
    // });

    assert.deepEqual(
      table
        .get('ss', 1)
        .project({ foo: false as boolean, Id: 1, maybe: 1 })
        .serialize(),
      {
        TableName: 'MyTable',
        Key: {
          Id: 'ss',
          Ver: 1,
        },
        ProjectionExpression: '#Id, #maybe',
        ExpressionAttributeNames: {
          '#Id': 'Id',
          '#maybe': 'maybe',
        },
      },
    );
  });
});
