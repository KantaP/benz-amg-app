import React from 'react';
import { View } from 'react-native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";
  
export const PostPlaceHolder = () => (
    <View style={{paddingHorizontal: 10}}>
        <Placeholder
        Animation={Fade}
        Left={PlaceholderMedia}
        >
        <PlaceholderLine />
        <PlaceholderLine />
        <PlaceholderLine />
        </Placeholder>
    </View>
);