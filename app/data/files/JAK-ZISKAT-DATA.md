# Jak získat data

Tady zkusím sepsat kde a jak jsem získal všechna potřebná data pro vládní rozpočty.
Cílem je, abych měl zadokumentování kde a jak získat data pro příští verze rozpočtu a plány.

## Obecně

Každý rozpočet se skládá z třech souborů.

- expenses.csv
- incomes.csv
  - Obsahují data z ministerstva financí dostpné v aplikaci Monitor státní pokladny.
    K tomu navíc jsou navíc obohaceny o data zdravotních pojišťoven.
- income_types.csv
  - Tohle je ručně vytvořený soubor z různých zdrojů obsahující jak se jednotlivé typy státních příjmů promítnou do osobních příjmů uživatele.

K tomu jsou potřeba ještě soubory společné pro všechny rozpočty. Ale někdy je potřeba je taky updatovat, pokud se změní.

- inflation.csv
  - ČSU pro realnou inflaci za uběhlá období: https://csu.gov.cz/mira_inflace
  - ČNB pro budouci odhady: https://www.cnb.cz/cs/menova-politika/prognoza/
- offices_table.csv
- sectors_table.csv
- types_table.csv
  - Jsou taky stažené z Ministerstva financí.

## Výdaje (expenses.csv)

1. https://monitor.statnipokladna.gov.cz/
1. Analytická část
1. vyberte datovou sadu: Příprava rozpočtu - výdaje
   1. pozn. Příjmy, výdaje a financování státu - nelze použít protože z nějakého důvodu neobsahují dimenzi Finanční místo (kód). Je to škoda, protože takhle nemáme přístup k rozpočtu po změnách.
1. Zafiltrujte Rok (kód) a běh (název)
   - Oboje musí být ze stejného rozku, jinak neuvidíte žádná data
1. V sekci "Sloupce" ponechte pouze sloupec Připravovaný rozpočet
1. Do řádků vložte v tomto pořadí (ostatní smažte)
   1. Paragraf (kód)
   1. Položka (kód)
   1. Finanční místo (kód)
1. Stáhněte excel soubor (ikona šipky dolů s nápisem XLS)
1. Zkonvertujte XLS do CSV
   - Hlavička csv musí být sector_id,type_id,office_id,amount
   - všechno jsou čísla
   - Formát čísel bez desetiných míst a bez mezer, teček atd. pouze čísla
   - oddělovač sloupců je čárka
1. CSV Soubor vložte do složky /data/files/název-rozpočtu/expenses.csv

## Příjmy (incomes.csv)

1. Postupne je úplně stejný jako u výdajů kromě následujícího
   - vyberte datovou sadu: Příprava rozpočtu - příjmy
   - Do řádků vyberte pozuze Položku a Finanční místo (nevybírejte Paragraf)
   - Sloupečky v CSV tedy budou pouze type_id,office_id,amount
1. CSV Soubor vložte do složky /data/files/název-rozpočtu/incomes.csv

## Zdravotní pojištění (expenses.csv a incomes.csv)

Toto je potřeba zopakovat pro všech 7 pojišťoven:

- 111,Všeobecná zdravotní pojišťovna
- 205,Česká průmyslová zdravotní pojišťovna
- 207,Oborová zdravotní pojišťovna
- 213,"RBP, zdravotní pojišťovna"
- 201,Vojenská zdravotní pojišťovna ČR
- 209,Zaměstnanecká pojišťovna Škoda
- 211,Zdravotní pojišťovna ministerstva vnitra ČR

1. Stáhnout si tzv. Zdravotně pojistný plán na potřebný rok
   - VZP: https://www.vzp.cz/o-nas/dokumenty/zdravotne-pojistne-plany
   - CPZP: https://www.cpzp.cz/clanek/50-0-Ekonomicke-informace.html
   - OZP: https://www.ozp.cz/tiskove-centrum/pojistne-plany
   - RBP: https://www.rbp213.cz/cs/o-nas/rbp-informuje/zdravotne-pojistny-plan/a-384/
   - VoZP: https://www.vozp.cz/zdravotne-pojistny-plan
   - ZPMV: https://www.zpmvcr.cz/o-nas/dokumenty/zdravotne-pojistne-plany
   - ZPS: https://www.zpskoda.cz/o-nas#zpp
