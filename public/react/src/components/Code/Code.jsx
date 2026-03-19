import './Code.css'

const Code = ({item}) => {
    // console.log(item);


    return (
        <div className={'code'} key={item.id}>
            <p
                dangerouslySetInnerHTML={{__html: item.text.replaceAll('\n', '<br>')}}
            />
        </div>
    )
}

export default Code;