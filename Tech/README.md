# S7 - Умный поиск и поддержка

## Описание

Проект включает в себя систему для умного поиска рейсов и поддержки пользователей авиакомпании S7. Система использует различные технологии, включая GPT-4 от OpenAI, SQL, OpenSearch, а также FastAPI для создания RESTful API. Пользователи могут искать рейсы, задавать вопросы и получать ответы через интерфейс веб-приложения или через чат с виртуальным помощником.

## Архитектура

### 1. Frontend:
- **HTML интерфейс**: основной пользовательский интерфейс с формой для поиска рейсов, отображением результатов и чатом поддержки. Включает динамическое обновление через кнопки и формы.  
  Файл: `index.html`
  
- **Streamlit интерфейс**: инструмент для взаимодействия с пользователем в реальном времени, который отправляет запросы на классификацию вопросов и получения решений.  
  Файл: `stream.py`

### 2. Backend:
- **FastAPI**: основной сервер для обработки запросов от фронтенда. Включает несколько эндпоинтов:
  - `/process_query`: обрабатывает запросы пользователя, генерируя SQL-запросы через GPT и выполняя их через подключение к базе данных.
  - `/search`: выполняет поиск по данным с использованием векторных эмбеддингов и классификации с помощью OpenAI.
  - `/get_decision/`: получает решение для пассажира по имени и фамилии, используя данные из CSV-файла.
  - `/classify_question` и `/format_delay_response`: помогают классифицировать вопросы по задержке рейса и формировать ответы для службы поддержки.  
  Файл: `main.py`

### 3. Внешние API:
- **OpenAI GPT-4**: используется для генерации SQL-запросов, поиска релевантных документов и генерации ответов для службы поддержки. Модели OpenAI также используются для классификации вопросов и обработки запросов.  
  Файл: `openai_sql.py`, `opensearch.py`

### 4. База данных:
- **SQL база данных**: подключение к PostgreSQL базе данных для выполнения SQL-запросов, которые генерируются GPT на основе данных пользователя.  
  Файл: `sql_search.py`

### 5. Интеграции с внешними сервисами:
- **Elasticsearch/OpenSearch**: используется для поиска документов и извлечения информации, с использованием векторных эмбеддингов для поиска и оценки релевантности.  
  Файл: `opensearch.py`

### 6. Парсинг:
- **Selenium**: Парсинг с помощью селениум с сайта https://helpcenter.s7.ru и добобработка для загрузки в **OpenSearch**.  

