const SUPABASE_URL = 'https://ogeqsxkqjfhaecpuinjs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sQ0afUndi8LGkSYVtHD2yQ_zK_8LWsN';

// On déclare la variable UNE SEULE FOIS
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    afficherPlats();
    document.getElementById('btnAjouter').addEventListener('click', ajouterPlat);
});

async function ajouterPlat() {
    const nomInput = document.getElementById('nomPlat');
    const ingInput = document.getElementById('ingredients');
    const nom = nomInput.value.trim();
    const ing = ingInput.value.trim();

    if (!nom || !ing) {
        alert("Remplis tout !");
        return;
    }

    const { error } = await supabase
        .from('Plats')
        .insert([{ nom: nom, ingredients: ing }]);

    if (error) {
        console.error("Erreur d'ajout:", error);
        alert("Erreur : " + error.message);
    } else {
        nomInput.value = "";
        ingInput.value = "";
        afficherPlats();
    }
}

async function afficherPlats() {
    const { data: plats, error } = await supabase
        .from('Plats')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Erreur de lecture:", error);
        return;
    }

    const liste = document.getElementById('listePlats');
    liste.innerHTML = "";

    plats.forEach((p) => {
        const platDiv = document.createElement('div');
        platDiv.className = 'plat-item';
        platDiv.innerHTML = `
            <span class="delete-btn" onclick="supprimerPlat(${p.id})">✕</span>
            <div class="plat-name">${p.nom}</div>
            <div class="ingredients">🛒 ${p.ingredients}</div>
        `;
        liste.appendChild(platDiv);
    });
}

window.supprimerPlat = async function(id) {
    const { error } = await supabase.from('Plats').delete().eq('id', id);
    if (!error) {
        afficherPlats();
    }
};
