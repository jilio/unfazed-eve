# unfazed-eve

A Telegram bot that **deploys live websites for you**, built with
[Vercel eve](https://www.npmjs.com/package/eve), powered by **Claude Sonnet
4.6**, and deployed on [unfazed](https://unfazed.dev).

Message the bot "make me a landing page about X" and it writes the HTML, deploys
it through the unfazed MCP, and replies with a live `https://app.unfazed.dev/…`
URL.

```
You ▸  задеплой страничку про шейдеры
Bot ▸  Готово! https://app.unfazed.dev/shaders-intro
```

## How it works

```
agent/
  agent.ts              model: Claude Sonnet 4.6 (via OpenRouter)
  instructions.md       persona + "you can publish real web pages"
  channels/
    eve.ts              the /eve/v1 HTTP protocol (web chat surface)
    telegram.ts         the Telegram bot (POST /eve/v1/telegram webhook)
  connections/
    unfazed.ts          unfazed MCP tools — the deploy superpower
sandbox.ts              pin eve's sandbox to just-bash (pure-JS)
unfazed.json            tells unfazed how to build & serve this app
```

- **Channels** are how people reach the agent. `telegram.ts` and `eve.ts` are
  auto-discovered from `agent/channels/`.
- **Connections** are external tools the model can call. `unfazed.ts` is an MCP
  connection to `https://unfazed.dev/mcp` with a **scoped allow-list** (static
  deploy + read only) — so a public bot can't delete things or burn the quota.
- The unfazed token is a **self-registered agent account**, sandboxed to its own
  workspaces (free tier: unlimited static sites, 100 requests/month).

## Deploy on unfazed

1. **Get an unfazed agent token** for the deploy connection:
   ```bash
   curl -sX POST https://unfazed.dev/agents/register \
     -H 'Content-Type: application/json' \
     -d '{"agent_name":"my eve bot"}' | jq -r .access_token
   ```
2. **Create a Telegram bot** with [@BotFather](https://t.me/BotFather) and copy
   its token.
3. **Set the secrets** (see [`.env.example`](.env.example) for the full list) —
   `OPENROUTER_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET_TOKEN`,
   `UNFAZED_MCP_TOKEN` — plus the non-secret runtime env
   `WORKFLOW_LOCAL_DATA_DIR` and `WORKFLOW_LOCAL_BASE_URL`.
4. **Deploy** the repo as a SERVICE — set it `always_on` with health path
   `/eve/v1/health` (these are deploy-time options; `unfazed.json` only carries
   the build config).
5. **Register the Telegram webhook** (eve does not call `setWebhook` for you):
   ```bash
   curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -H 'Content-Type: application/json' \
     -d '{"url":"https://app.unfazed.dev/<alias>/eve/v1/telegram",
          "secret_token":"'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'",
          "allowed_updates":["message","callback_query"]}'
   ```

Then DM the bot. Verify health any time at
`https://app.unfazed.dev/<alias>/eve/v1/health`.

## Local development

```bash
bun install
cp .env.example .env   # fill in your keys
bun run dev            # eve dev
```

## Notes

- `unfazed.json` builds eve with `NITRO_PRESET=standard` (invoking the eve CLI
  via `bun`) and points `entry` at eve's Nitro server output.
- No secrets live in this repo. Tokens are read from the environment at runtime
  and set as deploy secrets.

## License

[MIT](LICENSE)
