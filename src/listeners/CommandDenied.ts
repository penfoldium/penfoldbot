import { ApplyOptions } from "@sapphire/decorators";
import {
  Events,
  Listener,
  ListenerOptions,
  type ChatInputCommandDeniedPayload,
  type UserError,
} from "@sapphire/framework";
import { DurationFormatter } from "@sapphire/time-utilities";

@ApplyOptions<ListenerOptions>({ event: Events.ChatInputCommandDenied })
export class CommandDeniedListener extends Listener {
  public run(error: UserError, payload: ChatInputCommandDeniedPayload) {
    const content =
      error.identifier == "preconditionCooldown"
        ? `There is a cooldown in effect for this command. You can use it again in ${new DurationFormatter().format(
            Reflect.get(Object(error.context), "remaining")
          )}.`
        : error.message;

    return payload.interaction.reply({
      content,
      ephemeral: true,
    });
  }
}
