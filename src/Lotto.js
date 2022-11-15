const { LOTTO_INFO } = require('./constants/lottoSetting');

// 오프젝트
const Validator = require('./utils/Validator');

class Lotto {
  #numbers;

  constructor (numbers) {
    this.#numbers = Validator.validateLotto(numbers);
  }

  getLotto () {
    return this.#numbers;
  }

  hasDigit (digits) {
    return this.#numbers.includes(digits);
  }

  countMatchDigit (winningLotto) {
    return (LOTTO_INFO.DIGIT_LENGTH * 2) - new Set([...winningLotto, ...this.#numbers]).size;
  }
}

module.exports = Lotto;
