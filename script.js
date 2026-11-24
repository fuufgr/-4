
const skillInput = document.getElementById("skill-input");
const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const skillsList = document.getElementById("skills-list");
const counterEl = document.getElementById("counter");
const statusMessage = document.getElementById("status-message");
const errorMessage = document.getElementById("error-message");



let totalSkills = 0;


function updateUI() {

    counterEl.textContent = totalSkills;

    if (totalSkills === 0) {

        statusMessage.textContent = "სია ჯერ ცარიელია";
        statusMessage.className = "text-sm text-slate-400 font-medium";

    } else {

        statusMessage.textContent =
            `თქვენ სწავლობთ ${totalSkills} უნარს! 🚀`;

        statusMessage.className =
            "text-sm text-emerald-400 font-medium";

    }
}


function addSkill() {

    const text = skillInput.value.trim();

    if (text === "") {

        errorMessage.classList.remove("hidden");
        return;

    }

    errorMessage.classList.add("hidden");
    const li = document.createElement("li");

    li.className =
        "flex items-center justify-between bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 hover:border-sky-500/50 transition-all duration-200";

    li.innerHTML = `
    <span class="text-sm text-slate-200 font-medium flex items-center gap-2">
      <span class="text-sky-400">✨</span>
      ${text}
    </span>

    <button class="delete-btn text-slate-400 hover:text-rose-400 p-1 rounded-lg transition" title="წაშლა">
      🗑️
    </button>
  `;
    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {

        li.remove();

        totalSkills--;
        updateUI();

    });


    skillsList.appendChild(li);


    totalSkills++;
    updateUI();

    skillInput.value = "";
    skillInput.focus();

}
function clearAll() {

    skillsList.innerHTML = "";

    totalSkills = 0;
    updateUI();
    errorMessage.classList.add("hidden");

}
addBtn.addEventListener("click", addSkill);

skillInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addSkill();
    }

});

clearBtn.addEventListener("click", clearAll);
updateUI();
