import { Skeleton } from "@chakra-ui/react";
import React from "react";

type Props = {
  count: number;
  height: string;
  width?: string;
};

function SkeletonLoader({ count, height, width }: Props) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          height={height}
          width={{ base: "full" }}
          borderRadius={4}
        />
      ))}
    </>
  );
}

export default SkeletonLoader;
