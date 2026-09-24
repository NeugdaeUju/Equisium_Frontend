import '../assets/styles/cards.css';

function Cards({title, number, description}: {title: string; number: number; description: string}) {
    return (
        <div className='card'>
            <p className='card-title'>{title}</p>
            <div className='card-content'>
                <p className='card-number'>{number}</p>
                <p className='card-description'>{description}</p>
            </div>
        </div>
    )
}

export default Cards