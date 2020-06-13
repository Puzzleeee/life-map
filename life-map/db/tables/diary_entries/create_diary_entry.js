module.exports = function (crud) {

  let module = {};

  module.execute = async function (user_id, marker_id, title, content, shared) {
    const values = {
      user_id: {
        value: user_id
      },
      marker_id: {
        value: marker_id
      },
      title: {
        value: title
      },
      content: {
        value: content
      },
      shared: {
        value: shared
      }
    };
    
    return crud.create('diary_entries', values, true)
      .then((result) => {
        console.log("diary entry created successfully");
        return result;
      }).catch((err) => {
        console.log(err);
        throw err;
      });

  }

  return module;

}