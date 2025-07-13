# 📋 Шаблоны упражнений - Быстрый справочник

## 🎯 Quiz (Викторина)

### Базовый шаблон:
```json
{
  "question": "Ваш вопрос здесь?",
  "options": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
  "correct": "Правильный вариант"
}
```

### Примеры:

#### A1 уровень:
```json
{
  "question": "How do you say 'Привет' in English?",
  "options": ["Hello", "Goodbye", "Thank you", "Please"],
  "correct": "Hello"
}
```

#### B1 уровень:
```json
{
  "question": "Which sentence is grammatically correct?",
  "options": [
    "I have been living here for 5 years",
    "I am living here since 5 years", 
    "I live here since 5 years",
    "I was living here for 5 years"
  ],
  "correct": "I have been living here for 5 years"
}
```

## ✏️ Fill in the Blank (Заполнить пропуски)

### Базовый шаблон:
```json
{
  "sentence": "Предложение с ___ пропуском.",
  "options": ["вариант1", "вариант2", "вариант3", "вариант4"],
  "correct": "правильный_вариант"
}
```

### Примеры:

#### A1 уровень:
```json
{
  "sentence": "My name ___ Anna.",
  "options": ["is", "are", "am", "be"],
  "correct": "is"
}
```

#### A2 уровень:
```json
{
  "sentence": "I ___ to school every day.",
  "options": ["go", "goes", "going", "went"],
  "correct": "go"
}
```

## 🎮 Memory Match (Сопоставление слов)

### Базовый шаблон:
```json
{
  "word_pairs": [
    {"english": "слово1", "russian": "перевод1"},
    {"english": "слово2", "russian": "перевод2"},
    {"english": "слово3", "russian": "перевод3"},
    {"english": "слово4", "russian": "перевод4"},
    {"english": "слово5", "russian": "перевод5"},
    {"english": "слово6", "russian": "перевод6"}
  ]
}
```

### Примеры по темам:

#### Семья (A1):
```json
{
  "word_pairs": [
    {"english": "Mother", "russian": "Мама"},
    {"english": "Father", "russian": "Папа"},
    {"english": "Sister", "russian": "Сестра"},
    {"english": "Brother", "russian": "Брат"},
    {"english": "Grandmother", "russian": "Бабушка"},
    {"english": "Grandfather", "russian": "Дедушка"}
  ]
}
```

#### Еда (A2):
```json
{
  "word_pairs": [
    {"english": "Apple", "russian": "Яблоко"},
    {"english": "Bread", "russian": "Хлеб"},
    {"english": "Milk", "russian": "Молоко"},
    {"english": "Cheese", "russian": "Сыр"},
    {"english": "Chicken", "russian": "Курица"},
    {"english": "Rice", "russian": "Рис"}
  ]
}
```

#### Эмоции (B1):
```json
{
  "word_pairs": [
    {"english": "Happy", "russian": "Счастливый"},
    {"english": "Sad", "russian": "Грустный"},
    {"english": "Angry", "russian": "Злой"},
    {"english": "Excited", "russian": "Взволнованный"},
    {"english": "Nervous", "russian": "Нервный"},
    {"english": "Confident", "russian": "Уверенный"}
  ]
}
```

## 🔧 Sentence Builder (Конструктор предложений)

### Базовый шаблон:
```json
{
  "translation": "Русский перевод предложения.",
  "correct_order": ["Правильный", "порядок", "английских", "слов"],
  "extra_words": ["лишние", "слова", "отвлекатели"]
}
```

### Примеры:

#### A1 уровень:
```json
{
  "translation": "Меня зовут Анна.",
  "correct_order": ["My", "name", "is", "Anna"],
  "extra_words": ["am", "called", "the"]
}
```

#### A2 уровень:
```json
{
  "translation": "Я хожу в школу каждый день.",
  "correct_order": ["I", "go", "to", "school", "every", "day"],
  "extra_words": ["am", "going", "at", "on"]
}
```

## 🧩 Word Puzzle (Головоломка со словами)

### Базовый шаблон:
```json
{
  "target": "целевое_слово",
  "words": ["целевое_слово", "слово2", "слово3", "слово4"]
}
```

### Примеры:

#### A1 уровень:
```json
{
  "target": "Hello",
  "words": ["Hello", "Goodbye", "Thank you", "Please"]
}
```

#### B1 уровень:
```json
{
  "target": "Beautiful",
  "words": ["Beautiful", "Handsome", "Ugly", "Pretty"]
}
```

## 📖 Reading (Чтение с вопросами)

### Базовый шаблон:
```json
{
  "text": "Текст для чтения...",
  "questions": [
    {
      "question": "Вопрос по тексту?",
      "options": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      "correct": "Правильный ответ"
    }
  ]
}
```

### Примеры:

#### A1 уровень:
```json
{
  "text": "My name is John. I am 25 years old. I live in London. I work as a teacher.",
  "questions": [
    {
      "question": "What is John's job?",
      "options": ["Doctor", "Teacher", "Student", "Engineer"],
      "correct": "Teacher"
    },
    {
      "question": "Where does John live?",
      "options": ["Paris", "Berlin", "London", "Madrid"],
      "correct": "London"
    }
  ]
}
```

#### B1 уровень:
```json
{
  "text": "Climate change is one of the most pressing issues of our time. Scientists around the world are working to understand its causes and effects. Many countries are implementing policies to reduce carbon emissions and promote renewable energy sources.",
  "questions": [
    {
      "question": "What are scientists trying to understand?",
      "options": [
        "The causes and effects of climate change",
        "How to build better computers",
        "The history of renewable energy",
        "How to reduce population growth"
      ],
      "correct": "The causes and effects of climate change"
    }
  ]
}
```

## 💡 Советы по созданию контента

### Для Memory Match:
- **Тематические группы**: Объединяйте слова по темам (семья, еда, работа)
- **Уровень сложности**: A1 - простые слова, C2 - сложная лексика
- **Избегайте**: Слишком похожих переводов или омонимов

### Для Quiz:
- **Четкие вопросы**: Избегайте двусмысленности
- **Правдоподобные варианты**: Неправильные ответы должны быть логичными
- **Один правильный ответ**: Убедитесь, что только один вариант корректен

### Для Fill in the Blank:
- **Контекст**: Предложение должно помогать найти ответ
- **Грамматический фокус**: Сосредоточьтесь на конкретном правиле
- **Логичные альтернативы**: Варианты должны быть грамматически возможными

### Для Sentence Builder:
- **Постепенное усложнение**: От простых к сложным конструкциям
- **Полезные отвлекатели**: Лишние слова должны быть правдоподобными
- **Четкий перевод**: Русский текст должен точно соответствовать английскому

---

Используйте эти шаблоны как основу для создания разнообразного и качественного образовательного контента! 📚
