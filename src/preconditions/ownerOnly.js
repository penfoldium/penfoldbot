const { Precondition } = require("@sapphire/framework");

class OwnerOnlyPrecondition extends Precondition {
  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async chatInputRun(interaction) {
    await interaction.client.application.fetch();
    const owner = interaction.client.application.owner.members
      ? Array.from(interaction.client.application.owner.members.values()).map(
          (member) => member.user.tag
        )
      : [interaction.client.application.owner.tag];
    if (owner.includes(interaction.user.tag)) return this.ok();
    else
      return this.error({ message: "Only bot owners can use this command." });
  }
}

module.exports = {
  OwnerOnlyPrecondition,
};
