// Tahta Verileri (Türkiye İlleri)
const boardSpaces = [
    { name: "BAŞLANGIÇ", type: "start" },
    { name: "Muş", type: "city", color: "brown", price: 60, rent: 2, housePrice: 50 },
    { name: "Şans", type: "chance" },
    { name: "Ağrı", type: "city", color: "brown", price: 60, rent: 4, housePrice: 50 },
    { name: "Vergi", type: "tax", amount: 200 },
    { name: "TCDD Doğu", type: "station", price: 200, rent: 25 },
    { name: "Diyarbakır", type: "city", color: "lightblue", price: 100, rent: 6, housePrice: 50 },
    { name: "Şans", type: "chance" },
    { name: "Şanlıurfa", type: "city", color: "lightblue", price: 100, rent: 6, housePrice: 50 },
    { name: "Gaziantep", type: "city", color: "lightblue", price: 120, rent: 8, housePrice: 50 },
    { name: "ZİYARETÇİ / KODES", type: "jail" }, // Index 10
    { name: "Erzurum", type: "city", color: "pink", price: 140, rent: 10, housePrice: 100 },
    { name: "Elektrik", type: "utility", price: 150 },
    { name: "Malatya", type: "city", color: "pink", price: 140, rent: 10, housePrice: 100 },
    { name: "Kayseri", type: "city", color: "pink", price: 160, rent: 12, housePrice: 100 },
    { name: "TCDD Güney", type: "station", price: 200, rent: 25 },
    { name: "Adana", type: "city", color: "orange", price: 180, rent: 14, housePrice: 100 },
    { name: "Şans", type: "chance" },
    { name: "Mersin", type: "city", color: "orange", price: 180, rent: 14, housePrice: 100 },
    { name: "Antalya", type: "city", color: "orange", price: 200, rent: 16, housePrice: 100 },
    { name: "ÜCRETSİZ OTOPARK", type: "parking" }, // Index 20
    { name: "Konya", type: "city", color: "red", price: 220, rent: 18, housePrice: 150 },
    { name: "Şans", type: "chance" },
    { name: "Eskişehir", type: "city", color: "red", price: 220, rent: 18, housePrice: 150 },
    { name: "Bursa", type: "city", color: "red", price: 240, rent: 20, housePrice: 150 },
    { name: "TCDD Kuzey", type: "station", price: 200, rent: 25 },
    { name: "Samsun", type: "city", color: "yellow", price: 260, rent: 22, housePrice: 150 },
    { name: "Trabzon", type: "city", color: "yellow", price: 260, rent: 22, housePrice: 150 },
    { name: "Su İşleri", type: "utility", price: 150 },
    { name: "Rize", type: "city", color: "yellow", price: 280, rent: 24, housePrice: 150 },
    { name: "KODESE GİT", type: "gotojail" }, // Index 30
    { name: "İzmit", type: "city", color: "green", price: 300, rent: 26, housePrice: 200 },
    { name: "İzmir", type: "city", color: "green", price: 300, rent: 26, housePrice: 200 },
    { name: "Şans", type: "chance" },
    { name: "Muğla", type: "city", color: "green", price: 320, rent: 28, housePrice: 200 },
    { name: "TCDD Batı", type: "station", price: 200, rent: 25 },
    { name: "Şans", type: "chance" },
    { name: "Ankara", type: "city", color: "darkblue", price: 350, rent: 35, housePrice: 200 },
    { name: "Lüks Vergisi", type: "tax", amount: 100 },
    { name: "İstanbul", type: "city", color: "darkblue", price: 400, rent: 50, housePrice: 200 }
];

// Emlak başlangıç durumları
const properties = {};
boardSpaces.forEach((space, i) => {
    if(space.type === "city" || space.type === "station" || space.type === "utility") {
        properties[i] = { owner: null, houses: 0, hotel: false };
    }
});

