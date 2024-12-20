document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('baby-form');
    const recordList = document.getElementById('record-list');

    // データを取得して表示する関数
    function displayRecords() {
        const records = JSON.parse(localStorage.getItem('babyRecords')) || [];
        recordList.innerHTML = '';
        records.forEach(record => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>お名前:</strong> ${record.name} <br>
                <strong>誕生日:</strong> ${record.dob} <br>
                <strong>体重:</strong> ${record.weight}kg <br>
                <strong>身長:</strong> ${record.height}cm <br>
                <strong>写真:</strong> <br>
                <img src="${record.photo}" class="record-photo" alt="${record.name}">
                <button onclick="shareRecord('${record.name}', '${record.photo}')">共有</button>
            `;
            recordList.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        const photoInput = document.getElementById('photo');

        // 画像をbase64形式に変換
        const file = photoInput.files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
            const newRecord = {
                name,
                dob,
                weight,
                height,
                photo: reader.result // base64形式
            };

            // ローカルストレージからデータを取得
            const records = JSON.parse(localStorage.getItem('babyRecords')) || [];
            records.push(newRecord); // 新しい記録を追加
            localStorage.setItem('babyRecords', JSON.stringify(records)); // 更新

            displayRecords(); // 記録を表示
            form.reset(); // フォームをリセット
        };

        if (file) {
            reader.readAsDataURL(file); // 画像をbase64形式に変換開始
        } else {
            alert("写真を選択してください。");
        }
    });

    // ページ読み込み時に保存された記録を表示
    displayRecords();
});

// シェア機能（例示）
function shareRecord(name, photo) {
    // Web Share APIがサポートされているか確認
    if (navigator.share) {
        const shareData = {
            title: '赤ちゃんの成長記録',
            text: `お名前: ${name}`,
            url: photo
        };

        navigator.share(shareData)
        .then(() => {
            console.log('共有しました！');
        })
        .catch((error) => {
            console.error('共有エラー: ', error);
        });
    } else {
        // シェア機能がサポートされていない場合の対処
        alert("このブラウザではシェア機能がサポートされていません。");
    }
}