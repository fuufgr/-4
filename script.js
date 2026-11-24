// ვიღებთ HTML ელემენტებს ID-ების და კლასების მიხედვით, რომ JS-ით ვმართოთ
const searchInput = document.getElementById("search-input");       // ძებნის ველი
const searchBtn = document.getElementById("search-btn");           // ძებნის ღილაკი
const categoryBtns = document.querySelectorAll(".category-btn");   // კატეგორიის ყველა ღილაკი
const factCategory = document.getElementById("fact-category");     // ბარათზე კატეგორიის ტექსტი
const statusMsg = document.getElementById("status-msg");           // სტატუსის/შეტყობინების ადგილი
const factTitle = document.getElementById("fact-title");           // ფაქტის სათაური
const factText = document.getElementById("fact-text");             // ფაქტის ტექსტი
const newFactBtn = document.getElementById("new-fact-btn");        // „ახალი ფაქტი“ ღილაკი
const likeBtn = document.getElementById("like-btn");               // „მოწონება“ ღილაკი
const shareBtn = document.getElementById("share-btn");             // „გაზიარება“ ღილაკი
const favoritesCount = document.getElementById("favorites-count"); // ფავორიტების რაოდენობა
const emptyFavorites = document.getElementById("empty-favorites"); // ცარიელი სიის ტექსტი
const favoritesList = document.getElementById("favorites-list");   // ფავორიტების სია (ul)

let currentCategory = "Space"; // მიმდინარე არჩეული კატეგორია (საწყისი: Space)
let currentFact = null;        // აქ შევინახავთ ეკრანზე ნაჩვენებ მიმდინარე ფაქტს
const favorites = [];          // მასივი მოწონებული ფაქტების შესანახად

