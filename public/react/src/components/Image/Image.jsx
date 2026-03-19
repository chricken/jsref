import './Image.css'
import ItemFooter from "../ItemFooter/ItemFooter.jsx";

const Image = ({item}) => {
    console.log(item);

    /*
     "type": "image",
      "crDate": 1725872083006,
      "chDate": 1725872083006,
      "subtext": "Menü-Eintrag der Snippets",
      "filename": "6bd38305969a1c2be07fbbe02.jpg",
      "width": "400"
     */

    return (
        <div className={'image'} key={item.id}>
            <img src={item.filename} alt={item.subtext} width={item.width} />
            <p>{item.subtext}</p>

            <ItemFooter item={item} />
        </div>
    )
}

export default Image;