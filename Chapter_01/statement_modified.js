const fs = require('fs');

// 변수 인라인 용도
function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

// 함수 추출
// 변수 이름 명확하게 변경 (thisAmount -> result; perf -> aPerformance)
function amountFor(aPerformance) {
  let result = 0;

  switch (playFor(aPerformance).type) {
    case 'tragedy': // 비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy': // 희극
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
  }

  return result;
}

function volumeCreditsFor(aPerformance) {
  let volumeCredits = 0;
  volumeCredits += Math.max(aPerformance.audience - 30, 0);

  if ('comedy' === playFor(aPerformance).type) {
    volumeCredits += Math.floor(aPerformance.audience / 5);
  }

  return volumeCredits;
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점 \n`;
  return result;
}

const invoices = JSON.parse(fs.readFileSync('./invoices.json').toString());
const plays = JSON.parse(fs.readFileSync('./plays.json').toString());

const [invoicesData] = invoices;
console.log(statement(invoicesData, plays));
