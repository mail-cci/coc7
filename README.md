# coc7

This project is a small experiment to provide a digital assistant for the 7th Edition of *Call of Cthulhu*. The `app.html` page contains a reference guide and early character-creation widgets written with plain HTML, CSS and JavaScript.

## Opening or hosting the app

`app.html` works as a static page. You can simply double click the file or open it in your favourite browser. If you prefer to run a local web server you can execute:

```bash
python3 -m http.server
```

and then visit `http://localhost:8000/app.html`.

## Planned features

- Guided steps for creating a character (rolling characteristics, computing derived attributes and selecting an occupation).
- Export of the filled character sheet to PDF using `hoja_de_personaje_anos20.pdf` as a template.

## Contributing

Feel free to fork the repository and open pull requests. For large changes, please create an issue first so we can discuss the approach.
