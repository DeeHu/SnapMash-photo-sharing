import React, { useState } from 'react';
import PendingFriendRequests from './PendingFriendRequests';
import FriendList from './FriendList';
import { FriendRequest } from './FriendRequest';

const ManageFriends = () => {
    const [updateFriends, setUpdateFriends] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    return (
        <div>
            <FriendRequest onRequestSent={() => setRequestSent(prevState => !prevState)} />
            <PendingFriendRequests updateFriends={updateFriends} setUpdateFriends={setUpdateFriends} requestSent={requestSent} />
            <FriendList updateFriends={updateFriends} setUpdateFriends={setUpdateFriends} />
        </div>
    );
};

export default ManageFriends;
