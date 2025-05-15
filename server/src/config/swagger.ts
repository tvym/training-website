// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про левів',
        version: '1.0.0',
        description: 'Документація API для Сайту про левів',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
    paths: {
        '/api/lions': {
            // GET запит для отримання всіх левів
            get: {
                summary: 'Отримати всіх левів',
                responses: {
                    '200': {
                        description: 'Список всіх левів',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Lion' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового лева
            post: {
                summary: 'Створити нового лева',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Lion' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт лева",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lion' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного лева за ID
        '/api/lions/{id}': {
            // GET запит для отримання лева за ID
            get: {
                summary: 'Отримати лева за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лева',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт лева",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lion' },
                            },
                        },
                    },
                    '404': { description: 'лева не знайдено' },
                },
            },

            // PUT запит для повного оновлення лева за ID
            put: {
                summary: 'Повністю оновити лева',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лева',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Lion' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт лева",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lion' },
                            },
                        },
                    },
                    '404': { description: 'лева не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення лева за ID
            patch: {
                summary: 'Частково оновити лева',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лева',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Lion' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт лева",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Lion' },
                            },
                        },
                    },
                    '404': { description: 'лева не знайдено' },
                },
            },
            // DELETE запит для видалення даних про лева за ID
            delete: {
                summary: 'Видалити дані про лева',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID лева',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'лева не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта лев
            Lion: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я лева",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік лева у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота лева в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага лева в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать лева',
                    },
                    description: {
                        type: 'string',
                        description: "Опис лева (необов'язкове поле)",
                    },
                    prideSize: {
                        type: 'string',
                        prideSize: 'Загальна кількість індивідів у прайді',
                    },
                },
            },
        },
    },
};
