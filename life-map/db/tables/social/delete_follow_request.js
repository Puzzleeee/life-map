module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    const values = {
      id: {
        value: id
      },
    }
    return crud.delete('follow_requests', values)
  }

  return module;

}