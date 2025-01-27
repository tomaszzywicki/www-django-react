# Projekt Django + React

## Wymagania
- Python 3.10+
- Node.js 16+
- (Opcjonalnie) wirtualne środowisko Pythona (np. `venv`)

## Szybki start

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/tomaszzywicki/www-django-react
cd twoje-repo

```
### 2. Backend (Django)
1. (Opcjonalnie) Utwórz i aktywuj wirtualne środowisko:
```bash
python -m venv env
# Windows:
env\Scripts\activate
# macOS/Linux:
source env/bin/activate
```
2. Zainstaluj zależności:
```bash
pip install -r requirements.txt
```
3. Przejdź do folderu backend i wykonaj migracje:
```bash
cd backend
python manage.py migrate
```

4. Uruchom serwer developerski
```bash
python manage.py runserver
```

5. Aplikacja Django będzie słuchać na porcie http://127.0.0.1:8000/

### 3. Frontend (React)
1. Przejdź do folderu frontend:
```bash
cd ../frontend
```

2. Zainstaluj zależności Node.js:
```bash
npm install
```

3. Uruchom projekt
```bash
npm run dev
```

4. Projekt będzie dostępny na http://127.0.0.1:5173/ (lub innym wskazanym porcie)

### 4. Używanie aplikacji
W przeglądarce otwórz:
- Frontend: http://127.0.0.1:5173/
- Backend API: http://127.0.0.1:8000/
