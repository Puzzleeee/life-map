module.exports = function (crud) {
  let modules = {};

  modules.execute = async function (user_id, name) {
    const values = {
      where: {
        id: {
          value: user_id
        }
      },
      name: {
        value: name
      }
    }

    return crud.update('profile', values);
  }
  
  return modules;
}