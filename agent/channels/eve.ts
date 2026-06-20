import { eveChannel } from "eve/channels/eve";
import { none } from "eve/channels/auth";

// The eve channel exposes the agent over the /eve/v1 HTTP protocol (sessions +
// NDJSON streaming) — handy for a web chat UI. This demo runs it open (no auth);
// for anything real, swap none() for your own auth provider.
export default eveChannel({
  auth: [none()],
});
