# EPG PREGLEDNIK CHECKER

Lokalni EPG preglednik za XMLTV liste. Podržava učitavanje `.xml` i `.xml.gz`
fajlova sa računara, kao i preuzimanje liste preko URL adrese.

## Mogućnosti

- pregled svih kanala u EPG listi
- broj programa i trajanje EPG-a po kanalu
- pretraga i sortiranje kanala
- dashboard sa rasporedom odabranog kanala
- otvaranje rasporeda klikom na naziv kanala ili dugme „Preglednik“
- status pokrivenosti: „Dobar pokrivač“ za 3 ili više dana i „Kratak EPG“ za manje
- prikaz početka, završetka, naziva i opisa emisije
- učitavanje URL-a preko lokalnog proxy servera radi izbjegavanja CORS blokade

## Pokretanje na Windowsu

1. Potreban je instaliran [Node.js](https://nodejs.org/).
2. Pokrenite `Pokreni EPG Checker.bat`.
3. Aplikacija će se otvoriti na `http://127.0.0.1:18765`.

Podaci se obrađuju lokalno. Fajlovi koje učitate ne šalju se na druge servere.