.
├── Desc
│   ├── README.md
│   ├── design_PK.png
│   ├── design_telephone.png
│   ├── Умный поиск схема.png
│   └── Оптимизация схема.png
├── Idea
│   └── README.md
├── Procfile
├── README.md
├── Tech
│   └── README.md
├── app
│   ├── __pycache__
│   ├── logics
│   ├── main.py
│   ├── static
│   └── stream.py
├── dataset_with_3city_routes.csv
├── dist
│   ├── assets
│   └── index.html
├── index.html
├── node_modules
│   ├── @alloc
│   ├── @ampproject
│   ├── @ampproject 2
│   ├── @babel
│   ├── @babel 2
│   ├── @esbuild
│   ├── @isaacs
│   ├── @isaacs 2
│   ├── @jridgewell
│   ├── @jridgewell 2
│   ├── @nodelib
│   ├── @nodelib 2
│   ├── @pkgjs
│   ├── @remix-run
│   ├── @rollup
│   ├── @types
│   ├── @vitejs
│   ├── @vitejs 2
│   ├── ansi-regex
│   ├── ansi-styles
│   ├── any-promise
│   ├── anymatch
│   ├── arg
│   ├── asynckit
│   ├── autoprefixer
│   ├── axios
│   ├── balanced-match
│   ├── binary-extensions
│   ├── brace-expansion
│   ├── braces
│   ├── browserslist
│   ├── call-bind-apply-helpers
│   ├── camelcase-css
│   ├── caniuse-lite
│   ├── chokidar
│   ├── color-convert
│   ├── color-name
│   ├── combined-stream
│   ├── commander
│   ├── convert-source-map
│   ├── cross-spawn
│   ├── cssesc
│   ├── debug
│   ├── delayed-stream
│   ├── didyoumean
│   ├── dlv
│   ├── dunder-proto
│   ├── eastasianwidth
│   ├── electron-to-chromium
│   ├── emoji-regex
│   ├── es-define-property
│   ├── es-errors
│   ├── es-object-atoms
│   ├── es-set-tostringtag
│   ├── esbuild
│   ├── escalade
│   ├── fast-glob
│   ├── fastq
│   ├── fill-range
│   ├── follow-redirects
│   ├── foreground-child
│   ├── form-data
│   ├── fraction.js
│   ├── fsevents
│   ├── function-bind
│   ├── gensync
│   ├── get-intrinsic
│   ├── get-proto
│   ├── glob
│   ├── glob-parent
│   ├── globals
│   ├── gopd
│   ├── has-symbols
│   ├── has-tostringtag
│   ├── hasown
│   ├── is-binary-path
│   ├── is-core-module
│   ├── is-extglob
│   ├── is-fullwidth-code-point
│   ├── is-glob
│   ├── is-number
│   ├── isexe
│   ├── jackspeak
│   ├── jiti
│   ├── js-tokens
│   ├── jsesc
│   ├── json5
│   ├── lilconfig
│   ├── lines-and-columns
│   ├── loose-envify
│   ├── lru-cache
│   ├── math-intrinsics
│   ├── merge2
│   ├── micromatch
│   ├── mime-db
│   ├── mime-types
│   ├── minimatch
│   ├── minipass
│   ├── ms
│   ├── mz
│   ├── nanoid
│   ├── node-releases
│   ├── normalize-path
│   ├── normalize-range
│   ├── object-assign
│   ├── object-hash
│   ├── package-json-from-dist
│   ├── path-key
│   ├── path-parse
│   ├── path-scurry
│   ├── picocolors
│   ├── picomatch
│   ├── pify
│   ├── pirates
│   ├── postcss
│   ├── postcss-import
│   ├── postcss-js
│   ├── postcss-load-config
│   ├── postcss-nested
│   ├── postcss-selector-parser
│   ├── postcss-value-parser
│   ├── proxy-from-env
│   ├── queue-microtask
│   ├── react
│   ├── react-dom
│   ├── react-refresh
│   ├── react-router
│   ├── react-router-dom
│   ├── read-cache
│   ├── readdirp
│   ├── resolve
│   ├── reusify
│   ├── rollup
│   ├── run-parallel
│   ├── scheduler
│   ├── semver
│   ├── shebang-command
│   ├── shebang-regex
│   ├── signal-exit
│   ├── source-map-js
│   ├── string-width
│   ├── string-width-cjs
│   ├── strip-ansi
│   ├── strip-ansi-cjs
│   ├── sucrase
│   ├── supports-preserve-symlinks-flag
│   ├── tailwindcss
│   ├── thenify
│   ├── thenify-all
│   ├── to-regex-range
│   ├── ts-interface-checker
│   ├── update-browserslist-db
│   ├── util-deprecate
│   ├── vite
│   ├── which
│   ├── wrap-ansi
│   ├── wrap-ansi-cjs
│   ├── yallist
│   └── yaml
├── package-lock.json
├── package.json
├── postcss.config.js
├── render.yaml
├── requirements.txt
├── s7igma-boy-.git
│   ├── HEAD
│   ├── config
│   ├── description
│   ├── filter-repo
│   ├── hooks
│   ├── info
│   ├── objects
│   ├── packed-refs
│   └── refs
├── src
│   ├── App.jsx
│   ├── assets
│   ├── components
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── test-hack-code
│   └── README.md
└── vite.config.js
