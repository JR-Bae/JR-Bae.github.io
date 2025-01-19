// 데이터 관리용 URL
const dataURL = './data/balance.json';

// HTML 요소 참조
const balanceElement = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
let balance = 0;

// 데이터 불러오기
async function loadData() {
    try {
        const response = await fetch(dataURL);
        if (!response.ok) throw new Error('JSON 데이터를 불러오지 못했습니다.');
        const data = await response.json();
        balance = data.balance;
        balanceElement.textContent = `현재 잔액: ${balance.toLocaleString()}원`;
        renderTransactions(data.transactions);
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        balanceElement.textContent = '잔액 정보를 불러오지 못했습니다.';
    }
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

    balance += type === 'add' ? transaction.amount : -transaction.amount;

    const updatedData = {
        balance,
        transactions: await getTransactions().concat(transaction),
    };

    console.log('업데이트된 데이터:', updatedData);
    await saveData(updatedData);
    loadData();
}

// 기존 거래 내역 가져오기
async function getTransactions() {
    const response = await fetch(dataURL);
    const data = await response.json();
    return data.transactions;
}

// 데이터 저장 (수동으로 GitHub API 사용 필요)
async function saveData(data) {
    // GitHub API를 사용하거나 커밋 후 배포 필요
    alert('현재는 데이터 저장이 지원되지 않습니다. GitHub Actions를 설정하세요.');
}

// 버튼 이벤트 핸들링
document.getElementById('add-btn').addEventListener('click', () => addTransaction('add'));
document.getElementById('subtract-btn').addEventListener('click', () => addTransaction('subtract'));

// 초기 데이터 로드
loadData();
