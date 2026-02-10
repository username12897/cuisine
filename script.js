const SUPABASE_URL = 'https://ogeqsxkqjfhaecpuinjs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sQ0afUndi8LGkSYVtHD2yQ_zK_8LWsN';
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
    if (!nom || !ing) return alert("Remplis tout !");

    const { error } = await supabase.from('Plats').insert([{ nom: nom, ingredients: ing }]);
    if (error) alert("Erreur : " + error.message);
    else {
        nomInput.value = "";
        ingInput.value = "";
        afficherPlats();
    }
}

async function afficherPlats() {
    const { data: plats, error } = await supabase.from('Plats').select('*').order('id', { ascending: false });
    if (error) return;
    const liste = document.getElementById('listePlats');
    liste.innerHTML = "";
    plats.forEach((p) => {
        liste.innerHTML += `
            <div class="plat-item">
                <span class="delete-btn" onclick="supprimerPlat(${p.id})">✕</span>
                <div class="plat-name">${p.nom}</div>
                <div class="ingredients">🛒 ${p.ingredients}</div>
            </div>`;
    });
}

window.supprimerPlat = async function(id) {
    await supabase.from('Plats').delete().eq('id', id);
    afficherPlats();
};