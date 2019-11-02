


export const onStateChange = async function(key , value){
    await this.setState((state)=>{
        state[key] = value;
        return state;
    });
}

export const openDrawer = function() {
    // console.log(this.props);
    if(this.props.navigation) this.props.navigation.openDrawer();
}

export const goto = function(page) {
    // console.log(this.props.navigation);
    if(this.props.navigation) this.props.navigation.push(page);
}

export const goBack = function() {
    if(this.props.navigation) this.props.navigation.goBack();
}

export const getUnique = function(arr, comp) {

    const unique = arr
         .map(e => e[comp])
  
       // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
  
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);
  
     return unique;
  }