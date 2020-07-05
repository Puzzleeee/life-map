module.exports = function (crud) {
  let modules = {};

  modules.execute = async function (profile_id, bio) {
    const values = {
      where: {
        id: {
          value: profile_id
        }
      },
      bio: {
        value: bio
      }
    }

    return crud.update('profile', values);
  }

  return modules;
}