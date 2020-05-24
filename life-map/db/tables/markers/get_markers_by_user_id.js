module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    let where = {
      user_id: {
        value: id
      },
    }
    return crud.read('markers', [], where)
  }

  return module;

}