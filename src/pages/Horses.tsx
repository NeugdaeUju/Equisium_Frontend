import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import AddHorseModal from '../components/AddHorseModal.tsx';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadHorses } from '../store/horsesSlice';
import HorseCard from '../components/HorseCard.tsx';
import '../assets/styles/horses.css';



function Horses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadHorses());
    }, [dispatch]);

    const {total, horses} = useAppSelector((state) => state.horses);

    const [activeFilter, setActiveFilter] = useState<string>('tous');

    const naissance = horses.filter((h) => h.step === 'Naissance').length;
    const enCours = horses.filter((h) => h.step === 'Entraînement' || h.step === 'Compétition').length;
    const blup100 = horses.filter((h) => h.step === 'BLUP 100').length
    const male = horses.filter((h) => h.sex === 'Mâle').length
    const femelle = horses.filter((h) => h.sex === 'Femelle').length
    const hongre = horses.filter((h) => h.sex === 'Hongre').length

    const filteredHorses = horses.filter((h) => {
        if (activeFilter === 'tous') return true;
        if (activeFilter === 'naissance') return h.step === 'Naissance';
        if (activeFilter === 'en-cours') return h.step ==='Entraînement' || h.step === 'Compétition';
        if (activeFilter === 'blup100') return h.step === 'BLUP 100';
        if (activeFilter === 'male') return h.sex === 'Mâle'
        if (activeFilter === 'femelle') return h.sex === 'Femelle';
        if (activeFilter === 'hongre') return h.sex === 'Hongre';
        return true;
    })

    const getInitials = (name: string): string =>
        name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

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

    return (
       <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
            <Header onOpenModal={() => setIsModalOpen(true)} title='Mes chevaux'/>
            
            <section className='filters'>
                <div
                    className={`filter-chop ${activeFilter === 'tous' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('tous')}
                >
                    Tous ({horses.length})
                </div>

                <div
                    className={`filter-chop ${activeFilter === 'naissance' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('naissance')}
                >
                    Naissance ({naissance})
                </div>

                <div
                    className={`filter-chop ${activeFilter === 'en-cours' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('en-cours')}
                >
                    EnCours ({enCours})
                </div>

                <div
                    className={`filter-chop ${activeFilter === 'blup100' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('blup100')}
                >
                    BLUP 100 ({blup100})
                </div>

                <div
                    className={`filter-chop ${activeFilter === 'male' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('male')}
                >
                    Mâle ({male})
                </div>

                <div
                    className={`filter-chop ${activeFilter === 'femelle' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('femelle')}
                >
                    Femelle ({femelle})
                </div>

                <div
                    className={`filter-chop ${activeFilter === 'hongre' ? 'filter-chop-active' : ''} `} 
                    onClick ={() => setActiveFilter('hongre')}
                >
                    Hongre ({hongre})
                </div>
            </section>

            <section className='horsesCards-section'>
                {filteredHorses.map((horse) => {
                    const avatar = getAvatarColor(horse.name);
                    return  (
                    <HorseCard 
                        key={horse._id}
                        id={horse._id}
                        step={horse.step}
                        initial={getInitials(horse.name)}
                        race={horse.race.name}
                        name={horse.name}
                        sexe={horse.sex}
                        age={horse.age}
                        blup={horse.blup}
                        avatarBg={avatar.bg}
                        avatarColor={avatar.color}/>
                )
                }
                
               )}
            </section>
        </main>

        {isModalOpen && <AddHorseModal onClose={() => setIsModalOpen(false)} />}
       </div>
    )
}

export default Horses;