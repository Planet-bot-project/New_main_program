const {
  SlashCommandBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const profileSchema = require("../models/profileSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticky")
    .setDescription("ピン留めメッセージを作成/削除します")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("on")
        .setDescription("このチャンネルでピン留めを有効にします")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("off")
        .setDescription("このチャンネルで有効なピン留めを削除します")
    ),

  run: async (client, interaction) => {
    try {
      let subcommand = await interaction.options.getSubcommand();

      if (subcommand == "on") {
        // TODO: モーダルを表示して入力を受け付ける
        profileSchema
          .findById(interaction.guild.id)
          .then(async (result) => {
            if (result.sticky.status)
              return interaction.reply({
                content:
                  "このチャンネルで既にピン留めが有効になっています。\n一度`/sticky off`を実行してピン留めを解除してから再度お試しください。",
                flags: MessageFlags.Ephemeral,
              });

            // モーダルの表示
            let modal = new ModalBuilder()
              .setCustomId("sticky")
              .setTitle("ピン留めの内容を設定");
            let messageInput = new TextInputBuilder()
              .setCustomId("stickyMessage")
              .setLabel("ピン留めをするメッセージを入力してください。")
              .setPlaceholder("ここにメッセージを入力してください。")
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(1)
              .setMaxLength(250)
              .setRequired(true);
            let imageURLInput = new TextInputBuilder()
              .setCustomId("stickyImageURL")
              .setLabel(
                "ピン留めする画像がある場合はそのURLを入力してください。"
              )
              .setPlaceholder("ここに画像のURLを入力してください。")
              .setStyle(TextInputStyle.Short)
              .setRequired(false);

            let actionRow = new ActionRowBuilder().addComponents(messageInput);
            modal.addComponents(actionRow);
            actionRow = new ActionRowBuilder().addComponents(imageURLInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
          })
          .catch((err) => {
            console.log(`Error: ${err}`);
          });
      } else if (subcommand == "off") {
        // TODO: DBを更新して、ピン止め用メッセージを消せたら消す。
      } else {
        await interaction.reply({
          content:
            "意図していないサブコマンドを検知しました。お手数ですがサポートサーバーまでお問い合わせください。",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
