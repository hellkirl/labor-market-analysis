import { config } from "./config";
import { createRequest, sleep } from "./utils";
import { collection } from "./db";
import chrome from "selenium-webdriver/chrome";
import { Builder, By } from "selenium-webdriver";

export class HHParser {
  public static async parse() {
    try {
      let page = 0;

      while (page <= 5) {
        try {
          let url = `/vacancies?industry=7&area=113&per_page=100&page=${page}`;

          const response = await createRequest({
            method: "GET",
            baseURL: config.hhUrl,
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });
          const data = response.data["items"];
          for (const item of data) {
            if (
              !(await collection.findOne({
                alternate_url: item["alternate_url"],
              }))
            ) {
              await collection.insertOne(item);
            }
          }
        } catch (err) {
          console.error(
            `ERROR! hhParser failed during execution: ${
              (err as Error).message
            }`,
          );
        }
        page++;
      }
    } catch (err) {
      const errMessage = (err as Error).message;
      console.error(errMessage);
      return;
    }
    console.log(`hhParser executed at ${new Date().toLocaleString()}`);
    return;
  }
}

export class SuperjobParser {
  public static async parse() {
    const { Builder, By } = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");

    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--headless");

    const driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();

    await sleep(10000);

    let page = 1;

    while (page < 36) {
      let vacanciesNumber = 0;
      let superjobUrl = `https://russia.superjob.ru/vacancy/search/?catalogues%5B0%5D=603&catalogues%5B1%5D=627&catalogues%5B2%5D=628&catalogues%5B3%5D=629&catalogues%5B4%5D=36&catalogues%5B5%5D=37&catalogues%5B6%5D=38&catalogues%5B7%5D=503&catalogues%5B8%5D=40&catalogues%5B9%5D=41&catalogues%5B10%5D=42&catalogues%5B11%5D=546&catalogues%5B12%5D=620&catalogues%5B13%5D=43&catalogues%5B14%5D=44&catalogues%5B15%5D=604&catalogues%5B16%5D=650&catalogues%5B17%5D=46&catalogues%5B18%5D=47&catalogues%5B19%5D=48&catalogues%5B20%5D=49&catalogues%5B21%5D=50&catalogues%5B22%5D=51&catalogues%5B23%5D=53&catalogues%5B24%5D=56&catalogues%5B25%5D=614&catalogues%5B26%5D=613&catalogues%5B27%5D=605&catalogues%5B28%5D=630&catalogues%5B29%5D=59&click_from=facet&page=${page}`;

      await driver.get(superjobUrl);

      for (const element of await driver.findElements(
        By.className("_3j-5N _2BF76 _1Sjvs _21_a3 _2yOtM _1htjG _65Aie _3WSA8"),
      )) {
        const result = await element
          .findElement(By.css("a"))
          .getAttribute("href");

        const id = result.match(/\d+/)[0];

        try {
          if (id.toString().length > 1) {
            const response = await createRequest({
              method: "GET",
              baseURL: config.superjobBaseUrl,
              url: `/vacancies/${id}/`,
              headers: {
                "X-Api-App-Id": config.superjobToken,
                host: "api.superjob.ru",
                access_token: config.superjobToken,
                "X-User-Type": "reg_user",
              },
            });

            const data = response.data;
            if (!(await collection.findOne({ link: data["link"] }))) {
              await collection.insertOne(data);
            }

            vacanciesNumber++;

            await sleep(1000);

            if (vacanciesNumber % 120 == 0) {
              await sleep(60000);
            }
          }
        } catch (err) {
          console.error(
            `ERROR! superjobParser failed during execution: ${
              (err as Error).message
            }`,
          );
          return;
        }
      }
      page++;
    }
    console.log(`superjobParser executed at ${new Date().toLocaleString()}`);
    return;
  }
}
