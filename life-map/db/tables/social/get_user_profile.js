module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    const where = {
      id: {
        value: id
      },
    }

    const columns = [
      '`registered_users`.`id`',
      '`registered_users`.`email`',
      '`registered_users`.`name`',
      {original: "`profile`.`id`", alias: `profile_id`},
      '`profile`.`bio`',
      '`profile`.`profile_pic`'
    ];
    
    return crud.read_join(
      ['registered_users', 'profile'],
      columns,
      where,
      join = [['id', 'user_id']],
      where_no = 0,
    );
  }

  return module;

}