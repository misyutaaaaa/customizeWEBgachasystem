let imageList = []; // インポートされた画像とそのレアリティを管理

// 画像のプレビューとレアリティ選択
document.getElementById("imageInput").addEventListener("change", function(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = "";
    imageList = []; // リセット

    for (const file of files) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        
        // 画像とレアリティを管理するオブジェクトを作成
        const imageItem = {
            file: file,
            rarity: null,
        };
        imageList.push(imageItem);

        const div = document.createElement("div");
        div.className = "image-item";
        div.appendChild(img);

        // レアリティ選択メニュー
        const select = document.createElement("select");
        select.innerHTML = `
            <option value="">レアリティを選択</option>
            <option value="ノーマル">ノーマル</option>
            <option value="レア">レア</option>
            <option value="スペシャルレア">スペシャルレア</option>
        `;
        select.addEventListener("change", (e) => {
            imageItem.rarity = e.target.value; // 選択されたレアリティを画像に設定
        });
        div.appendChild(select);

        imagePreview.appendChild(div);
    }
});

// 音楽プレビュー
document.getElementById("musicInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const audio = document.getElementById("audioPreview");
        audio.src = URL.createObjectURL(file);
        audio.style.display = "block";
    }
});

// レアリティを追加
function addRarity() {
    const rarityInputs = document.getElementById("rarityInputs");
    const div = document.createElement("div");
    div.className = "rarity-input";
    div.innerHTML = `
        <label>レアリティ名: </label><input type="text" placeholder="例: レア">
        <label>確率: </label><input type="number" placeholder="%" min="0" max="100">%
    `;
    rarityInputs.appendChild(div);
}

// ガチャロジック
function startGacha() {
    const rarityInputs = document.querySelectorAll("#rarityInputs .rarity-input");
    const rarities = [];
    let totalProbability = 0;

    // レアリティ設定を取得
    rarityInputs.forEach((inputDiv) => {
        const rarityName = inputDiv.querySelector("input[type='text']").value;
        const probability = parseFloat(inputDiv.querySelector("input[type='number']").value);
        if (rarityName && probability > 0) {
            rarities.push({ rarityName, probability });
            totalProbability += probability;
        }
    });

    if (totalProbability !== 100) {
        alert("確率の合計は100%にしてください。");
        return;
    }

    // ランダムにレアリティを選択
    const randomValue = Math.random() * 100;
    let accumulatedProbability = 0;
    let chosenRarity = null;

    for (const rarity of rarities) {
        accumulatedProbability += rarity.probability;
        if (randomValue < accumulatedProbability) {
            chosenRarity = rarity.rarityName;
            break;
        }
    }

    // 選択されたレアリティに基づいて画像を選ぶ
    const filteredImages = imageList.filter(img => img.rarity === chosenRarity);
    if (filteredImages.length === 0) {
        alert("該当するレアリティの画像がありません。");
        return;
    }
    const randomImage = filteredImages[Math.floor(Math.random() * filteredImages.length)];
    const resultDiv = document.getElementById("gachaResult");
    resultDiv.classList.add("result-display");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
        <p>レアリティ: ${chosenRarity}</p>
        <img src="${URL.createObjectURL(randomImage.file)}" alt="ガチャ結果">
    `;

    // 音楽を再生
    const audio = document.getElementById("audioPreview");
    if (audio.src) {
        audio.play();
    }
}
