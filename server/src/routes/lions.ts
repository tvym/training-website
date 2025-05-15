import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { LionRepository } from '../repositories/LionRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію левів з контейнера інверсії залежностей
const lionRepository = container.get(LionRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів левів
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи левів з бази даних через репозиторій
        const lions = await lionRepository.findAll();
        res.json(lions);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного лева за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук лева за ідентифікатором
        const lion = await lionRepository.findById(req.params.id);
        if (lion) {
            res.json(lion);
        } else {
            // Якщо лев не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис лева не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису лева
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис лева з даних запиту
        const newLion = await lionRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного лева
        res.status(201).json(newLion);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису лева
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо лева з вказаним ID
        const lion = await lionRepository.update(req.params.id, req.body);
        if (lion) {
            return res.json(lion);
        } else {
            // Якщо лев не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис лева не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису лева
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису лева - передаються лише ті поля, які потрібно змінити
        const lion = await lionRepository.patch(req.params.id, req.body);
        if (lion) {
            res.json(lion);
        } else {
            // Якщо лев не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис лева не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису лева
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про лева за ID
        const lion = await lionRepository.delete(req.params.id);
        if (lion) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про лева видалено' });
        } else {
            // Якщо лев не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про лева не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
