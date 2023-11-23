import { HHParser, SuperjobParser } from "./parsers";
import cron from "node-cron";

class Parsers {
  public static runParsers = async () => {
    await HHParser.parse();
    await SuperjobParser.parse();
  };

  public static scheduleParsers = () => {
    cron.schedule("0 */12 * * *", async () => {
      console.log(`Running parsers at ${new Date().toLocaleString()}`);
      await this.runParsers();
    });
  };
}

if (require.main === module) {
  Parsers.runParsers();
  Parsers.scheduleParsers();
}
