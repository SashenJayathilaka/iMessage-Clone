import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

import UserOperation from "../../graphql/operations/user";
import { CreateUserData, CreateUsernameVariables } from "../../util/types";

type Props = {
  session: Session | null;
  reloadedSession: () => void;
};

function Auth({ session, reloadedSession }: Props) {
  const [username, setUsername] = useState("");

  const [createUsername, { loading, error }] = useMutation<
    CreateUserData,
    CreateUsernameVariables
  >(UserOperation.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;

    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        throw new Error(error);
      }

      toast.success("Username Successfully Created");

      // Reload the session to obtain new username
      reloadedSession();
    } catch (error: any) {
      toast.error(error.message);
      console.log("onSubmit", error.message);
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
            <Button isLoading={loading} width="100%" onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Image
              height="160px"
              src="https://drive.google.com/uc?id=1AjomAgj4yxhOd1R0otMEo65f7lPzr2rh"
            />
            <Text fontSize="3xl" textAlign="center">
              iMessenger
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
