import { defineMcpClientConnection } from "eve/connections";

// Wires the agent into the unfazed MCP server so it can deploy real web apps.
// UNFAZED_MCP_TOKEN is a self-registered agent token (POST
// https://unfazed.dev/agents/register) — scoped to its own account, so it can
// only touch the workspaces and deployments it creates. Free tier: unlimited
// static sites, 100 authenticated requests/month.
//
// This bot is public (anyone on Telegram can message it), so we expose only the
// static-deploy + read path. Destructive tools (delete_*, secrets, github,
// service deploys) are deliberately left out of the allow-list.
export default defineMcpClientConnection({
  url: "https://unfazed.dev/mcp",
  description:
    "unfazed — deploy live web pages. Create a workspace, write files (a single self-contained index.html with inline CSS/JS works best), then publish it as a static site at a public https://app.unfazed.dev/<alias> URL. Also list deployments and read workspace files. Use this whenever someone asks you to build, deploy, publish, or host a web page or site.",
  auth: {
    getToken: async () => ({ token: process.env.UNFAZED_MCP_TOKEN! }),
  },
  tools: {
    allow: [
      "whoami",
      "create_workspace",
      "write_workspace_text_file",
      "create_static_deployment",
      "list_deployments",
      "list_workspace_files",
      "read_workspace_file",
    ],
  },
});
