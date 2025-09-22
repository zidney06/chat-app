import { useEffect } from "react";
import { useState } from "react";
import { getFetch, postFetch } from "../../utils/fetch";
import { useContext } from "react";
import { MyContext } from "../../store/store";

export default function CreateGroup() {
  const { userData } = useContext(MyContext);

  const [roomName, setRoomName] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [grubMember, setGrubMember] = useState([userData.userId]);

  useEffect(() => {
    getFetch("/api/get-friendList").then((res) => {
      if (!res.success) {
        return alert(res.response.data.msg);
      }
      console.log(res.data);
      setFriendList(res.data.data.friendList);
    });
  }, []);

  const handleGrubNameChange = (e) => {
    setRoomName(e.target.value);
  };
  const addGrubMember = (userId) => {
    setGrubMember((prev) => [...prev, userId]);
  };
  const reduceGrubMember = (userId) => {
    setGrubMember((prev) => prev.filter((usrId) => usrId !== userId));
  };
  const handleCreateGrub = () => {
    if (grubMember.length < 3) {
      return alert("Anggota grub minimal 3!");
    } else if (!roomName.trim()) {
      return alert("Beri nama grub dulu");
    }
    postFetch("/api/create-grub", { roomName, grubMember }).then((res) => {
      if (!res.success) {
        return alert(res.respnse.data.msg);
      }
      console.log(res.data);
      setRoomName("");
      setGrubMember([userData.userId]);
    });
  };
  // buat handler untuk mengkonfirmasi pembuatan grub
  // member grub min 3 user (pembuat dan satu tema user) dan nama grub tidak boleh kosong
  // nanti di BE akan dicek apakah nama grub sudah ada atau belum

  console.log(roomName, grubMember);

  return (
    <div className="p-2">
      <h1 className="text-center">Buat Grub</h1>
      <div className="border p-1">
        <label className="form-label" htmlFor="group-name">
          Nama grub
        </label>
        <input
          className="form-control"
          id="group-name"
          type="text"
          onChange={handleGrubNameChange}
          value={roomName}
          autoComplete="off"
        />
        <div>
          <h4>Invite anggota grub</h4>
          <ul className="list-group">
            {friendList.map((user, i) => (
              <li key={i} className="px-2 py-1 d-flex border my-1">
                <div className="" style={{ height: 50 }}>
                  <img
                    className="rounded-circle"
                    src={user.profilePhotoUrl}
                    style={{ width: 50, height: 50 }}
                  />
                </div>

                <div
                  className="p-1 d-flex justify-content-between"
                  style={{ width: "100%" }}
                >
                  <p>
                    <strong>{user.username}</strong>
                  </p>
                  {!grubMember.includes(user.id) ? (
                    <button
                      className="btn btn-success"
                      onClick={() => addGrubMember(user.id)}
                    >
                      Invite
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() => reduceGrubMember(user.id)}
                    >
                      Batal
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={handleCreateGrub}>
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
