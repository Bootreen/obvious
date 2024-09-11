/* eslint-disable no-console */
import { getRequestsBySessionId } from "@/backend/controllers/request-controller";
import { UserHistory } from "@/types";

export const fetchHistory = async (
  sessionsData: Record<string, any>,
): Promise<UserHistory> => {
  const history: UserHistory = [];

  // Iterate over each session and fetch their requests
  for (const session of sessionsData.sessions) {
    const { data: requestsData, status: requestsStatus } =
      await getRequestsBySessionId(session.id);

    if (requestsStatus === 200) {
      history.push({
        session: session,
        requests: requestsData.requests || [],
      });
    } else {
      console.error(`Failed to fetch requests for session ${session.id}`);
      history.push({
        session: session,
        requests: [],
      });
    }
  }

  return history;
};
