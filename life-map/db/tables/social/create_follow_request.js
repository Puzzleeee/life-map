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
    return crud.create('sender', values);
  }

  return module;

}