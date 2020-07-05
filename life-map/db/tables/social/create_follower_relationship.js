module.exports = function (crud) {

  let module = {};

  module.execute = async function (followee, follower) {
    const values = {
      followee: {
        value: followee
      },
      follower: {
        value: follower
      }
    }
    return crud.create('followers', values)
  }

  return module;

}