import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { CreateUserData, CreateUsernameVariables } from "../../util/types";
import UserOperation from "../../graphql/operations/user";

type Props = {
  session: Session | null;
  reloadedSession: () => void;
};

function Auth({ session, reloadedSession }: Props) {
  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUserData,
    CreateUsernameVariables
  >(UserOperation.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;

    try {
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log("onSubmit", error);
    }
  };

  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl" textAlign="center">
              Messenger
            </Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={
                <Image
                  height="25px"
                  src="https://drive.google.com/uc?id=13m7E6j34nEYYHKy4GrQRgfXwLFwYq2u3"
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}

export default Auth;
