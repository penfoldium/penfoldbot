const { Precondition } = require("@sapphire/framework");

class OwnerOnlyPrecondition extends Precondition {
  /**
   * @param {import('discord.js').Message} message
   */
  messageRun(message) {
    return this.ok();
  }

  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  chatInputRun(interaction) {
    return this.ok();
  }

  /**
   * @param {import('discord.js').ContextMenuInteraction} interaction
   */
  contextMenuRun(interaction) {
    return this.ok();
  }
}

module.exports = {
  OwnerOnlyPrecondition,
};
