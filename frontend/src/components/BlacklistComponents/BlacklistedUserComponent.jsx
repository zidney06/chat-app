import { useContext } from "react";
import { MyContext } from "../../store/store";
import { useEffect } from "react";
import { getFetch, postFetch } from "../../utils/fetch";
import { useState } from "react";

export default function BlaclistedUserComponent() {
  const { userData } = useContext(MyContext);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    getFetch("/api/get-blacklisted-user").then((res) => {
      if (!res.success) {
        return alert(res.response.data.msg);
      }
      console.log(res.data);
      setBlockedUsers(res.data.data.blockedUsers);
    });
  }, []);

  const handleUnblockUser = (userIdTarget) => {
    console.log(userIdTarget);
    postFetch("/api/unblock-user", { userIdTarget }).then((res) => {
      if (!res.success) {
        return alert(res.response.data.msg);
      }
      console.log(res.data);
      setBlockedUsers(
        blockedUsers.filter((user) => user.id !== res.data.data.userIdTarget)
      );
    });
  };

  if (blockedUsers.length === 0) {
    return (
      <div className="p-2">
        <h2 className="text-center">Daftar User yang di blacklist</h2>
        <div>
          <p className="text-center">Tidak ada user yang di blok</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-center">Daftar User yang di blacklist</h2>
      {blockedUsers.map((usr, i) => (
        <div key={i} className="red border border-2 rounded p-1">
          <div className="border p-1 my-1">
            <div className="d-flex" style={{ height: 50 }}>
              <img
                className="rounded-circle"
                src={usr.profilePhotoUrl}
                alt="profile"
                style={{ width: 50, height: 50 }}
              />
              <div
                className="d-flex justify-content-between ps-1"
                style={{ width: "90%" }}
              >
                <p className="my-auto">
                  <strong>{usr.username}</strong>
                </p>
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleUnblockUser(usr.id)}
                >
                  Buka blacklist
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
