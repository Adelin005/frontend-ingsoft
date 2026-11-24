# Portal Universitar

Aplicație web pentru gestionarea parcursului academic al studenților și administrarea cataloagelor universitare.

## Funcționalități principale
- **Autentificare securizată:** Conectare bazată pe CNP și parolă prin Firebase Authentication.
- **Catalog academic:** Vizualizare note pe semestre, calcul automat al mediei ponderate și al numărului de credite (ECTS).
- **Gestiune burse:** Calcul și alocare automată a burselor de merit (prag $\ge 9.50$).
- **Generare adeverințe și foi matricole:** Descărcare automată în format PDF semnat digital.
- **Panou de administrare:** Management studenți, adăugare și editare catalog academic, monitorizare taxe și burse.

## Tehnologii utilizate
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend / Database:** Google Cloud Firestore, Firebase Authentication
- **Documente:** jsPDF

## Rulare proiect
```bash
npm install
npm run dev
```
