module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    let where = {
      entry_id: {
        value: id
      },
    }
    return crud.delete('photos', where)
        .then(() => {
          console.log(`Photos from entry ${id} deleted successfully`)
        }).catch((err) => {
          console.log(err);
          throw(err);
        })
  }

  return module;

}