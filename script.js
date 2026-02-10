const SUPABASE_URL = 'https://ogeqsxkqjfhaecpuinjs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sQ0afUndi8LGkSYVtHD2yQ_zK_8LWsN';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    afficherPlats();
    document.getElementById('btnAjouter').addEventListener('click', ajouterPlat);
});

async function ajouterPlat() {
    const nom = document.getElementById('nomPlat').value;
    const ing = document.getElementById('ingredients').value;

    if (!nom || !ing) return alert("Remplis tout !");

    // Envoi à la base de données en ligne
    const { error } = await supabase
        .from('plats')
        .insert([{ nom: nom, ingredients: ing }]);

    if (error) console.log(error);
    else {
        document.getElementById('nomPlat').value = "";
        document.getElementById('ingredients').value = "";
        afficherPlats();
    }
}

async function afficherPlats() {
    const { data: plats, error } = await supabase
        .from('plats')
        .select('*')
        .order('id', { ascending: false });

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
    await supabase.from('plats').delete().eq('id', id);
    afficherPlats();
};