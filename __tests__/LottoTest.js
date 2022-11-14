const Lotto = require('../src/Lotto');
const Accounting = require('../src/Accounting');
const LotteryApp = require('../src/LotteryApp');
const MESSAGE = require('../src/constants/lottoMessage');

const MissionUtils = require('@woowacourse/mission-utils');

const mockQuestions = (answers) => {
  MissionUtils.Console.readLine = jest.fn();
  answers.reduce((acc, input) => acc.mockImplementationOnce((question, callback) => {
    callback(input);
  }), MissionUtils.Console.readLine);
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickUniqueNumbersInRange = jest.fn();
  numbers.reduce((acc, number) => acc
    .mockReturnValueOnce(number), MissionUtils.Random.pickUniqueNumbersInRange);
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

describe('로또 클래스 테스트', () => {
  test('로또 번호의 개수가 6개가 넘어가면 예외가 발생한다.', () => {
    expect(() => {
      new Lotto([1, 2, 3, 4, 5, 6, 7]);
    }).toThrow(MESSAGE.ERROR.INVALID_LENGTH);
  });

  // TODO: 이 테스트가 통과할 수 있게 구현 코드 작성
  test('로또 번호에 중복된 숫자가 있으면 예외가 발생한다.', () => {
    expect(() => {
      new Lotto([1, 2, 3, 4, 5, 5]);
    }).toThrow(MESSAGE.ERROR.DUPLICATE_DIGIT);
  });

  test('로또 번호가 1이상 45이하가 아니면 예외가 발생한다.', () => {
    expect(() => {
      new Lotto([1, 2, 45, 46, 3, 1]);
    }).toThrow(MESSAGE.ERROR.INVALID_DIGIT);
  });
  // 아래에 추가 테스트 작성 가능
});

describe('구입 금액 입력 테스트', () => {
  test('구입 금액이 0원 이하일 경우 예외가 발생한다.', () => {
    const accounting = new Accounting();
    expect(() => {
      accounting.money = -5000;
    }).toThrow(MESSAGE.ERROR.INVALID_MONEY);
  });

  // TODO: 이 테스트가 통과할 수 있게 구현 코드 작성
  test('구입 금액은 1000원 단위로 입력할 수 있습니다.', () => {
    const accounting = new Accounting();
    expect(() => {
      accounting.money = 1005;
    }).toThrow(MESSAGE.ERROR.REMAIN_CHANGE);
  });

  // 아래에 추가 테스트 작성 가능
});

describe('로또 구매 테스트', () => {
  test('구입 금액 1000원일 때 1장 발급', () => {
    mockRandoms([
      [8, 21, 23, 41, 42, 43],
    ]);

    const logs = [
      '1개를 구매했습니다.',
      '[8, 21, 23, 41, 42, 43]',
    ];
    const logSpy = getLogSpy();
    const lotteryApp = new LotteryApp();
    lotteryApp.purchaseLottos(1000);
    logs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });

  test('구입 금액이 8000원일 때 8장 발급', () => {
    mockRandoms([
      [8, 21, 23, 41, 42, 43],
      [3, 5, 11, 16, 32, 38],
      [7, 11, 16, 35, 36, 44],
      [1, 8, 11, 31, 41, 42],
      [13, 14, 16, 38, 42, 45],
      [7, 11, 30, 40, 42, 43],
      [2, 13, 22, 32, 38, 45],
      [1, 3, 5, 14, 22, 45],
    ]);

    const logs = [
      '8개를 구매했습니다.',
      '[8, 21, 23, 41, 42, 43]',
      '[3, 5, 11, 16, 32, 38]',
      '[7, 11, 16, 35, 36, 44]',
      '[1, 8, 11, 31, 41, 42]',
      '[13, 14, 16, 38, 42, 45]',
      '[7, 11, 30, 40, 42, 43]',
      '[2, 13, 22, 32, 38, 45]',
      '[1, 3, 5, 14, 22, 45]',
    ];
    const logSpy = getLogSpy();
    const lotteryApp = new LotteryApp();
    lotteryApp.purchaseLottos(8000);
    logs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });
  // 아래에 추가 테스트 작성 가능
});
