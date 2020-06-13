module.exports = function (crud) {

  let module = {};

  module.execute = async function (id, fileName) {
    const values = {
      entry_id: {
        value: id
      },
      file_name: {
        value: fileName
      }
    }
    return crud.create('photos', values)
  }

  return module;

}