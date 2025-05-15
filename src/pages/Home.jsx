import { Link } from 'react-router-dom';

function Home() {
  return (
    <main className="container px-4 py-4">
    <section>
      <h2 className="h2 text-warning">Ласкаво просимо!</h2>
      <p>Вітаємо на сайті про зайців! Дізнайтеся більше про їхню морфологію, харчування та популяцію, відвідавши відповідні розділи.</p>
      
      <h3 className="h3 text-warning mt-4">Розділи сайту:</h3>
      <ul className="list-group">
        <li className="list-group-item">
          <Link to="/morphology" className="text-warning text-decoration-none">Зовнішній вигляд</Link> - Опис зовнішності та особливостей будови зайців
        </li>
        <li className="list-group-item">
          <Link to="/nutrition" className="text-warning text-decoration-none">Харчування</Link> - Що їдять зайці та їх раціон
        </li>
        <li className="list-group-item">
          <Link to="/population" className="text-warning text-decoration-none">Ареал</Link> - Де живуть зайці у світі
        </li>
        <li className="list-group-item">
          <Link to="/photo" className="text-warning text-decoration-none">Фотогалерея</Link> - Колекція фотографій зайців
        </li>
      </ul>
    </section>
  </main>
  );
}

export default Home;