// 4 Oyuncu
const players = [
    { id: 0, name: "Oyuncu 1", money: 1500, pos: 0, inJail: false, jailTurns: 0, cssClass: "p1" },
    { id: 1, name: "Oyuncu 2", money: 1500, pos: 0, inJail: false, jailTurns: 0, cssClass: "p2" },
    { id: 2, name: "Oyuncu 3", money: 1500, pos: 0, inJail: false, jailTurns: 0, cssClass: "p3" },
    { id: 3, name: "Oyuncu 4", money: 1500, pos: 0, inJail: false, jailTurns: 0, cssClass: "p4" }
];

let turn = 0;
let diceRolled = false;

// Tahtayı Çizme (11x11 Grid Düzeni)
function createBoard() {
    const board = document.getElementById("board");
    boardSpaces.forEach((space, i) => {
        const div = document.createElement("div");
        div.className = "space";
        div.id = `space-${i}`;

        // Grid Pozisyonlarını Ayarlama (Monopoly Karesi)
        if(i >= 0 && i <= 10) { div.style.gridRow = "11"; div.style.gridColumn = (11 - i).toString(); } // Alt
        else if (i >= 11 && i <= 19) { div.style.gridColumn = "1"; div.style.gridRow = (11 - (i - 10)).toString(); } // Sol
        else if (i >= 20 && i <= 30) { div.style.gridRow = "1"; div.style.gridColumn = (i - 19).toString(); } // Üst
        else if (i >= 31 && i <= 39) { div.style.gridColumn = "11"; div.style.gridRow = (i - 29).toString(); } // Sağ

        let html = "";
        if(space.color) html += `<div class="color-bar" style="background-color: ${space.color};"></div>`;
        html += `<div class="name">${space.name}</div>`;
        if(space.price) html += `<div class="price">${space.price}₺</div>`;
        
        html += `<div class="buildings" id="build-${i}"></div>`;
        html += `<div class="players-on-space" id="pos-${i}"></div>`;
        div.innerHTML = html;
        board.appendChild(div);
    });
    updateBoard();
}

function updateBoard() {
    // Piyonları temizle
    for(let i=0; i<40; i++) document.getElementById(`pos-${i}`).innerHTML = "";
    // Piyonları yerleştir
    players.forEach(p => {
        const token = document.createElement("div");
        token.className = `token ${p.cssClass}`;
        document.getElementById(`pos-${p.pos}`).appendChild(token);
    });
    
    // Evleri / Otelleri Güncelle
    for (let i in properties) {
        const buildDiv = document.getElementById(`build-${i}`);
        buildDiv.innerHTML = "";
        if(properties[i].hotel) {
            buildDiv.innerHTML = `<div class="hotel"></div>`; // Kırmızı Otel
        } else {
            for(let h=0; h<properties[i].houses; h++) {
                buildDiv.innerHTML += `<div class="house"></div>`; // Siyah Ev
            }
        }
    }
}

function updateUI() {
    for(let i=0; i<4; i++) {
        document.getElementById(`p${i}-money`).innerText = players[i].money;
        document.getElementById(`p${i}-card`).classList.remove("active");
    }
    document.getElementById(`p${turn}-card`).classList.add("active");
    document.getElementById("turn-indicator").innerText = `Sıra: ${players[turn].name}`;
}

function msg(text) {
    document.getElementById("action-message").innerText = text;
}

function rollDice() {
    if (diceRolled) return;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    document.getElementById("dice-result").innerText = `Zar: ${d1} + ${d2} = ${d1+d2}`;
    
    let p = players[turn];

    if (p.inJail) {
        if (d1 === d2) {
            msg("Çift attın! Kodesten çıktın.");
            p.inJail = false;
            p.jailTurns = 0;
        } else {
            p.jailTurns++;
            if(p.jailTurns >= 3) {
                p.money -= 50;
                msg("3 tur yattın, 50₺ ödeyip kodesten çıktın.");
                p.inJail = false;
                p.jailTurns = 0;
            } else {
                msg("Çift atamadın, kodeste kaldın.");
                diceRolled = true;
                document.getElementById("btn-end").style.display = "inline-block";
                return;
            }
        }
    }

    p.pos += (d1 + d2);
    if (p.pos >= 40) {
        p.pos -= 40;
        p.money += 200; // Başlangıçtan geçiş
    }
    
    updateBoard();
    diceRolled = true;
    checkSpace(p);
}

