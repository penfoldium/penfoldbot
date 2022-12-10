const { Listener } = require("@sapphire/framework");
const { DurationFormatter } = require("@sapphire/time-utilities");

class CommmandDeniedEvent extends Listener {
  /**
   * @param {Listener.Context} context
   */
  constructor(context) {
    super(context, {
      event: "chatInputCommandDenied",
    });
  }

  /**
   * @param {import('@sapphire/framework').UserError} error
   * @param {import('@sapphire/framework').ChatInputCommandDeniedPayload} context
   */
  run(error, context) {
    let content = error.message;
    if (error.identifier == "preconditionCooldown") {
      content = `There is a cooldown in effect for this command. You can use it again in ${new DurationFormatter().format(
        error.context.remaining
      )}.`;
    }
    return context.interaction.reply({
      content,
      ephemeral: true,
    });
  }
}

module.exports = {
  CommmandDeniedEvent,
};
