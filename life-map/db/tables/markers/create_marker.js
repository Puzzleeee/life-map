module.exports = function (crud) {
  let module = {};

  /**
   * Creates a marker and returns the assigned marker_id of the newly created marker
   */
  module.execute = async function (user_id, lng, lat, name, address, variant) {
    const values = {
      user_id: {
        value: user_id,
      },
      lng: {
        value: lng,
      },
      lat: {
        value: lat,
      },
      name: {
        value: name,
      },
      address: {
        value: address,
      },
      variant: {
        value: variant,
      },
    };

    return crud
      .create("markers", values, true)
      .then((result) => {
        console.log("Marker created successfully");
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return module;
};
