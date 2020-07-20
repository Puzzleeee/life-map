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
 * @param {object} viewerInfo - information of the viewer 
 * @param {function} setViewerInfo - function to set viewerInfo to initiate rerender
 * @param {object} user - information of the user the button will interact with
 */
export default function useSocialButton(viewerInfo, setViewerInfo, user) {

  if (Object.keys(viewerInfo).length === 0) {
    // viewerInfo not retrieved yet
    return [null, null, null];
  }

  // go through array of follow relationships and check if follower is the user using the button
  const isFollowing = viewerInfo.following.some((followRelationship) => followRelationship.followee === user.id);

  // go through array of sent follow requests and check if sender is the user using the button
  const requestSent = viewerInfo.sentRequests.some((request) => request.recipient === user.id);

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
    const relationship = viewerInfo.following.filter((relation) => relation.followee === user.id)[0];
    return axios.post(
      "/api/social/remove-follower-relationship",
      relationship,
      config
    ).then(() => {
      const new_following = viewerInfo.following.filter((relation) => relation.followee !== user.id);
      setViewerInfo({
        ...viewerInfo,
        following: new_following
      })
    })
  }

  function follow() {
    return axios
        .post(
          "/api/social/follow",
          { recipient: user.id },
          config
        )
        .then(({data: {request_id}}) => {
          // make a follow request object to avoid having to query endpoint again 
          const new_request = {
            id: request_id,
            sender: viewerInfo.id,
            recipient: user.id,
            date_time: new Date(),
          }
          const requests = viewerInfo.sentRequests.splice(0)
          requests.push(new_request);
          setViewerInfo({...viewerInfo, sentRequests: requests});
        })
  }

  function undoRequest() {
    const request = viewerInfo.sentRequests.filter(req => req.recipient === user.id)[0];
    return axios.post(
      "/api/social/decline-follow-request",
      request,
      config
    )
    .then(() => {
      const new_sent_requests = viewerInfo.sentRequests.filter(req => req.recipient !== user.id);
      setViewerInfo({
        ...viewerInfo,
        sentRequests: new_sent_requests
      })
    })
  }


}