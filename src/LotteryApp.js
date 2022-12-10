const { Console } = require('@woowacourse/mission-utils');
const MESSAGE = require('./constants/lottoMessage');
const { LOTTO_INFO } = require('./constants/lottoSetting');
const Lotteries = require('./Lotteries');
const Accounting = require('./Accounting');

class LotteryApp {
  constructor() {
    this.lotteries = new Lotteries();
    this.accounting = new Accounting();
  }

  start() {
    this.askMoney();
  }

  askMoney() {
    Console.print(MESSAGE.PROCESS.inputMoney);
    Console.readLine('', this.purchaseLottos.bind(this));
  }

  purchaseLottos(money) {
    this.accounting.setMoney(money);
    let leftMoney = money;
    while (leftMoney > 0) {
      leftMoney -= LOTTO_INFO.PRICE;
      this.lotteries.purchaseAuto();
    }

    this.showLottos();
    this.askWinningDigit();
  }

  showLottos() {
    Console.print(
      `\n${this.lotteries.getSaleQuantity()
      + MESSAGE.PROCESS.showTicketQuantity
      + this.combineLottos()
      }`,
    );
  }

  combineLottos() {
    return this.lotteries
      .getStorage()
      .reduce(
        (combineConsole, lotto) => (combineConsole += `[${LotteryApp.#sortLotto(lotto)}]\n`),
        '',
      );
  }

  static #sortLotto(lotto) {
    return LotteryApp.#arrayToString(
      lotto.getLotto().sort((front, back) => front - back),
    );
  }

  static #arrayToString(arr) {
    return [...arr].join(', ');
  }

  askWinningDigit() {
    Console.print(`${MESSAGE.PROCESS.inputWinningDigit}`);
    Console.readLine('', this.makeWinningLotto.bind(this));
  }

  makeWinningLotto(digits) {
    this.lotteries.setWinningLotto(digits.split(',').map(Number));
    this.askBonusDigit();
  }

  askBonusDigit() {
    Console.print(`\n${MESSAGE.PROCESS.inputBonusDigit}`);
    Console.readLine('', this.showResult.bind(this));
  }

  showResult(digits) {
    this.lotteries.setBonusLotto(Number(digits));
    this.showRank();
    this.showProfit();
    Console.close();
  }

  showRank() {
    Console.print(`\n${MESSAGE.PRIZE.showPrizeNotice}`);
    this.lotteries.makeRankGroup();
    Object.entries(this.lotteries.getRankGroup()).forEach(
      ([rank, quantity]) => {
        Console.print(`${MESSAGE.PRIZE[rank]} - ${quantity}개`);
      },
    );
  }

  showProfit() {
    this.lotteries.calcTotalPrize();
    const profitRate = this.accounting.calcProfitRate(
      this.lotteries.getTotalPrize(),
    );
    Console.print(`총 수익률은 ${profitRate}%입니다.`);
  }
}

module.exports = LotteryApp;
