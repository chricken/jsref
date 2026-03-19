import './Subnav.css'

const Subnav = ({items}) => {
    // console.log(items);

    return (
        <div className={'inner'}>
            {
                items &&
                items
                    .filter(item => (item.type === "subheader") || (item.type === "header"))
                    .map(item => (
                        <span key={item.text} className={'subnavLink'}>
                            {item.text}
                        </span>
                    ))}
        </div>
    )
}

export default Subnav;