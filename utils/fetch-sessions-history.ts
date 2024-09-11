/* eslint-disable no-console */
import { getRequestsBySessionId } from "@/backend/controllers/request-controller";
import { deleteSession } from "@/backend/controllers/session-controller";
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
    } else if (requestsStatus === 404) {
      // delete empty session
      deleteSession(session.id);
    } else {
      // unknown error, ignoring this session in history
      console.error(`Failed to fetch requests for session ${session.id}`);
    }
  }

  return history;
};
