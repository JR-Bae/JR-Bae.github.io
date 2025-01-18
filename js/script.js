// 데이터 관리용 URL
const dataURL = '/data/balance.json';

// HTML 요소 참조
const balanceElement = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
let balance = 0;

// 데이터 불러오기
async function loadData() {
    const response = await fetch(dataURL);
    const data = await response.json();
    balance = data.balance;
    balanceElement.textContent = `현재 잔액: ${balance.toLocaleString()}원`;
    renderTransactions(data.transactions);
}

// 거래 내역 렌더링
function renderTransactions(transactions) {
    transactionList.innerHTML = '';
    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${transaction.photo || ''}" class="transaction-photo" alt="사진">
            [${transaction.time}] ${transaction.type === 'add' ? '입금' : '출금'} ${transaction.amount.toLocaleString()}원 - ${transaction.memo || '메모 없음'}
        `;
        transactionList.appendChild(li);
    });
}

// 거래 추가
async function addTransaction(type) {
    const amount = prompt(type === 'add' ? '얼마를 입금할까요?' : '얼마를 출금할까요?');
    const memo = prompt('메모를 입력하세요 (선택):');
    const photo = prompt('사진 경로를 입력하세요 (선택):');

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert('유효한 금액을 입력하세요.');
        return;
    }

    const transaction = {
        type,
        amount: Number(amount),
        time: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        memo: memo || null,
        photo: photo || null,
    };

    // 업데이트된 데이터로 잔액 갱신
    balance += type === 'add' ? transaction.amount : -transaction.amount;

    const updatedData = {
        balance,
        transactions: await getTransactions().concat(transaction),
    };

    await saveData(updatedData);
    loadData();
}

// 기존 거래 내역 가져오기
async function getTransactions() {
    const response = await fetch(dataURL);
    const data = await response.json();
    return data.transactions;
}

// 데이터 저장 (수동으로 커밋해야 함)
async function saveData(data) {
    console.log('업데이트된 데이터:', data); // GitHub Actions로 업데이트 시 필요
}

// 버튼 이벤트 핸들링
document.getElementById('add-btn').addEventListener('click', () => addTransaction('add'));
document.getElementById('subtract-btn').addEventListener('click', () => addTransaction('subtract'));

// 초기 데이터 로드
loadData();
