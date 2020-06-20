module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    const conditions = {
      id: {
        value: id
      },
    };
    
    return crud.delete('diary_entries', conditions)
      .then((result) => {
        console.log("diary entry created successfully");
        return result;
      }).catch((err) => {
        console.log(err);
        throw err;
      });

  }

  return module;
}