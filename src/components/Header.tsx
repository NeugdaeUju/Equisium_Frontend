import '../assets/styles/header.css';

interface Props {
    onOpenModal: () => void;
}

function Header({ onOpenModal, title }: Props & { title: string }) {

    return (
        <div className='header'>
            <h1>{title}</h1>
            <div className='header-actions'>
                <input type='search' placeholder='Recherche...' className='research'></input>
                <button type='button' className='add-horse' onClick={onOpenModal}>Nouveau Cheval</button>
            </div>
        </div>
    )
}

export default Header;