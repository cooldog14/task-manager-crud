## Membre A : Interface Utilisateur (Frontend)
**Fichier à modifier :** `index.html`
**Ta mission :** Ajouter le panneau de "Filtres Avancés" dans l'interface.

1. Ouvre `index.html`.
2. Trouve la `<div class="filters">` (ou la zone de recherche).
3. Ajoute ce code HTML :

```html
<section class="advanced-filters-panel" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6;">
    <h3>Filtres Avancés</h3>
    <div class="filter-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
        <div class="form-group">
            <label>Mots clés</label>
            <input type="text" id="filter-search" placeholder="Rechercher..." class="form-control">
        </div>
        <div class="form-group">
            <label>Priorité</label>
            <select id="filter-priority" class="form-control">
                <option value="">Toutes</option>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
            </select>
        </div>
        <div class="form-group">
            <label>Date</label>
            <select id="filter-date" class="form-control">
                <option value="">Indifférent</option>
                <option value="today">Aujourd'hui</option>
                <option value="overdue">En retard</option>
            </select>
        </div>
    </div>
    <div style="margin-top: 10px;">
        <button id="apply-filters-btn" class="btn-primary">Appliquer</button>
    </div>
</section>
```

---

## Membre B : Couverture de Tests (Unit Tests)
**Fichier à créer :** `tests/taskManagerFull.test.js`
**Ta mission :** Nous faire passer la barre des 70% de couverture.

1. Crée le fichier `tests/taskManagerFull.test.js`.
2. Ajoute des tests complets pour `TaskManager` (Ajout, Suppression, Modification).
3. Vérifie avec `npm run test:coverage`.

Exemple de structure de test à utiliser :
```javascript
const TaskManager = require('../js/taskManager');
// Mock localStorage...
// Test addTask...
// Test deleteTask...
```

---

## Membre C : Behavior Driven Development (BDD)
**Dossier de travail :** `tests/steps/`
**Ta mission :** Rendre exécutables les fichiers `.feature` qui sont dans le dossier `features/`.

1. Installe les dépendances (déjà configurées) : `npm install`.
2. Crée un fichier `tests/steps/validation.steps.js`.
3. Utilise `jest-cucumber` pour lier le Gherkin au code JS.

Exemple :
```javascript
const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('./features/task_validation.feature');

defineFeature(feature, test => {
    test('Valid task data passes validation', ({ given, when, then }) => {
        // ... implémentation ...
    });
});
```
4. Lance `npm run test` pour vérifier.

---

## Membre D (Lead) : Intégration & DevOps
**Fichiers :** `js/taskManager.js`, `.gitlab-ci.yml`, `tests/ui.test.js`
**Ma mission :**
1. Connecter les modules JS entre eux (Validators, Filters).
2. Configurer le pipeline CI/CD pour bloquer si la qualité est mauvaise.
3. Ajouter le test Selenium final.
