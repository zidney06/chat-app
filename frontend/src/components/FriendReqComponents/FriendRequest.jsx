import { useContext, useEffect } from "react";
import { getFetch, postFetch } from "../../utils/fetch";
import { useState } from "react";

export default function FriendRequest() {
  const [friendRequestUsers, setFriendRequestUsers] = useState([]);

  useEffect(() => {
    getFetch("/api/friend-request").then((res) => {
      if (!res.success) {
        alert(res.response.data.msg);
        return;
      }
      setFriendRequestUsers(res.data.data);
    });
  }, []);

  const handleAcceptFriendReq = (userIdTarget) => {
    postFetch("/api/accept-friend-request", {
      userIdTarget: userIdTarget,
    }).then((res) => {
      if (!res.success) {
        alert(res.response.data.msg);
        return;
      }
      setFriendRequestUsers((prev) => {
        return prev.filter((user) => user.id !== res.data.data.userTargetId);
      });
    });
  };
  const handleDeclineFriendReq = (userIdTarget) => {
    postFetch("/api/decline-friend-request", {
      userIdTarget: userIdTarget,
    }).then((res) => {
      if (!res.success) {
        alert(res.response.data.msg);
        return;
      }
      setFriendRequestUsers((prev) => {
        return prev.filter((user) => user.id !== res.data.data.userTargetId);
      });
    });
  };
  const handleBlacklistUser = (userIdTarget) => {
    if (confirm("Yakin mau di blokir?")) {
      postFetch("/api/blacklist-user", { userIdTarget }).then((res) => {
        if (!res.success) {
          alert(res.data.reponse);
          return;
        }
        console.log(res.data);
        setFriendRequestUsers((prev) => {
          return prev.filter((user) => user.id !== res.data.data.userTargetId);
        });
      });
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-center">Daftar Permintaan pertemanan</h2>
      <div className="red border border-2 rounded p-1">
        {friendRequestUsers.length > 0 ? (
          friendRequestUsers.map((user, i) => (
            <div className="border p-1 my-1" key={i}>
              <div className="d-flex" style={{ height: 50 }}>
                <img
                  className="rounded-circle"
                  src={user.profilePhotoUrl}
                  alt="profile"
                  style={{ width: 50, height: 50 }}
                />
                <p className="my-auto ps-1">
                  <strong>{user.username}</strong>
                </p>
              </div>

              <div className="d-flex justify-content-between my-1">
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleAcceptFriendReq(user.id)}
                >
                  Terima
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeclineFriendReq(user.id)}
                >
                  Tolak
                </button>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => handleBlacklistUser(user.id)}
                >
                  Blacklist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mb-0">Tidak ada permintaan pertemanan</p>
        )}
      </div>
    </div>
  );
}
