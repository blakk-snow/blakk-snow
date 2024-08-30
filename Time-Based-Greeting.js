// In a react native expo app, I want to create a Greeting Component, that say Good ..., based on the time of the day. How do I do this?



// To create a Greeting component in a React Native Expo app that displays a greeting based on the time of day, you can follow these steps:

// Create a new component file, for example, Greeting.js.
// Import the necessary components from React Native.
// Define a function to determine the appropriate greeting based on the current time.
// Use this function in your component to display the greeting.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Greeting = () => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>{getGreeting()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Greeting;


// To use this component in your app, you can import and render it in your main app file or any other component where you want to display the greeting:

import React from 'react';
import { View } from 'react-native';
import Greeting from './Greeting';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Greeting />
    </View>
  );
}


// This implementation will display "Good morning" from 5 AM to 11:59 AM, "Good afternoon" from 12 PM to 5:59 PM, and "Good evening" from 6 PM to 4:59 AM.

// To combine the Greeting component with the user's full name, you can modify the Greeting component to accept a name prop and then use it in your JSX. Here's how you can achieve this:

// First, update the Greeting component to accept a name prop:

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Greeting = ({ name }) => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        {getGreeting()}, {name}!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Greeting;

// Now, you can use the Greeting component with the user's full name like this:

import React from 'react';
import { View, Text } from 'react-native';
import Greeting from './Greeting';

const YourComponent = () => {
  const user = { full_name: 'John Doe' }; // Replace with your actual user object

  return (
    <View>
      <Text>
        <Greeting name={user.full_name} />
      </Text>
    </View>
  );
};

export default YourComponent;


// If you specifically want to keep the Greeting component separate from the name, you can do it like this:

import React from 'react';
import { View, Text } from 'react-native';
import Greeting from './Greeting';

const YourComponent = () => {
  const user = { full_name: 'John Doe' }; // Replace with your actual user object

  return (
    <View>
      <Text>
        <Greeting /> {user.full_name}!
      </Text>
    </View>
  );
};

export default YourComponent;




