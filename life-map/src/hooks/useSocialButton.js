import axios from "axios";

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

/**
 * Custom hook for social button that changes between "Follow", "Unfollow" and "Requested" based on relationship
 * between the viewer and the user being displayed
 * 
 * @param {object} profileInfo - information of the profile the button is on
 * @param {function} setProfile - function to set profileInfo to initiate rerender
 * @param {object} user - information of the user using the button 
 */
export default function useSocialButton(profileInfo, setProfile, user) {

  if (Object.keys(profileInfo).length === 0) {
    // profileInfo not retrieved yet
    return [null, null, null];
  }

  // go through array of follow relationships and check if followee is the user in this card
  const isFollowing = profileInfo.following.some((followRelationship) => followRelationship.followee === user.id);

  // go through array of sent follow requests and check if recipient is the user in this card
  const requestSent = profileInfo.sentRequests.some((request) => request.recipient === user.id);

  // The function that will handle the click on the button
  function handleClick(event) {
    event.stopPropagation();
    // Following
    if (isFollowing) {
      return unfollow().catch((err) => console.log(err));
    }

    // Not following and request not sent
    if (!isFollowing && !requestSent) {
      return follow().catch((err) => console.log(err));
    }

    // Request sent but not accepted
    if (!isFollowing && requestSent) {
      return undoRequest().catch((err) => console.log(err));
    }
  }


  return [isFollowing, requestSent, handleClick];
  /**
   * Functions to perform the 3 possible actions: unfollow, follow and cancelling of request sent 
   */
  function unfollow() {
    const relationship = profileInfo.following.filter((relation) => relation.followee === user.id)[0];
    return axios.post(
      "/social/remove-follower-relationship",
      relationship,
      config
    ).then(() => {
      const new_following = profileInfo.following.filter((relation) => relation.followee !== user.id);
      setProfile({
        ...profileInfo,
        following: new_following
      })
    })
  }

  function follow() {
    return axios
        .post(
          "/social/follow",
          { recipient: user.id },
          config
        )
        .then(({request_id}) => {
          // make a follow request object to avoid having to query endpoint again 
          const new_request = {
            id: request_id,
            sender: profileInfo.id,
            recipient: user.id,
            date_time: new Date(),
          }
          const requests = profileInfo.sentRequests.splice(0)
          requests.push(new_request);
          setProfile({...profileInfo, sentRequests: requests});
        })
  }

  function undoRequest() {
    const request = profileInfo.sentRequests.filter(req => req.recipient === user.id)[0];
    return axios.post(
      "/social/decline-follow-request",
      request,
      config
    )
    .then(() => {
      const new_sent_requests = profileInfo.sentRequests.filter(req => req.recipient !== user.id);
      setProfile({
        ...profileInfo,
        sentRequests: new_sent_requests
      })
    })
  }


}