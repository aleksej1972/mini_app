# 🚀 Инструкции по настройке базы данных

Ваше приложение работает, но нужно настроить базу данных Supabase. Выполните следующие шаги:

## 📋 Шаг 1: Создание таблиц

1. **Откройте Supabase Dashboard**
   - Перейдите на https://supabase.com/dashboard
   - Войдите в свой проект

2. **Откройте SQL Editor**
   - В левом меню нажмите "SQL Editor"
   - Нажмите "New query"

3. **Выполните миграцию схемы**
   - Скопируйте и выполните содержимое файла: `supabase/migrations/001_initial_schema.sql`
   - Нажмите "Run" для выполнения

## 📦 Шаг 2: Настройка хранилища

1. **В том же SQL Editor**
   - Создайте новый запрос
   - Скопируйте и выполните содержимое файла: `supabase/storage/setup.sql`
   - Нажмите "Run"

## 📝 Шаг 3: Добавление примеров данных

1. **В том же SQL Editor**
   - Создайте новый запрос
   - Скопируйте и выполните содержимое файла: `supabase/seed.sql`
   - Нажмите "Run"

## ✅ Шаг 4: Проверка

После выполнения всех шагов запустите:

```bash
node scripts/test-data.js
```

Вы должны увидеть:
- ✅ Найдены уроки
- ✅ Найдены упражнения
- ✅ Найдены карточки

## 🔧 Альтернативный способ (через Supabase CLI)

Если у вас установлен Supabase CLI:

```bash
# Инициализация проекта
supabase init

# Связывание с проектом
supabase link --project-ref qhfixfwfhjqxeqzfmdeg

# Применение миграций
supabase db push
```

## 📱 После настройки

1. **Перезапустите сервер разработки**
   ```bash
   npm run dev
   ```

2. **Откройте приложение**
   - Перейдите на http://localhost:3000
   - Вы должны увидеть реальные данные из Supabase

## 🎯 Что должно работать

После настройки базы данных:

- ✅ Аутентификация пользователей через Telegram
- ✅ Загрузка уроков по уровням (A1, A2, B1, etc.)
- ✅ Интерактивные упражнения
- ✅ Система XP и прогресса
- ✅ Сохранение результатов

## 🆘 Если что-то не работает

1. **Проверьте переменные окружения**
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Проверьте подключение к базе**
   ```bash
   node scripts/test-data.js
   ```

3. **Проверьте логи сервера**
   - Посмотрите на вывод `npm run dev`
   - Ищите ошибки подключения к базе данных

## � Управление контентом через Админ панель

После настройки базы данных вы можете добавлять контент через веб-интерфейс:

### 📍 Доступ к админ панели:
- **URL**: http://localhost:3000/admin
- **Альтернативно**: http://localhost:3000/test → кнопка "Admin"

### 📚 Добавление уроков:

1. **Откройте админ панель** → вкладка "Lessons"
2. **Заполните форму**:
   - **Title**: Название урока (например, "Basic Greetings")
   - **Level**: Выберите уровень (A1, A2, B1, B2, C1, C2)
   - **Description**: Описание урока
   - **Order**: Порядковый номер урока в уровне
3. **Нажмите "Add Lesson"**

### 📝 Добавление упражнений:

1. **Откройте вкладку "Exercises"**
2. **Заполните форму**:
   - **Lesson**: Выберите урок из списка
   - **Exercise Type**: Выберите тип упражнения
   - **Exercise Content**: Введите JSON контент

### 🎮 Типы упражнений и их JSON структуры:

#### 1. Quiz (Викторина)
```json
{
  "question": "How do you greet someone in the morning?",
  "options": ["Good morning", "Good night", "Good afternoon", "Good evening"],
  "correct": "Good morning"
}
```

#### 2. Fill in the Blank (Заполнить пропуски)
```json
{
  "sentence": "Hello, my name ___ John.",
  "options": ["is", "are", "am", "be"],
  "correct": "is"
}
```

#### 3. Memory Match (Сопоставление слов)
```json
{
  "word_pairs": [
    {"english": "Hello", "russian": "Привет"},
    {"english": "Good morning", "russian": "Доброе утро"},
    {"english": "Thank you", "russian": "Спасибо"},
    {"english": "Please", "russian": "Пожалуйста"},
    {"english": "Goodbye", "russian": "До свидания"},
    {"english": "Yes", "russian": "Да"}
  ]
}
```

#### 4. Sentence Builder (Конструктор предложений)
```json
{
  "translation": "Меня зовут Анна.",
  "correct_order": ["My", "name", "is", "Anna"],
  "extra_words": ["am", "called", "the"]
}
```

#### 5. Word Puzzle (Головоломка со словами)
```json
{
  "target": "Hello",
  "words": ["Hello", "Hi", "Hey", "Goodbye"]
}
```

#### 6. Reading (Чтение с вопросами)
```json
{
  "text": "John is a student. He studies English every day. He likes reading books.",
  "questions": [
    {
      "question": "What does John study?",
      "options": ["Math", "English", "History", "Science"],
      "correct": "English"
    }
  ]
}
```

### 💡 Советы по созданию контента:

1. **Для Memory Match**: Используйте 6 пар слов для оптимального игрового поля
2. **Для Quiz**: Добавляйте 4 варианта ответа
3. **Для Fill in the Blank**: Используйте `___` для обозначения пропуска
4. **Порядок упражнений**: Начинайте с order: 1, 2, 3...

### 📦 Массовая загрузка:

Используйте раздел "Bulk Upload" для загрузки множества уроков через JSON файл.

## �📞 Поддержка

Если возникли проблемы:
1. Проверьте, что все SQL-скрипты выполнены без ошибок
2. Убедитесь, что RLS (Row Level Security) настроен правильно
3. Проверьте права доступа к таблицам
4. Убедитесь, что JSON контент корректно отформатирован

---

После выполнения этих шагов ваше приложение будет полностью функциональным! 🎉
