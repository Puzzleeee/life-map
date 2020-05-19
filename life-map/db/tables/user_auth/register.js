module.exports = function (crud) {

  let module = {};

  module.execute = async function (name, email, password) {
    let values = {
      name: {
        value: name
      },
      email: {
        value: email
      },
      password: {
        value: password
      }
    }
    return crud.create('registered_users', values)
  }

  return module;

}