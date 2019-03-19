const comparator=(comp)=> {
    console.log("inside comparator")
    return (comp.component === "Cylinder" || comp.component=== "Conical") ;
  }

export default comparator;