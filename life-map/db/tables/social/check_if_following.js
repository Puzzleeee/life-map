module.exports = function (crud) {

  let module = {};

  module.execute = async function (requester, toView) {
    const where = {
      follower: {
        value: requester,
        next: 'AND'
      },
      followee: {
        value: toView
      }
    }
    return crud.read('followers', [], where)
      .then((result) => result.length !== 0)
  }

  return module;

}