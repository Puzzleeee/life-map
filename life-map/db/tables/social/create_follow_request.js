module.exports = function (crud) {

  let module = {};

  module.execute = async function (sender, recipient) {
    const values = {
      sender: {
        value: sender
      },
      recipient: {
        value: recipient
      }
    }
    return crud.create('follow_requests', values, true)
  }

  return module;

}