import type { CommunityType } from "@/types/community/communityTypes";

export const getCommunityIdFromName = (
  allCommunities: CommunityType[],
  communityName: string
) => {
  const community = allCommunities.find(
    (c) => c.communityName === communityName
  );
  return community ? community._id : null;
};