function checkSpace(p) {
    const space = boardSpaces[p.pos];
    const prop = properties[p.pos];
    
    document.getElementById("btn-roll").style.display = "none";
    document.getElementById("btn-end").style.display = "inline-block";
    document.getElementById("btn-buy").style.display = "none";
    document.getElementById("btn-build").style.display = "none";

    msg(`${space.name} hanesine geldin.`);

    if (space.type === "gotojail") {
        msg("Polis! Doğru Kodese!");
        p.pos = 10; // Kodes indexi
        p.inJail = true;
        updateBoard();
    } else if (space.type === "tax") {
        p.money -= space.amount;
        msg(`Vergi ödedin: ${space.amount}₺`);
    } else if (prop) {
        if (prop.owner === null) {
            if (p.money >= space.price) {
                msg(`Bu mülk sahipsiz. Fiyatı: ${space.price}₺`);
                document.getElementById("btn-buy").style.display = "inline-block";
            } else {
                msg("Bu mülkü alacak paran yok.");
            }
        } else if (prop.owner !== p.id) {
            // Kira hesaplama (Ev/Otel varsayımı basitçe katlanarak yapıldı)
            let rent = space.rent;
            if(prop.hotel) rent *= 10;
            else if(prop.houses > 0) rent *= (prop.houses * 2);

            p.money -= rent;
            players[prop.owner].money += rent;
            msg(`Eyvah! ${players[prop.owner].name}'e ${rent}₺ kira ödedin.`);
        } else if (prop.owner === p.id && space.type === "city") {
            if (!prop.hotel) {
                msg(`Kendi mülkündesin. Ev/Otel dikebilirsin (Maliyet: ${space.housePrice}₺).`);
                document.getElementById("btn-build").style.display = "inline-block";
            }
        }
    }
    updateUI();
}

function buyProperty() {
    let p = players[turn];
    let space = boardSpaces[p.pos];
    p.money -= space.price;
    properties[p.pos].owner = p.id;
    msg(`Tebrikler! ${space.name} artık senin.`);
    document.getElementById("btn-buy").style.display = "none";
    
    // Tapu rengini oyuncu rengiyle çevrele
    document.getElementById(`space-${p.pos}`).style.borderColor = 
        p.cssClass === "p1" ? "red" : p.cssClass === "p2" ? "blue" : p.cssClass === "p3" ? "green" : "yellow";
    
    updateUI();
}

function buildHouse() {
    let p = players[turn];
    let space = boardSpaces[p.pos];
    let prop = properties[p.pos];

    if (p.money >= space.housePrice) {
        p.money -= space.housePrice;
        if (prop.houses < 4) {
            prop.houses++;
            msg(`Siyah bir ev diktin! (Toplam Ev: ${prop.houses})`);
        } else if (prop.houses === 4 && !prop.hotel) {
            prop.houses = 0;
            prop.hotel = true;
            msg(`Tebrikler, Kırmızı bir OTEL diktin!`);
            document.getElementById("btn-build").style.display = "none";
        }
        updateBoard();
        updateUI();
    } else {
        msg("Ev yapmak için paran yetersiz!");
    }
}

function endTurn() {
    document.getElementById("btn-end").style.display = "none";
    document.getElementById("btn-buy").style.display = "none";
    document.getElementById("btn-build").style.display = "none";
    document.getElementById("btn-roll").style.display = "inline-block";
    
    turn = (turn + 1) % 4;
    diceRolled = false;
    document.getElementById("dice-result").innerText = `Zar: -`;
    msg(`${players[turn].name}, sıra sende!`);
    updateUI();
}

// Oyunu Başlat
createBoard();
updateUI();
