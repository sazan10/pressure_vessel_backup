import height_checker from '../../Components/Scene/height_checker';

const keepHeightRecord = (heights, weights,component, position, cg) => {
    const b_key = component.componentID.toString();
    if (!height_checker(component)) {
        if(heights){
      if (!(component.componentID in heights)) {
        //this.heights[component.componentID] = position;
        //let height = Object.assign(this.heights,:{position}}, {'c': 3})

        heights = {
          ...heights,
          [b_key]: position,
        }
        weights[component.componentID] = [component.component, cg, component.value.weight];
      }
    }
    let arr=[heights, weights]
    return arr;
}
  
  }

export default keepHeightRecord;