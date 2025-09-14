import { client } from "@/lib/rpc/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
