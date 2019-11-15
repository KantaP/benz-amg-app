export const getPost = `query GetPost($id: ID! , $filterPostRadeem: ModelPostRadeemSecondFilterInput , $filterPostBookmark: ModelPostBookmarkFilterInput) {
    getPost(id: $id) {
      id
      content
      enableComment
      tags
      location {
        placeName
        placeLatLng
      }
      postImages {
        items {
          id
          uri
        }
        nextToken
      }
      postComments {
        items {
            id
            content
            postId
            userId
            createdAtUnix
        }
        nextToken
      }
      postOfUser {
        id
        username
        birthDate
        firstName
        lastName
        mobilePhone
        email
        amgId
        nickName
        citizenId
        image
        address
        district
        province
        active
        pushToken
        type
        images {
          nextToken
        }
        companies {
          nextToken
        }
        postsOfUser {
          nextToken
        }
        userComments {
          nextToken
        }
        userReports {
          nextToken
        }
        userBookmarks {
          nextToken
        }
        referrers {
          nextToken
        }
        receivers {
          nextToken
        }
        userRadeem {
          nextToken
        }
        userEvents {
          nextToken
        }
      }
      owner
      type
      createdAt
      refers {
        items {
          id
          referrer
          receiver
        }
        nextToken
      }
      postBookmarks (filter: $filterPostBookmark) {
        items {
          id
          userBookmarkCode
        }
        nextToken
      }
      reports {
        items {
          id
          type
          status
          description
        }
        nextToken
      }
      postRadeem (filter: $filterPostRadeem) {
        items {
          id
          postId
          userId
        }
        nextToken
      }
      countComment
      countRefer
      countRadeem
      countBookmark
      countReport
      countConnect
      radeemQuota
      expireAtUnix
      expireAt
      expire
      pin
      createdAtUnix
      expireRedeemAt
      expireRedeemAtUnix
      redeemImage
      redeemDescription
    }
  }
  `;

  

  export const listEvents = `query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        startTime
        endTime
        description
        createdAt
        images {
          nextToken
        }
        quota
        eventJoineds {
          items {
            id
            userId
          }
          nextToken
        }
        location {
          placeName
          placeLatLng
        }
      }
      nextToken
    }
  }
  `;

  export const listUsers = `query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        birthDate
        firstName
        lastName
        mobilePhone
        email
        amgId
        nickName
        citizenId
        image
        address
        district
        province
        active
        pushToken
        type
        createdAt
        images {
          nextToken
        }
        companies {
          items {
            id
            name
            description
            phone
            address
            latlng
            website
            email
            image
            logo
          }
          nextToken
        }
        postsOfUser {
          nextToken
        }
        userComments {
          nextToken
        }
        userReports {
          nextToken
        }
        userBookmarks {
          nextToken
        }
        referrers {
          nextToken
        }
        receivers {
          nextToken
        }
        userRadeem {
          nextToken
        }
        userEvents {
          nextToken
        }
        reportComments {
          nextToken
        }
        userBlocks {
          nextToken
        }
      }
      nextToken
    }
  }
  `;

  export const searchEvents = `query SearchEvents(
    $filter: SearchableEventFilterInput
    $sort: SearchableEventSortInput
    $limit: Int
    $nextToken: Int
  ) {
    searchEvents(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        startTime
        endTime
        description
        image
        upcoming
        images {
          nextToken
        }
        quota
        eventJoineds {
          items {
            id
            userId
          }
          nextToken
        }
        location {
          placeName
          placeLatLng
        }
        createdAt
        user {
          id
          staffID
          username
          birthDate
          firstName
          lastName
          mobilePhone
          email
          amgId
          amgModel
          amgShowroom
          nickName
          citizenId
          image
          address
          subDistrict
          district
          province
          active
          pushToken
          type
          expireAt
          level
          createdAt
        }
      }
      nextToken
    }
  }
  `;
  export const getEvent = `query GetEvent($id: ID!, $filterUser: ModelUserJoinedEventFilterInput) {
    getEvent(id: $id) {
      id
      title
      startTime
      endTime
      description
      image
      images {
        items {
          id
          uri
          createdAt
        }
        nextToken
      }
      quota
      eventJoineds(filter: $filterUser) {
        items {
          id
          eventId
          userId
          eventStartTimeUnix
          eventEndTime
          createdAt
        }
        nextToken
      }
      location {
        placeName
        placeLatLng
      }
      createdAt
      upcoming
      user {
        id
        staffID
        username
        birthDate
        firstName
        lastName
        mobilePhone
        email
        amgId
        amgModel
        amgShowroom
        nickName
        citizenId
        image
        address
        subDistrict
        district
        province
        active
        pushToken
        type
        expireAt
        level
        createdAt
        images {
          nextToken
        }
        companies {
          nextToken
        }
        postsOfUser {
          nextToken
        }
        userComments {
          nextToken
        }
        userReports {
          nextToken
        }
        userBookmarks {
          nextToken
        }
        referrers {
          nextToken
        }
        receivers {
          nextToken
        }
        userRadeem {
          nextToken
        }
        userEvents {
          nextToken
        }
        reportComments {
          nextToken
        }
        userBlocks {
          nextToken
        }
        events {
          nextToken
        }
        memberShipPrice
        firstLogin
      }
    }
  }
  `;

  export const listUserJoinedEvents = `query ListUserJoinedEvents(
    $id: ID
    $eventId: ModelStringKeyConditionInput
    $filter: ModelUserJoinedEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserJoinedEvents(
      id: $id
      eventId: $eventId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        eventId
        userId
        userEvent {
          id
          staffID
          username
          birthDate
          firstName
          lastName
          mobilePhone
          email
          amgId
          amgModel
          amgShowroom
          nickName
          citizenId
          image
          address
          subDistrict
          district
          province
          active
          pushToken
          type
          expireAt
          level
          createdAt
        }
        eventJoined {
          id
          title
          startTime
          endTime
          description
          image
          quota
          createdAt
          upcoming
          location {
            placeName
            placeLatLng
          }
        }
        eventStartTimeUnix
        createdAt
      }
      nextToken
    }
  }
  `;