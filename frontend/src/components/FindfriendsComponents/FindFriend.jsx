import { useEffect } from "react";
import { getFetch, postFetch } from "../../utils/fetch";
import { useState } from "react";

export default function FindFriend() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getFetch(`/api/find-friend?page=${page}`).then((res) => {
      if (!res.success) {
        alert(res.response.data.msg);
        return;
      }

      setUsers(res.data.data);
    });
  }, []);

  const handleAskForFriendship = (userId) => {
    postFetch("/api/ask-for-friendship", { userIdTarget: userId }).then(
      (res) => {
        if (!res.success) {
          alert(res.response.data.msg);
          return;
        }
        console.log(res.data);
        setUsers(
          users.filter((user) => {
            console.log(user, userId);
            return user.id !== userId;
          })
        );
      }
    );
  };

  return (
    <div className="p-2">
      <h1 className="text-center">Temukan teman</h1>

      {/* bikin fitur cari teman */}
      <label className="form-label" htmlFor="find-friend">
        Cari teman
      </label>
      <input
        className="form-control"
        type="search"
        placeholder="Masukan Username"
        id="find-friend"
        autoComplete="off"
      />
      <ul className="list-group mt-3">
        {users.map((user, i) => (
          <li className="list-group-item d-flex" key={i}>
            <div className="" style={{ height: 50 }}>
              <img
                className="rounded-circle"
                src={user.profilePhotoUrl}
                alt="profile"
                style={{ width: 50, height: 50 }}
              />
            </div>

            <div
              className="p-1 d-flex justify-content-between"
              style={{ width: "90%" }}
            >
              <p>
                <strong>{user.username}</strong>
              </p>
              <button
                className="btn btn-outline-success"
                onClick={() => handleAskForFriendship(user.id)}
              >
                Minta pertemanan
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
