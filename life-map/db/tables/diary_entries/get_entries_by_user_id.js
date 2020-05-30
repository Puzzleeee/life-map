module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    let where = {
      user_id: {
        value: id
      },
    };
    
    return crud.read('diary_entries', [], where)
      .then((result) => {
        console.log("Successfully retrieved diary entries");
        return result;
      }).catch((err) => {
        console.log(err);
      })
  }

  return module;

}