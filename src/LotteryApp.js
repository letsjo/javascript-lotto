// 모듈
const { Console } = require('@woowacourse/mission-utils');
// 상수
const MESSAGE = require('./constants/lottoMessage');
const { LOTTO_INFO } = require('./constants/lottoSetting');
// 오브젝트
const Lotteries = require('./Lotteries');
const Calc = require('./utils/Calc');
const Accounting = require('./Accounting');

class LotteryApp {
  constructor () {
    this.lotteries = new Lotteries();
    this.accounting = new Accounting();
  }

  start () {
    this.askMoney();
  }

  askMoney () {
    Console.print(MESSAGE.PROCESS.INPUT_MONEY);
    Console.readLine('', this.purchaseLottos.bind(this));
  }

  purchaseLottos (money) {
    this.accounting.money = money;
    let leftMoney = money;
    while (leftMoney > 0) {
      leftMoney -= LOTTO_INFO.PRICE;
      this.lotteries.purchaseAuto();
    }
    this.showLottos();
    this.askWinningDigit();
  }

  askWinningDigit () {
    Console.print(`${MESSAGE.PROCESS.INPUT_WINNING_DIGIT}`);
    Console.readLine('', this.makeWinningLotto.bind(this));
  }

  makeWinningLotto (digits) {
    this.lotteries.winningLotto = digits.split(',').map(Number);
    this.askBonusDigit();
  }

  askBonusDigit () {
    Console.print(`\n${MESSAGE.PROCESS.INPUT_BONUS_DIGIT}`);
    Console.readLine('', this.showResult.bind(this));
  }

  showResult (digits) {
    this.lotteries.bonusLotto = Number(digits);
    this.showRank();
    this.showProfit();
    Console.close();
  }

  showRank () {
    Console.print(`\n${MESSAGE.PROCESS.SHOW_PRIZE_NOTICE}`);
    this.lotteries.getRankGroup().forEach(([rank, qty]) => {
      Console.print(Calc.printRank(rank, qty));
    });
  }

  showProfit () {
    const totalPrizeMoney = this.lotteries.getTotalPrize();
    const profitRate = this.accounting.calcProfitRate(totalPrizeMoney);
    Console.print(Calc.printProfit(profitRate));
  }

  showLottos () {
    Console.print('\n');
    Console.print(this.lotteries.getSaleQty() + MESSAGE.PROCESS.SHOW_TICKET_QTY);
    Console.print(this.lotteries.getStorage().reduce(Calc.printLotto, ''));
  }
}

module.exports = LotteryApp;
