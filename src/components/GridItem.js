
export const GridItem = ({img}) => {
    return (
        <>
        <div className="col">
            <div className="card h-100">
                <img src={img} className="card-img-top" alt={img}/>
            </div>
        </div>
        </>
        
    )
}
