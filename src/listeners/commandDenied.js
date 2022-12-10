const {
  Listener,
  // eslint-disable-next-line no-unused-vars
  ChatInputCommandDeniedPayload,
  // eslint-disable-next-line no-unused-vars
  UserError,
} = require("@sapphire/framework");
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
   * @param {UserError} error
   * @param {ChatInputCommandDeniedPayload} context
   */
  run(error, context) {
    if (error.identifier == "preconditionCooldown") {
      return context.interaction.reply({
        content: `There is a cooldown in effect for this command. You can use it again in ${new DurationFormatter().format(
          error.context.remaining
        )}.`,
        ephemeral: true,
      });
    }
  }
}

module.exports = {
  CommmandDeniedEvent,
};
