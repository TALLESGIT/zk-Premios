import { useSorteio } from "../context/SorteioContext";

const ListaParticipantes = () => {
  const { participantes } = useSorteio();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lista Completa de Participantes</h2>
      {participantes.length === 0 ? (
        <p>Nenhum participante cadastrado.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Número</th>
              <th className="border border-gray-300 p-2 text-left">Nome</th>
              <th className="border border-gray-300 p-2 text-left">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {participantes.map((p) => (
              <tr key={p.numero} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{p.numero}</td>
                <td className="border border-gray-300 p-2">{p.nome}</td>
                <td className="border border-gray-300 p-2">{p.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaParticipantes;
