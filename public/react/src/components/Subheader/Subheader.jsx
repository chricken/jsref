import './Subheader.css'
import ItemFooter from "../ItemFooter/ItemFooter.jsx";

const Subheader = ({item}) => {
    // console.log(item);

    return (
        <div className={'subheader'} key={item.id}>
            <h2
                dangerouslySetInnerHTML={{__html: item.text.replaceAll('\n', '<br>')}}
            />
            <ItemFooter item={item} />
        </div>
    )
}

export default Subheader;