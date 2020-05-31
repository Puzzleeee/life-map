const homepage = (diary, markers) => {
  let modules = {};

  /**
   * Arranges user's diary entries data for front-end use
   * 
   * @param {number} id - the id of the user
   * @return An array of objects, each object representing a diary entry and its corresponding map marker
   */
  modules.arrangeUserData = async (id) => {
    const diaryEntries = await diary.getDiaryEntries(id);
    const promises = diaryEntries.map(async (entry) => {
      const marker = await markers.getMarkers(entry.marker_id);
      return {...entry, marker: marker}
    })
    return Promise.all(promises)
      .then((result) => {
        console.log(result);
        return result;
      }).catch((err) => {
        console.log(err)
      })
  }

  return Object.freeze(modules);
}


module.exports = homepage(require('./diary.js'), require('./markers.js'));