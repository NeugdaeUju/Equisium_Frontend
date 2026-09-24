import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadHorses } from '../store/horsesSlice';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddHorseModal from '../components/AddHorseModal';
import '../assets/styles/dashboard.css';
import type { IHorse } from '../types/horse';

// ── Initiales ────────────────────────────────────────────────
const getInitials = (name: string): string =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

// ── Couleur d'avatar déterministe (même couleur pour un même nom) ──
const AVATAR_COLORS = [
  { bg: '#F5C4B3', color: '#712B13' },
  { bg: '#B8D4E8', color: '#1A4A6B' },
  { bg: '#C8E6C9', color: '#1B5E20' },
  { bg: '#F8BBD9', color: '#880E4F' },
  { bg: '#D4B87A', color: '#3E2A00' },
  { bg: '#B39DDB', color: '#311B92' },
  { bg: '#F0D9C0', color: '#7A4A1E' },
  { bg: '#A8D5D1', color: '#00474F' },
  { bg: '#FFCC80', color: '#7F3300' },
  { bg: '#C5CAE9', color: '#1A237E' },
  { bg: '#D7CCC8', color: '#3E2723' },
  { bg: '#DCEDC8', color: '#33691E' },
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i ++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── Barre BLUP : BLUP -100 → 0px, BLUP 100 → 200px ──────────
const blupToWidth = (blup: number): number =>
  Math.round(((blup + 100) / 200) * 200);

// ── Badge d'étape ─────────────────────────────────────────────
const stepClass: Record<IHorse['step'], string> = {
  'Naissance':    'horses-table-step-birth',
  'Croissance':   'horses-table-step-growth',
  'Entraînement': 'horses-table-step-training',
  'Compétition':  'horses-table-step-competition',
  'BLUP 100':     'horses-table-step-blup',
};

function Dashboard() {
  const dispatch = useAppDispatch();
  const { horses, total, loading, error } = useAppSelector((state) => state.horses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(loadHorses());
  }, [dispatch]);

  // ── KPI Cards ─────────────────────────────────────────────
  const blup100Count = horses.filter((h) => h.step === 'BLUP 100').length;

  const inTrainingCount = horses.filter(
    (h) => h.step === 'Entraînement' || h.step === 'Compétition'
  ).length;

  const avgBlup = horses.length > 0
    ? Math.round(horses.reduce((sum, h) => sum + h.blup, 0) / horses.length)
    : 0;

  // Point 2 — poulains (Naissance) vs adultes (toutes les autres étapes)
  const poulainCount = horses.filter((h) => h.step === 'Naissance').length;
  const adulteCount  = total - poulainCount;

  // Point 3 — BLUP 100 atteints sur le mois calendaire en cours
  const now = new Date();
  const blup100ThisMonth = horses.filter((h) => {
    if (h.step !== 'BLUP 100') return false;
    const updated = new Date(h.updatedAt);
    return (
      updated.getFullYear() === now.getFullYear() &&
      updated.getMonth()    === now.getMonth()
    );
  }).length;

  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Header onOpenModal={() => setIsModalOpen(true)} title='Tableau de bord'/>

        {/* KPI Cards */}
        <div className='cards-container'>
          <Cards
            title="Total chevaux"
            number={total}
            description={`${poulainCount} poulain${poulainCount > 1 ? 's' : ''} · ${adulteCount} adulte${adulteCount > 1 ? 's' : ''}`}
          />
          <Cards
            title="BLUP 100 atteint"
            number={blup100Count}
            description={`↑ +${blup100ThisMonth} ce mois`}
          />
          <Cards
            title="En progression"
            number={inTrainingCount}
            description="Entraînement actif"
          />
          <Cards
            title="BLUP moyen"
            number={avgBlup}
            description="Objectif : 100"
          />
        </div>

        {/* Table */}
        <div className='horses-table'>
          <h2>Mes chevaux</h2>

          {loading && <p style={{ color: 'var(--warm-gray)', padding: '16px 0' }}>Chargement…</p>}
          {error   && <p style={{ color: '#B3261E',          padding: '16px 0' }}>{error}</p>}

          {!loading && !error && (
            <table className='horses-table-content'>
              <thead>
                <tr className='horses-table-header'>
                  <th className='col-name'>Cheval</th>
                  <th className='col-race'>Race</th>
                  <th className='col-step'>Étape</th>
                  <th className='col-blup'>BLUP</th>
                  <th className='col-action'></th>
                </tr>
              </thead>
              <tbody>
                {horses.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px 20px', color: 'var(--warm-gray)' }}>
                      Aucun cheval enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  horses.map((horse) => {
                    const avatar = getAvatarColor(horse.name);
                    return (
                      <tr key={horse._id}>

                        {/* Nom + avatar coloré */}
                        <td className="horses-table-horse">
                          <div className='horses-table-horse-name'>
                            <div
                              className='horses-table-horse-image'
                              style={{ backgroundColor: avatar.bg, color: avatar.color }}
                            >
                              <span>{getInitials(horse.name)}</span>
                            </div>
                            <div className='horses-table-horse-info'>
                              <p>{horse.name}</p>
                              <p>{horse.sex}</p>
                            </div>
                          </div>
                        </td>

                        {/* Race */}
                        <td className='horses-table-horse'>{horse.race?.name ?? '—'}</td>

                        {/* Étape */}
                        <td className="horses-table-horse">
                          <span className={stepClass[horse.step]}>{horse.step}</span>
                        </td>

                        {/* BLUP + barre variable */}
                        <td className="horses-table-horse">
                          <div className='horses-table-blup'>
                            <div className='horses-table-blup-bar'>
                              <div className='horses-table-blup-empty' />
                              <div
                                className='horses-table-blup-fill'
                                style={{ width: `${blupToWidth(horse.blup)}px` }}
                              />
                            </div>
                            <span>{horse.blup}</span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className='horses-table-action'>
                          <button type="button" onClick={() => navigate(`/horses/${horse._id}`)}>Voir la fiche</button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {isModalOpen && <AddHorseModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Dashboard;