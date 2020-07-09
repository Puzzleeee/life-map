module.exports = function (crud) {
  let modules = {};

  modules.execute = async function (id) {
    const where = {
      user_id: {
        value: id
      }
    }
    return crud.read('profile', ['profile_pic'], where);
  }
  return modules
}