const height_comparator=(comp,value)=> {
    console.log("inside comparator")
    if (comp.height === value) 
    {
      return comp.sd;
    }
  }

export default height_comparator;