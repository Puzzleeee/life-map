module.exports = function (crud) {

  let module = {};

  module.execute = async function (followee) {
    const where = {
      followee: {
        value: followee
      },
    }

    const columns = [
      '`followers`.`id`',
      '`followers`.`followee`',
      '`followers`.`follower`',
      '`registered_users`.`email`',
      '`registered_users`.`name`'
    ];
    
    return crud.read_join(
      ['followers', 'registered_users'],
      columns,
      where,
      join = [['follower', 'id']],
      where_no = 0,
    );
  }

  return module;

}