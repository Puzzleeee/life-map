module.exports = function (crud) {

  let module = {};

  module.execute = async function (id, name, email, password) {
    let values = {
      id: {
        value: id
      },
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