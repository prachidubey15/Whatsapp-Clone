const findIndexOfObject = (arr,condition)=>{
    return (arr.findIndex((obj)=> (String(obj._id) === String(condition))));
}

module.exports = {findIndexOfObject};