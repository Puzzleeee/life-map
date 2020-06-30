module.exports = function (crud) {

  let module = {};

  module.execute = async function (recipient) {
    const where = {
      recipient: {
        value: recipient
      },
    }

    const columns = [
      '`follow_requests`.`id`',
      '`follow_requests`.`sender`',
      '`follow_requests`.`recipient`',
      '`follow_requests`.`date_time`',
      '`registered_users`.`email`',
      '`registered_users`.`name`'
    ];
    
    const order = {
      date_time: {
        descending: true
      }
    };

    return crud.read_join(
      ['follow_requests', 'registered_users'],
      columns,
      where,
      join = [['sender', 'id']],
      where_no = 0,
      order
    );
  }

  return module;

}

