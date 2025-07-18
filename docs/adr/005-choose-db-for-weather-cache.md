# ADR-005: Вибір бази даних для зберігання кешованих погодних даних

Статус: Прийнято  
Дата: 17-05-2025  
Автор: Zhukov Vladyslav

## Контекст

Потрібно обрати базу для кешування погодних даних, які отримуються з зовнішнього API за назвою
міста. Кешування необхідне для зменшення кількості звернень до стороннього сервісу, підвищення
швидкодії додатку та оптимізації використання ресурсів.

## Варіанти

1. **Redis**

    - Плюси: дуже швидкий доступ до даних у пам’яті, підтримка TTL, простота інтеграції,
      масштабованість, підтримка різних структур даних.
    - Мінуси: потребує окремого сервера, дані зберігаються у пам’яті (можливі обмеження за обсягом).

2. **Memcached**

    - Плюси: простий у налаштуванні, дуже швидкий доступ до кешу, підтримка TTL.
    - Мінуси: підтримує лише прості типи даних (рядки), немає вбудованої реплікації та
      персистентності.

3. **MongoDB**

    - Плюси: гнучка схема, можливість зберігати великі обсяги даних, підтримка TTL-колекцій.
    - Мінуси: повільніший доступ у порівнянні з in-memory рішеннями, складніша інтеграція для кешу.

4. **PostgreSQL**

    - Плюси: надійність, знайомий стек, підтримка TTL через job-и або розширення.
    - Мінуси: не оптимізований для кешування, повільніший доступ, складніше налаштувати TTL.

5. **SQLite**
    - Плюси: простота у використанні, не потребує окремого сервера.
    - Мінуси: не підходить для розподілених систем, повільний доступ до даних у порівнянні з
      in-memory рішеннями, відсутність нативної підтримки TTL.

## Прийняте рішення

**Обрано Redis**

Redis обрано через його дуже високу швидкість доступу до даних у пам’яті, підтримку TTL
для автоматичного видалення застарілих записів, простоту інтеграції та масштабованість.

**Схема бази даних:**

- Кожне місто зберігається як окремий ключ у Redis.
- Формат ключа: `weather:<city>`, де `<city>` — назва міста (у нижньому регістрі, без пробілів).
- Значення: JSON-об’єкт з погодними даними, отриманими з зовнішнього API.
- Для кожного ключа встановлюється TTL (5 хвилин), після чого дані автоматично видаляються.

## Наслідки

**Позитивні:**

- Висока швидкість доступу.
- Масштабованість із централізованим кешем.
- Персистентність даних після перезапуску.
- Автоматичне видалення через TTL.
- Менше запитів до зовнішнього API.
- Підтримка різних структур даних.
- Атомарні операції.

**Негативні:**

- Потребує окремого сервера або хмарного сервісу.
- Обмежений обсяг кешу через зберігання в пам’яті.
- Втрата кешу при відсутності з’єднання з Redis.
