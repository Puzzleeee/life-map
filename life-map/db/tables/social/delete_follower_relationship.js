module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    const values = {
      id: {
        value: id
      },
    }
    return crud.delete('followers', values)
  }

  return module;
}