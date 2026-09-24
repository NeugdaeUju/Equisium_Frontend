import '../assets/styles/horseCard.css';
import { useNavigate } from 'react-router-dom';


function HorseCard({step, initial, name, race, sexe, age, blup, avatarBg, avatarColor, id} : {step :string , initial:string, name: string, race:string , sexe: string , age?:string, blup:number, avatarBg: string, avatarColor: string , id: string}) {
    const navigate = useNavigate();

    return (
        <div className='horseCard'>
            <div className='horseCard-heading' style={{backgroundColor: avatarColor}}>
                <div className='horseCard-heading-name' style={{color: avatarColor , backgroundColor: avatarBg}}>{initial}</div>
                <div className='horseCard-heading-step'>{step}</div>
            </div>
            
            <div className='horseCard-content'>
                <h3 className='horseCard-content-name'>{name}</h3>
                <p className='horseCard-content-info'>{race} · {sexe} · {age}</p>
                <div className='horseCard-content-blup'>
                    <div className='horseCard-content-blup-info'>
                        <p>BLUP</p>
                        <p>{blup}/100</p>
                    </div>
                    <div className='horseCard-content-blup-bar'>
                        <div className='horseCard-content-blup-empty'></div>
                        <div className='horseCard-content-blup-full'></div>
                    </div>
                </div>
            </div>

            <div className='horseCard-footer'>
                <p className='horseCard-footer-race'>{race}</p>
                <button
                    type='button'
                    className='horseCard-footer-button'
                    onClick={() => navigate(`/horses/${id}`)}
                    >
                        Voir la fiche
                </button>
                
            </div>
        </div>
    )
}

export default HorseCard