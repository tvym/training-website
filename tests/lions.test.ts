import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Lion } from '../src/models/lion';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про левів
describe('API вебдодатку сайту про левів', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/lions-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "lions-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію левів
    beforeEach(async () => {
        await Lion.deleteMany({});
    });

    // Тести для створення запису про нового лева (POST-запит)
    describe('POST /api/lions', () => {
        it('має створити запис про нового лева', done => {
            // Тестові дані лева
            const lion = {
                name: 'Грива',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Головний лев',
                prideSize: '3',
            };

            // Виконуємо POST-запит для створення запису про лева
            chai.request(app)
                .post('/api/lions')
                .send(lion)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', lion.name);
                    expect(res.body).to.have.property('age', lion.age);
                    expect(res.body).to.have.property('height', lion.height);
                    expect(res.body).to.have.property('weight', lion.weight);
                    expect(res.body).to.have.property('gender', lion.gender);
                    expect(res.body).to.have.property('description', lion.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(res.body).to.have.property('prideSize', lion.prideSize);
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів левів (GET-запит)
    describe('GET /api/lions', () => {
        it('має отримати всіх левів', async () => {
            // Створюємо тестовий запис лева
            const testLion = new Lion({
                name: 'Король',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Високий лев',
                prideSize: '3',
            });
            await testLion.save();

            // Виконуємо GET-запит для отримання всіх записів левів
            const res = await chai.request(app).get('/api/lions');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Король');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Високий лев');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(res.body[0]).to.have.property('prideSize', '3');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного лева за ID (GET-запит)
    describe('GET /api/lions/:id', () => {
        it('має отримати конкретного лева за id', async () => {
            // Створюємо запис тестового лева
            const testLion = new Lion({
                name: 'Цар',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Перший лев',
                prideSize: '3',
            });
            const savedLion = await testLion.save();

            // Виконуємо GET-запит для отримання запису лева за ID
            const res = await chai.request(app).get(`/api/lions/${String(savedLion._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Цар');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Перший лев');
            expect(res.body).to.have.property('prideSize', '3');
        });

        it('має повернути 404 для неіснуючого лева', async () => {
            // Виконуємо GET-запит для неіснуючого ID лева
            const res = await chai.request(app).get('/api/lions/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про лева (PUT-запит)
    describe('PUT /api/lions/:id', () => {
        it('має повністю оновити запис про лева', async () => {
            // Створюємо тестового лева
            const testLion = new Lion({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                prideSize: '3',
            });
            const savedLion = await testLion.save();

            // Дані для оновлення лева
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
                prideSize: '6',
            };

            // Виконуємо PUT-запит для повного оновлення запису про лева
            const res = await chai
                .request(app)
                .put(`/api/lions/${String(savedLion._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('prideSize', '6');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового лева
            const testLion = new Lion({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                prideSize: '3',
            });
            const savedLion = await testLion.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
                prideSize: '3',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/lions/${String(savedLion._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що лев не змінився
            const unchangedLion = await Lion.findById(savedLion._id);
            expect(unchangedLion).to.have.property('name', 'Оригінальний');
            expect(unchangedLion).to.have.property('height', 25);
            expect(unchangedLion).to.have.property('weight', 1.8);
            expect(unchangedLion).to.have.property('prideSize', '3');
        });
    });

    // Тести для часткового оновлення запису про лева (PATCH-запит)
    describe('PATCH /api/lions/:id', () => {
        it('має частково оновити запис про лева', async () => {
            // Створюємо тестового лева
            const testLion = new Lion({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                prideSize: '3',
            });
            const savedLion = await testLion.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                prideSize: '6',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/lions/${String(savedLion._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('prideSize', '6');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового лева
            const testLion = new Lion({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                prideSize: '3',
            });
            const savedLion = await testLion.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
                prideSize: '3',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/lions/${String(savedLion._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('prideSize', '3');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/lions', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/lions')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису лева (DELETE-запит)
    describe('DELETE /api/lions/:id', () => {
        it('має видалити запис про лева', async () => {
            // Створюємо тестового лева
            const testLion = new Lion({
                name: 'Левко',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Злий лев',
                prideSize: '3',

            });
            const savedLion = await testLion.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/lions/${String(savedLion._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про лева видалено');

            // Перевіряємо, що запис про лева дійсно видалено з бази
            const findLion = await Lion.findById(savedLion._id);
            expect(findLion).to.be.null;
        });
    });
});
