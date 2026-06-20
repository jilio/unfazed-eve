import { telegramChannel } from "eve/channels/telegram";

// Puts the agent behind a Telegram bot. The channel mounts POST /eve/v1/telegram
// and verifies the X-Telegram-Bot-Api-Secret-Token header before trusting an
// update. Credentials come from env (set them as deploy secrets, never commit):
//   TELEGRAM_BOT_TOKEN            — replies, typing, callbacks (from @BotFather)
//   TELEGRAM_WEBHOOK_SECRET_TOKEN — must match the secret_token you setWebhook
//   TELEGRAM_BOT_USERNAME         — optional, your @handle (no @) for group
//                                   @mention/command detection
//
// eve does NOT call setWebhook for you — register the deployed URL yourself:
//   curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
//     -H "Content-Type: application/json" \
//     -d '{"url":"https://app.unfazed.dev/<alias>/eve/v1/telegram",
//          "secret_token":"'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'",
//          "allowed_updates":["message","callback_query"]}'
export default telegramChannel({
  botUsername: process.env.TELEGRAM_BOT_USERNAME,
});
