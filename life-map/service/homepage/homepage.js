const homepage = (diary, markers, media) => {
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
      const marker = markers.getMarkers(entry.marker_id);
      const photos = media.retrievePhotos(entry.id);
      const info = await Promise.all([marker, photos]);
      console.log(info[1]);
      return {...entry, marker: info[0][0], photos: info[1]}
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


module.exports = homepage(require('./diary.js'), require('./markers.js'), require('./media.js'));