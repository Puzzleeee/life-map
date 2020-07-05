module.exports = function (crud) {
  let modules = {};

  modules.execute = async function (searchString) {
    const columns = ['id', 'name', 'email'];
    const like = {
      name: {
        value: searchString,
        next: 'OR'
      },
      email: {
        value: searchString,
      }
    }

    return crud.read_like(
      'registered_users',
      columns,
      like,
    );
  }

  return modules;
}