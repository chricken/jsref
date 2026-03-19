import './ItemFooter.css'

const ItemFooter = ({item}) => {
    // console.log(item);

    return (
        <div className={'itemfooter'} key={item.id}>
            <span>Created: {new Date(item.crDate).toLocaleDateString()}</span>{' | '}
            <span>Last Changed: {new Date(item.chDate).toLocaleDateString()}</span>
        </div>
    )
}

export default ItemFooter;