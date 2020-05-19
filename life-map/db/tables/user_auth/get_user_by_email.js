module.exports = function (crud) {

  let module = {};

  module.execute = async function (email) {
    let where = {
      email: {
        value: email
      },
    }
    return crud.read('registered_users', [], where)
  }

  return module;

}