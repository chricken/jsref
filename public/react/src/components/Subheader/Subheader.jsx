const Subheader = ({item}) => {
    console.log(item);

    return (
        <div className={'subheader'} key={item.id}>
            <h2>
                {item.text.replaceAll('\n', '<br>')}
            </h2>
        </div>
    )
}

export default Subheader;