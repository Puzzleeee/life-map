module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    let where = {
      id: {
        value: id
      },
    }
    return crud.read('registered_users', [], where)
  }

  return module;

}