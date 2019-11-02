import React from 'react';
import {
    TextInput 
} from '@shoutem/ui';

class AutoExpandingTextInput extends React.Component {

    constructor(props) {
      super(props);
      this.state = { height: 0 , };
    }
    render() {
      let style = Object.assign({} , this.props.style , {height: Math.max(100, this.state.height) ,  textAlignVertical: 'top'})
      return (
        <TextInput
          placeholder={this.props.placeholder}
          {...this.props}
          multiline={true}
          onChangeText={(text) => {
              if(this.props.onChangeText) this.props.onChangeText(text);
              // this.setState({ text })
          }}
          onContentSizeChange={(event) => {
              this.setState({ height: event.nativeEvent.contentSize.height })
          }}
          style={style}
          value={this.props.value}
        />
      );
    }
  }

  export default AutoExpandingTextInput;