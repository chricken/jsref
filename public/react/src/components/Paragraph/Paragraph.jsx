
const Paragraph = ({item}) => {
    console.log(item);


    return (
      <div className={'paragraph'} key={item.id}>
          <p>{
              item.text.replaceAll('\n', '<br>')
          }</p>
        </div>
    )
}

export default Paragraph;