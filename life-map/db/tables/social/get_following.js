module.exports = function (crud) {

  let module = {};

  module.execute = async function (follower) {
    const where = {
      follower: {
        value: follower
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
      join = [['followee', 'id']],
      where_no = 0,
    );
  }

  return module;

}