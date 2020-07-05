module.exports = function (crud) {

  let module = {};

  module.execute = async function (user_id, bio, profile_pic) {
    const values = {
      user_id: {
        value: user_id
      },
      bio: {
        value: bio
      },
      profile_pic: {
        value: profile_pic
      }
    }
    return crud.create('profile', values);
  }

  return module;

}