import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch } from '../store/hooks';
import { loadHorses } from '../store/horsesSlice';
import { createHorse } from '../services/horseService';
import { fetchRaces } from '../services/raceService';
import type { IRaceOption } from '../services/raceService';
import type { HorseSex, HorseStep } from '../types/horse';
import '../assets/styles/modal.css';

interface Props {
    onClose: () => void;
}

const SEX_OPTIONS: { value: HorseSex; label: string}[] = [
    {value: 'Mâle', label: 'Mâle' },
    {value : 'Femelle', label: 'Femelle'},
    {value: 'Hongre', label: 'Hongre'},
];

const SETP_OPTIONS: { value : HorseStep; label: string}[] = [
    {value : 'Naissance', label: 'Naissance'},
    {value : 'Croissance', label: 'Croissance'},
    {value : 'Entraînement', label: 'Entraînement'},
    {value : 'Compétition', label: 'Compétition'},
    {value : 'BLUP 100', label: 'BLUP 100'},
];

function AddHorseModal({ onClose }: Props) {
    const dispatch = useAppDispatch();
    
    const [name, setName] = useState('');
    const [sex, setSex] = useState<HorseSex>('Femelle');
    const [raceId, setRaceId] = useState('');
    const [step, setStep] = useState<HorseStep>('Naissance');
    const [blup, setBlup] = useState<string>('-100');

    const [races, setRaces] = useState<IRaceOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRaces()
            .then((data) => {
                setRaces(data);
                if (data.length > 0) setRaceId(data[0]._id);
            })
            .catch(() => setError('Impossible de charger les races.'));
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) { setError('Le nom est requis.'); return; }
        if (!raceId) { setError('Veuillez sélectionner une race.'); return;}

        setLoading(true);
        setError(null);

        try {
            await createHorse({ name: name.trim(), sex, raceId, step, blup: Number(blup) });
            await dispatch(loadHorses());
            onClose();
        } catch {
            setError('Erreur lors de la création du cheval.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className='modal-overlay' onClick={handleOverlayClick}>
            <div className='modal-card'>

                <div className='modal-header'>
                    <h2 className='modal-title'>Nouveau Cheval</h2>
                    <button type='button' className='modal-close' onClick={onClose}>✕</button>
                </div>

                <form className='modal-form' onSubmit={handleSubmit}>

                    <label className='modal-label' htmlFor='horse-name'>Nom</label>
                    <input
                        id='horse-name'
                        type='text'
                        className='modal-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Ex : Orage de Lumière'
                        required
                    />

                    <label className='modal-label' htmlFor='horse-sex'>Sexe</label>
                    <select
                        id='horse-sex'
                        className='modal-select'
                        value={sex} 
                        onChange={(e)=> setSex(e.target.value as HorseSex)}
                    >
                        {SEX_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    <label className='modal-label' htmlFor='horse-race'>Race</label>
                    <select
                        id='horse-race'
                        className='modal-select'
                        value={raceId}
                        onChange={(e) => setRaceId(e.target.value)}
                        >
                            {races.length === 0
                                ? <option value="">Chargement....</option>
                                : races.map((r) => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))
                            }
                        </select>

                        <label className='modal-label' htmlFor='horse-step'>Etape</label>
                        <select
                            id='horse-step'
                            className='modal-select'
                            value={step}
                            onChange={(e) => setStep(e.target.value as HorseStep)}
                        >
                            {SETP_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        <label className='modal-label' htmlFor='horse-blup'>BLUP (0-100)</label>
                        <input
                            id='horse-blup'
                            type='number'
                            className='modal-input'
                            value={blup}
                            onChange={(e) => setBlup(e.target.value)}
                            min={-100}
                            max={100}
                        />

                        {error && <p className='modal-error'>{error}</p>}

                        <div className='modal-actions'>
                            <button className='modal-btn-cancel' type='button' onClick={onClose}>
                                Annuler
                            </button>
                            <button className='modal-btn-submit' type='submit' disabled={loading}>
                                {loading ? 'Création...' : 'Ajouter le cheval'}
                            </button>
                        </div>
                </form>
            </div>
        </div>
    )
}

export default AddHorseModal;