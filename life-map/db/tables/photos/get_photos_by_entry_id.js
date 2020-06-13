module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    let where = {
      entry_id: {
        value: id
      },
    }
    return crud.read('photos', [], where)
  }

  return module;

}