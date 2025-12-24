`Node JS version: 22.21.1`

## User Service

### API Endpoints
#### Аутентификация

`POST /api/auth/register` - Регистрация

`POST /api/auth/login` - Вход

#### Пользователи

`GET /api/users` - Получить всех пользователей (только админ)

`GET /api/users/:id` - Получить пользователя по ID (админ или сам пользователь)

`POST /api/users/:id/toggle-block` - Блокировка/разблокировка (админ или сам пользователь)

### Структура сущности User
```
{
id: string;
fullName: string;
dateOfBirth: Date;
email: string;
password: string;
role: 'admin' | 'user';
status: 'active' | 'blocked';
createdAt: Date;
}
```

### Авторизация
Все защищенные эндпоинты требуют Bearer Token в заголовке:

`Authorization: Bearer <jwt-token>`

### Безопасность
- Валидация всех входных данных

- Хеширование паролей

- JWT с истечением срока

- CORS настройки

- Helmet для защиты заголовков

- Ролевая модель доступа

### Логирование
- INFO: Информационные сообщения

- WARN: Предупреждения

- ERROR: Ошибки

- SUCCESS: Успешные операции