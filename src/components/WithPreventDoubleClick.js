import React from 'react';
import _ from 'lodash';

const withPreventDoubleClick = (WrappedComponent) => {
  
  class PreventDoubleClick extends React.PureComponent {
    
    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }
    
    onPress = _.debounce(this.debouncedOnPress, 600, { leading: true, trailing: false });
    
    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }
  
  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName ||WrappedComponent.name})`
  return PreventDoubleClick;
}

export default withPreventDoubleClick;