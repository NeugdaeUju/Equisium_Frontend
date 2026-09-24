import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useState , useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchHorseById, updateHorse } from '../services/horseService';
import type { IHorse, HorseStep , HorseSex} from '../types/horse';
import '../assets/styles/horsePage.css';

const getInitials = (name: string): string =>
    name.split(' ').map((w) =>w[0]).join('').slice(0, 2).toUpperCase();

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
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const blupToWidth = (blup: number): number =>
    Math.round(((blup +100) / 200 ) * 100);

const STEP_OPTIONS: HorseStep[] = [
    'Naissance', 'Croissance', 'Entraînement', 'Compétition', 'BLUP 100'
]

const stepClass: Record<HorseStep, string> = {
    'Naissance': 'badge-birth',
    'Croissance': 'badge-growth',
    'Entraînement': 'badge-train',
    'Compétition': 'badge-comp',
    'BLUP 100': 'badge-blup',
};

interface EditModalProps {
    horse : IHorse;
    onClose: () => void;
    onSave: (update: IHorse) => void;
}

function EditHorseModal({ horse, onClose, onSave }: EditModalProps) {
    const [name, setName] = useState(horse.name);
    const [sex, setSex] = useState<HorseSex>(horse.sex);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleHorseModal = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) {setError('Le nom est requis.'); return; }
        setLoading(true);
        try {
            const updated = await updateHorse(horse._id, {
                name: name.trim(),
                sex,
            });
            onSave(updated);
            onClose();
        } catch {
            setError('Erreur lors de la modification.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className='modal-overlay' onClick={handleOverlay}>
            <div className='modal-card'>
                <div className='modal-header'>
                    <h2 className='modal-title'>Modifier le cheval</h2>
                    <button type='button' className='modal-close' onClick={onClose}>✕</button>
                </div>

                <form className='modal-form' onSubmit={handleHorseModal}>

                    <label className='modal-label' htmlFor='edit-name'>Nom</label>
                    <input 
                        id='edit-name'
                        type='text'
                        className='modal-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    
                    <label className='modal-label' htmlFor='edit-sex'>Sexe</label>
                    <select 
                        id='edit-sex'
                        className='modal-select'
                        value={sex}
                        onChange={(e) => setSex(e.target.value as HorseSex)}
                        required
                    >
                        <option value="Mâle">Mâle</option>
                        <option value="Femelle">Femelle</option>
                        <option value="Hongre">Hongre</option>
                    </select>

                    <label className='modal-label' htmlFor='edit-age'>Age</label>
                    <input id='edit-age' type='number' className='modal-input' min='0' max='100'></input>

                    <label className='modal-label' htmlFor='edit-step'>Etape</label>
                    <select id='edit-step' className='modal-select' value='step'>
                        <option value='Naissance'>Naissance</option>
                        <option value='Croissance'>Croissance</option>
                        <option value='Entraînement'>Entraînement</option>
                        <option value='Compétition'>Compétition</option>
                        <option value='BLUP 100'>BLUP 100</option>
                    </select>

                    {error && <p className='modal-error'>{error}</p>}

                    <div className='modal-actions'>
                        <button type='button' className='modal-btn-cancel' onClick={onClose}>
                            Annuler
                        </button>
                        <button type='submit' className='modal-btn-submit' disabled={loading}>
                            {loading ? 'Sauvegarde...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


function HorsePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [horse, setHorse] = useState<IHorse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchHorseById(id)
            .then((data) => setHorse(data))
            .catch(() => setError('Cheval introuvable'))
            .finally(() => setLoading(false));
    }, [id]);

    const avatar = horse ? getAvatarColor(horse.name) : null;
    const [isEditOpen, setIsEditOpen] = useState(false);

    const updateBlup = async (delta: number) => {
        if(!horse) return;
        const newBlup = Math.min(100, Math.max(-100, horse.blup + delta));
        if(newBlup === horse.blup) return;
        try {
            const updated = await updateHorse(horse._id, {blup: newBlup});
            setHorse(updated);
        } catch {
            setError('Erreur lors de la mise à jour du BLUP.')
        }
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <Header onOpenModal={() => setIsModalOpen(true)} title=''/>

                <Link to='/horses' className='hp-backToHorses'>Mes chevaux</Link>
                
                {loading && <p className='hp-loading'>Chargement...</p>}
                {error && <p className='hp-error'>{error}</p>}

                {horse && avatar && (
                    <>
                        <section className='hp-header-card'>
                            <div className='hp-banner'  style={{backgroundColor: avatar.color}}>
                                <button type='button' className='hp-banner-updateButton' onClick={() => setIsEditOpen(true)}>Modifier le cheval</button>
                            </div>
                            <div className='hp-header-body'>
                                <div
                                    className='hp-avatar'
                                    style={{backgroundColor: avatar.bg, color: avatar.color}}
                                >
                                    {getInitials(horse.name)}
                                </div>
                                <div className='hp-identity'>
                                    <h1 className='hp-name'>{horse.name}</h1>
                                    <p className='hp-meta'>
                                        {horse.race.name} · {horse.sex} · {horse.age}
                                    </p>
                                    <div className='hp-tags'>
                                        <span className={`hp-badge ${stepClass[horse.step]}`}>
                                            {horse.step}
                                        </span>
                                        <span className='hp-badge badge-neutral'>
                                            {horse.race.isPureBreed ? 'Pur-sang' : 'Croisé'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='hp-grid'>
                            <div className='hp-card'>
                                <h2 className='hp-card-title'>Identité</h2>
                                <div className='hp-info-row'>
                                    <span className='hp-info-key'>Nom</span>
                                    <span className='hp-info-val'>{horse.name}</span>
                                </div>
                                <div className='hp-info-row'>
                                    <span className='hp-info-key'>Race</span>
                                    <span className='hp-info-val'>{horse.race.name}</span>
                                </div>
                                <div className='hp-info-row'>
                                    <span className='hp-info-key'>Sexe</span>
                                    <span className='hp-info-val'>{horse.sex}</span>
                                </div>
                                <div className='hp-info-row'>
                                    <span className='hp-info-key'>Etape</span>
                                    <span className='hp-info-val'>{horse.step}</span>
                                </div>
                                <div className='hp-info-row'>
                                    <span className='hp-info-key'>Age</span>
                                    <span className='hp-info-val'>{horse.age}</span>
                                </div>
                            </div>

                            <div className='hp-card'>
                                <h2 className='hp-card-title'>Progression BLUP</h2>
                                
                                <div className='hp-blup-bar-row'>
                                    <div className='hp-blup-track'>
                                        <div
                                            className='hp-blup-fill'
                                            style={{ width: `${blupToWidth(horse.blup)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className='hp-blup-controls'>
                                    <button
                                        type='button'
                                        className='hp-blup-btn'
                                        onClick={() => updateBlup(-1)}
                                    >
                                        −
                                    </button>
                                    <span className='hp-blup-score'>{horse.blup} / 100</span>
                                    <button
                                        type='button'
                                        className='hp-blup-btn hp-blup-btn-plus'
                                        onClick={() => updateBlup(1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </section>
                    
                    </>
                )}
                
            </main>
            {isEditOpen &&horse && (
                <EditHorseModal 
                    horse={horse}
                    onClose={() => setIsEditOpen(false)}
                    onSave={(updated) => setHorse(updated)}
                />
            )}
        </div>
    )
}

export default HorsePage;