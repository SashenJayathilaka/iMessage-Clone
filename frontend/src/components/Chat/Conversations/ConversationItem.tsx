import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";

import { ConversationPopulated } from "../../../../../backend/src/util/types";
import { formatUsernames } from "../../../util/functions";

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

type Props = {
  userId: string;
  conversationData: ConversationPopulated;
  onClick: () => void;
  hasSeenLatestMessage?: boolean | undefined;
  onDeleteConversation: (conversationId: string) => Promise<void>;
  isSelected: boolean;
};

function ConversationItem({
  hasSeenLatestMessage,
  conversationData,
  onClick,
  onDeleteConversation,
  isSelected,
  userId,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === "click") {
      onClick();
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };
  return (
    <Stack
      direction="row"
      align="center"
      justify="space-between"
      p={4}
      cursor="pointer"
      borderRadius={4}
      bg={isSelected ? "whiteAlpha.200" : "none"}
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative"
    >
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg="#2d2d2d">
          {/*           <MenuItem
            icon={<AiOutlineEdit fontSize={20} />}
            onClick={(event) => {
              event.stopPropagation();
              // onEditConversation();
            }}
            bg="#2d2d2d"
            _hover={{ bg: "whiteAlpha.300" }}
          >
            Edit
          </MenuItem> */}

          <MenuItem
            icon={<MdDeleteOutline fontSize={20} />}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteConversation(conversationData.id);
            }}
            bg="#2d2d2d"
            _hover={{ bg: "whiteAlpha.300" }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>

      <Flex position="absolute" left="-6px">
        {hasSeenLatestMessage === false && (
          <GoPrimitiveDot fontSize={18} color="#6B46C1" />
        )}
      </Flex>
      <Avatar name={formatUsernames(conversationData.participants, userId)} />
      <Flex justify="space-between" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {formatUsernames(conversationData.participants, userId)}
          </Text>
          {conversationData.latestMessage && (
            <Box width="140%">
              <Text
                color="whiteAlpha.700"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {conversationData.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text
          color="whiteAlpha.700"
          position="absolute"
          right={4}
          textAlign="right"
        >
          {formatRelative(new Date(conversationData.updatedAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Text>
      </Flex>
    </Stack>
  );
}

export default ConversationItem;
