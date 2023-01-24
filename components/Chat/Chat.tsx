import { signOut } from "next-auth/react";

type Props = {};

function Chat({}: Props) {
  return (
    <div>
      <div>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </div>
  );
}

export default Chat;