2. V dokumentu najděte dvě tabulky
   - Základní fond zdravotního pojištění (ZFZP)
   - Náklady na zdravotní služby dle jednotlivých segmentů
3. Zkonvertujte pdf tabulky do spreadsheetu
   - Tohle je docela funkční tool: https://www.ilovepdf.com/pdf_to_excel
4. Zkopírujte si šablonu pro výpočet
   - šablona: https://docs.google.com/spreadsheets/d/1gua8HJ8-pTe7Pvng-TwjQv_yyU2VTxoRu2wZNbx6v0k/edit?usp=sharing
5. Vložte data za pojišťovny:
   - vypňtě data do sheetů pojmenovaných podle zkratky pojišťovny
   - Je to docela manuální práce, ale nevim jak to lip automatizovat
   - šablona vám spočítá přijmy do sheetu Příjmy a výdaje do Výdaje
   - Sheet Překlad příjmů/výdajů obsahuje překladovou tabulku podle jakých poměrů přepočítat data z Pojistného plánu do rozpočtu. To můžeme chtít upravit, pokud se například změní výše zdravotního pojištění.
6. Data z sheetu Příjmy přidejte nakonec souboru incomes.csv
7. Data z sheetu Výdaje přidejte nakonec souboru expenses.csv

## Typy příjmů (income_types.csv)

- Jde o tabulku, která říká jak přepočíst typy příjmů státu na to, kolik uživatel státu měsíčně zaplatí
- Celá je tvořena manuálně researchem z internetu
- Musí se upravit, pokud se změní zákony o daních/poplatcích atd. např se změní DPH.
- Data se používají v souboru [../personalIncome/personalIncomeCalc.ts](../personalIncome/personalIncomeCalc.ts)
- Kód je složitý a zasloužil by uklidit, ale dá se z něho vyčíst jak se s tou tabulkou pracuje

## Čísledník/Dimenze Paragrafů/Odvětví/Sektors (sectors_table.csv)

Pozn. Všechno je to název toho stejného

TBD: Tohle nebude fungovat, potřebujeme trošku jinou strukturu, kde na každém řádku jsou i nadřazené jednotky

1. https://monitor.statnipokladna.gov.cz/datovy-katalog/ciselniky
2. Vyhledejte Paragraf (čtyřmístný kód)
3. Soubor stáhněte
4. ponechejte pouze sloupce: id,name
5. Soubor zkonvertujte do csv a uložte jako dimensions/sectors_table.csv

## Čísledník/Dimenze Typů/Druhů/Položek (types_table.csv)

Pozn. Všechno je to název toho stejného

TBD: Tohle nebude fungovat, potřebujeme trošku jinou strukturu, kde na každém řádku jsou i nadřazené jednotky

1. https://monitor.statnipokladna.gov.cz/datovy-katalog/ciselniky
2. Vyhledejte Rozpočtová položka
3. stáhněte
4. ponechejte pouze sloupce: id,name
5. přidejte manuálně položku 1639,Ostatní příjmy zdravotních pojišťoven
6. přidejte manuálně položku 5471,Zdravotní péče
7. Soubor zkonvertujte do csv a uložte jako dimensions/types_table.csv

## Čísledník/Dimenze Úřadů/Offices/Finančních míst (offices_table.csv)

Pozn. Všechno je to název toho stejného

1. https://monitor.statnipokladna.gov.cz/datovy-katalog/ciselniky
2. Vyhledejte Finanční místo (kapitoly, OSS)
3. stáhněte
4. ponechejte pouze sloupce: id,name
5. manuáně přidejte zdravotní pojišťovny

```
900,Zdravotní pojišťovny
9000205,Česká průmyslová zdravotní pojišťovna
9000207,Oborová zdravotní pojišťovna
9000213,"RBP, zdravotní pojišťovna"
9000201,Vojenská zdravotní pojišťovna ČR
9000111,Všeobecná zdravotní pojišťovna
9000209,Zaměstnanecká pojišťovna Škoda
9000211,Zdravotní pojišťovna ministerstva vnitra ČR
```

7. Soubor zkonvertujte do csv a uložte jako dimensions/offices_table.csv
