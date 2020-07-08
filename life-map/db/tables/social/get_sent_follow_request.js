module.exports = function (crud) {
  let modules = {};

  modules.execute = async function (id) {
    const where = {
      sender: {
        value: id
      }
    }
    return crud.read('follow_requests', [], where);
  }
}