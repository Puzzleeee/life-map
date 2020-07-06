module.exports = function (crud) {
  let modules = {};

  modules.execute = async function (profile_id, profile_pic) {
    const values = {
      where: {
        id: {
          value: profile_id
        }
      },
      profile_pic: {
        value: profile_pic
      }
    }

    return crud.update('profile', values);
  }

  return modules;
}