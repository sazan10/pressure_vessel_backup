const object_empty=(obj)=> {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
export default object_empty;