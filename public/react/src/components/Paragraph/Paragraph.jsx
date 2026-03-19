import './Paragraph.css'
import ItemFooter from '../ItemFooter/ItemFooter.jsx';

const Paragraph = ({item}) => {
    // console.log(item);


    return (
        <div className={'paragraph'} key={item.id}>
            <p
                dangerouslySetInnerHTML={{__html: item.text.replaceAll('\n', '<br>')}}
            />
            <ItemFooter item={item} />
        </div>
    )
}

export default Paragraph;