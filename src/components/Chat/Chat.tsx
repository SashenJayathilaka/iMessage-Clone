import { signOut, useSession } from "next-auth/react";

type Props = {};

function Chat({}: Props) {
  const { data: session } = useSession();

  console.log(session);

  return (
    <div>
      <div>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </div>
  );
}

export default Chat;