// ასინქრონული ფუნქცია, რომელიც Wikipedia-ს უფასო API-დან წამოიღებს ფაქტს
async function getFact(query) {
    statusMsg.textContent = "იტვირთება..."; // მომხმარებელს ვაჩვენებთ ჩატვირთვის სტატუსს

    // ვქმნით API-ს მისამართს: origin=* საჭიროა ბრაუზერში CORS შეცდომის ასარიდებლად
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=15&prop=extracts&exintro=1&explaintext=1&exsentences=3&format=json&origin=*`;

    try {
        const response = await fetch(url); // ვაგზავნით მოთხოვნას API-ზე და ველოდებით პასუხს

        if (!response.ok) { // ვამოწმებთ, წარმატებულია თუ არა სერვერის პასუხი (status 200)
            throw new Error("სერვერთან კავშირი ვერ დამყარდა");
        }

        const data = await response.json(); // გარდავქმნით მიღებულ პასუხს JS ობიექტად (JSON)
        const pages = Object.values(data.query?.pages || {}).filter(p => p.extract); // ვიღებთ მხოლოდ იმ შედეგებს, რომლებსაც ტექსტი აქვთ

        if (pages.length === 0) { // თუ ამ სიტყვაზე არაფერი მოიძებნა, ვისვრით შეცდომას
            throw new Error("ფაქტი ვერ მოიძებნა, სცადე სხვა სიტყვა");
        }

        // ვირჩევთ ერთ შემთხვევით ფაქტს ნაპოვნი შედეგებიდან
        const randomFact = pages[Math.floor(Math.random() * pages.length)];

        currentFact = { title: randomFact.title, text: randomFact.extract }; // ვინახავთ მიმდინარე ფაქტს
        factTitle.textContent = currentFact.title;       // ეკრანზე ვწერთ ფაქტის სათაურს
        factText.textContent = currentFact.text;         // ეკრანზე ვწერთ ფაქტის ტექსტს
        factCategory.textContent = query;                // ვაჩვენებთ მიმდინარე თემას/კატეგორიას
        statusMsg.textContent = "";                      // ვასუფთავებთ სტატუსის ტექსტს

    } catch (error) {
        // თუ try ბლოკში რამე შეცდომა მოხდა (მაგ. ინტერნეტი არ არის), აქ დავიჭერთ
        factTitle.textContent = "შეცდომა!";
        factText.textContent = error.message; // ეკრანზე გამოგვაქვს შეცდომის ტექსტი
        statusMsg.textContent = "ვერ ჩაიტვირთა";
    }
}

// ფუნქცია, რომელიც ფავორიტების სიას ხატავს ეკრანზე DOM მანიპულაციით
function renderFavorites() {
    favoritesList.innerHTML = ""; // თავიდან ვასუფთავებთ სიას, რომ ელემენტები არ გამეორდეს
    favoritesCount.textContent = favorites.length; // ვაახლებთ მოწონებების მთვლელს
    emptyFavorites.style.display = favorites.length === 0 ? "block" : "none"; // ვმალავთ ცარიელ ტექსტს, თუ ფავორიტი გვაქვს

    // გადავუვლით favorites მასივს და თითოეული ფაქტისთვის ვქმნით <li> ელემენტს
    favorites.forEach((item, index) => {
        const li = document.createElement("li"); // ვქმნით ახალ სიის ელემენტს
        li.className = "bg-slate-900/70 border border-slate-700 rounded-xl p-3 flex justify-between items-start gap-3";

        const textWrap = document.createElement("div"); // კონტეინერი სათაურისა და ტექსტისთვის
        const titleEl = document.createElement("h4");   // ფავორიტი ფაქტის სათაური
        titleEl.className = "text-sm font-semibold text-indigo-300 mb-1";
        titleEl.textContent = item.title;               // ვსვამთ სათაურს textContent-ით

        const bodyEl = document.createElement("p");     // ფავორიტი ფაქტის ტექსტი
        bodyEl.className = "text-xs text-slate-300";
        bodyEl.textContent = item.text;                 // ვსვამთ ტექსტს textContent-ით

        const removeBtn = document.createElement("button"); // წაშლის ღილაკი
        removeBtn.className = "text-xs text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer";
        removeBtn.textContent = "წაშლა";
        removeBtn.addEventListener("click", () => {     // წაშლაზე დაჭერისას ვშლით მასივიდან და თავიდან ვხატავთ
            favorites.splice(index, 1);
            renderFavorites();
        });

        textWrap.appendChild(titleEl); // სათაურს ვსვამთ div-ში
        textWrap.appendChild(bodyEl);  // ტექსტს ვსვამთ div-ში
        li.appendChild(textWrap);      // div-ს ვსვამთ li-ში
        li.appendChild(removeBtn);     // წაშლის ღილაკს ვსვამთ li-ში
        favoritesList.appendChild(li); // მზა li-ს ვამატებთ მთავარ სიაში
    });
}

// „ახალი ფაქტი“ ღილაკზე დაჭერისას მოგვაქვს ახალი ფაქტი (საძიებო სიტყვით ან არჩეული კატეგორიით)
newFactBtn.addEventListener("click", () => {
    getFact(searchInput.value.trim() || currentCategory);
});

// ძებნის ღილაკზე დაჭერისას ვეძებთ მომხმარებლის ჩაწერილი სიტყვით
searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim(); // ვშლით ზედმეტ ჰარებს (space-ებს)
    if (keyword) getFact(keyword);            // თუ ველი ცარიელი არაა, ვიძახებთ API-ს
});

// Enter კლავიშზე დაჭერაც რომ მუშაობდეს ძებნის ველში
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchBtn.click();
});

// კატეგორიის ღილაკებზე ვამატებთ click მსმენელებს
categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentCategory = btn.dataset.category; // ვიღებთ ღილაკის data-category მნიშვნელობას
        searchInput.value = "";                 // ვასუფთავებთ ძებნის ველს

        // ყველა ღილაკს ვუცვლით ფერს, რომ მხოლოდ არჩეული იყოს მონიშნული
        categoryBtns.forEach(b => b.classList.remove("bg-indigo-600", "text-white"));
        categoryBtns.forEach(b => b.classList.add("bg-slate-800", "text-slate-300"));
        btn.classList.remove("bg-slate-800", "text-slate-300");
        btn.classList.add("bg-indigo-600", "text-white");

        getFact(currentCategory); // მოგვაქვს ახალი ფაქტი არჩეული კატეგორიიდან
    });
});

// Like ღილაკზე დაჭერისას ვამატებთ ფაქტს ფავორიტებში (თუ უკვე დამატებული არ არის)
likeBtn.addEventListener("click", () => {
    if (!currentFact) return; // თუ ფაქტი ჯერ არ ჩატვირთულა, არაფერს ვაკეთებთ
    const exists = favorites.some(f => f.title === currentFact.title); // ვამოწმებთ, უკვე ხომ არ გვაქვს

    if (!exists) {
        favorites.push(currentFact); // ვამატებთ ფავორიტების მასივში
        renderFavorites();           // ვაახლებთ ფავორიტების სიას ეკრანზე
        statusMsg.textContent = "დაემატა ფავორიტებში ❤️";
    } else {
        statusMsg.textContent = "უკვე ფავორიტებშია";
    }
});

// Share ღილაკზე დაჭერისას ვაკოპირებთ ფაქტის ტექსტს გაზიარებისთვის
shareBtn.addEventListener("click", async () => {
    if (!currentFact) return;
    try {
        await navigator.clipboard.writeText(`${currentFact.title} — ${currentFact.text}`); // კოპირება ბუფერში
        statusMsg.textContent = "ტექსტი დაკოპირდა გასაზიარებლად! 🔗";
    } catch {
        statusMsg.textContent = "კოპირება ვერ მოხერხდა";
    }
});

// გვერდის ჩატვირთვისთანავე ავტომატურად წამოვიღოთ პირველი ფაქტი
getFact(currentCategory);
