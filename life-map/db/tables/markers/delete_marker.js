module.exports = function (crud) {

  let module = {};

  module.execute = async function (id) {
    const conditions = {
      id: {
        value: id
      },
    };
    
    return crud.delete('markers', conditions)
      .then((result) => {
        console.log("marker deleted successfully");
        return result;
      }).catch((err) => {
        console.log(err);
        throw err;
      });

  }

  return module;
}