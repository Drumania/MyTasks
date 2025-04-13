export default function Sidebar() {
  return (
    <div className="d-flex flex-column h-100 p-3">
      <h5 className="text-primary">Mis Listas</h5>
      <ul className="list-unstyled">
        <li>
          <a href="#" className="active">
            Hoy
          </a>
        </li>
        <li>
          <a href="#">Próximas</a>
        </li>
        <li>
          <a href="#">Compartidas</a>
        </li>
      </ul>
    </div>
  );
}
