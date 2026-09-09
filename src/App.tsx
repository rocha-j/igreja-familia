import { Route, Routes } from 'react-router-dom';
import { DoacoesPage } from './pages/DoacoesPage';
import { HomePage } from './pages/HomePage';
import { NewMembersPage } from './pages/NewMembersPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/novos-membros" element={<NewMembersPage />} />
      <Route path="/doacoes" element={<DoacoesPage />} />
    </Routes>
  );
}

export default App;
