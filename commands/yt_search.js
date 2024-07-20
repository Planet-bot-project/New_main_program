const { ApplicationCommandOptionType } = require("discord.js");
const yts = require("yt-search"); //yt-searchを読み込む

module.exports = {
  name: "yt_search",
  description: "🔍YouTubeの動画を検索します",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "keyword",
      description: "検索キーワード",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const keyword = interaction.options.getString("keyword");
      await yts({ query: keyword }, async function (err, result) {
        if (err) {
          console.log(`ytSearch ERROR: ${err}`);
          return interaction.editReply({
            content:
              "エラーが発生しました。時間を空けてもう一度お試しください。",
            ephemeral: true,
          });
        }

        let tenResult = result.all.slice(0, 9); //結果のうち10個分を抽出

        let embedDescriptions = [];
        for (let value of tenResult) {
          let embedDescription = `[\`${value.type}\`]`;
        }

        await interaction.editReply({
          content: result.all[0].url,
          ephemeral: true,
        });
      });
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
