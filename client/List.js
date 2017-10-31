import React from 'react'
import ReactDOM from 'react-dom'

const List = ({ title }) => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
        arr.push(<li key={i}>item {i}</li>);
    }
    return (
        <div className="listsOfJobs">
            <h1>{title}</h1>
            <ul>
                {arr}
            </ul>
        </div>
    )
}

// const styles ={
//     container: {
//         border: '1px solid black',
//         width: '50%',
//         flex: 1,
//       },
// }
export default List;