import { useEffect } from "react";
import { useUser } from "../hooks/user.hooks";
import "../redux";

const UserMain = (props: {
  fetchUser: () => void
}) => {
  const { user, loading } = useUser();

  useEffect(() => {
    props.fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user loaded.</p>;

  return (
    <>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </>
  );
};

export const UserPage = () => {
  const { fetch } = useUser();

  const fetchUser = () => {
    fetch("1");
  };
  return (
    <div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <UserMain fetchUser={fetchUser} />
      <button onClick={() => { fetchUser(); }}>
        Load user
      </button>
    </div>
  );
};