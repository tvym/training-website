import { injectable } from 'inversify';
import { Lion, ILion } from '../models/lion';

// Клас-репозиторій для роботи з левами
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class LionRepository {
    // Метод для отримання всіх левів з бази даних
    public async findAll(): Promise<ILion[]> {
        return Lion.find();
    }

    // Метод для пошуку лева за унікальним ідентифікатором
    public async findById(id: string): Promise<ILion | null> {
        return Lion.findById(id);
    }

    // Метод для створення нового лева в базі даних
    public async create(lionData: ILion): Promise<ILion> {
        const lion = new Lion(lionData);
        return lion.save();
    }

    // Метод для видалення лева за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Lion.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про лева (заміна всіх полів)
    public async update(id: string, lionData: ILion): Promise<ILion | null> {
        return Lion.findByIdAndUpdate(id, lionData, { new: true });
    }

    // Метод для часткового оновлення даних про лева (оновлення лише вказаних полів)
    public async patch(id: string, lionData: Partial<ILion>): Promise<ILion | null> {
        return Lion.findByIdAndUpdate(id, { $set: lionData }, { new: true });
    }
}
