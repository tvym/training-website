import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "лев"
interface ILion {
    name: string; // Ім'я лева
    age: number; // Вік лева у роках
    height: number; // Висота лева в сантиметрах
    weight: number; // Вага лева в кілограмах
    gender: 'male' | 'female'; // Стать лева: 'male' - самець, 'female' - самка
    description?: string; // Опис лева (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
    prideSize: string; //загальна кількість індивідів у прайді
}

// Схема MongoDB для моделі "лев"
const lionSchema = new Schema<ILion>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    prideSize: {
        type: String,
        required: true, // Поле є обов'язковим
    },
});

// Створення моделі Mongoose на основі схеми
export const Lion = model<ILion>('Lion', lionSchema);
export type { ILion }; // Експортуємо інтерфейс для використання в інших файлах
