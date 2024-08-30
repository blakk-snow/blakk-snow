// A React Native Expo application that mimics flip cards.
// So, to create a flipcard application for quiz system or study system or learning-game system.

// That's an interesting idea for an educational app using React Native and Expo. A flip card system could indeed be very effective for quizzes, studying, or learning games. Let's break this down a bit:
// Core Concept:

// A React Native Expo app that simulates flip cards
// Can be used for quizzes, studying, or as a learning game

// Key Features to Consider:

// Card flipping animation
// Content management (adding/editing cards)
// Categories or decks for different subjects
// Progress tracking
// Quiz mode vs. study mode
// Potential for multiplayer or competitive elements

// Technical Considerations:

// React Native Animations API for the flip effect
// State management (Redux or Context API) for handling card data
// AsyncStorage or a database solution for persistent data
// Expo's gesture handler for swipe interactions

// Next Steps:

// Decide on the primary use case (quiz, study, or game)
// Sketch out a basic UI design
// Plan the data structure for cards and decks
// Set up a React Native Expo project
// Implement the core card flipping functionality



// 1. What card flipping animation software are available for such purpose?
// 2. Which of them would you suggest I consider?
// 3. Suggest a Context API structure for this purpose.
// 4. Categories would be department, class, subject, strand, sub-strand.
// 5. Progress Tracking Tool to be created. Use data collected from activities, and saved in state, then in a database, after a button click.
// 6. User will have to select between two options: Study Mode : Quiz Mode
// 7. Suggest Competitive elements that could be included
// 8. Suggest the most suitable animations API that sits well with expo.
// 9. Consider using Context API
// 10. Let's use SQLite datbase
// 11. Always select the best expo library

//   Thank you for providing more details about your project. I'll address each of your points:

// Card flipping animation libraries:

// React Native Animated
// React Native Reanimated
// Lottie for React Native
// React Native Animatable


// Recommendation:
// React Native Reanimated is highly recommended for complex animations in Expo projects. It offers better performance and more control over animations.
// Context API structure suggestion:


import React, { createContext, useReducer } from 'react';

const initialState = {
  cards: [],
  categories: {
    department: [],
    class: [],
    subject: [],
    strand: [],
    subStrand: []
  },
  currentMode: 'study', // or 'quiz'
  progress: {}
};

const CardContext = createContext();

function cardReducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'SET_MODE':
      return { ...state, currentMode: action.payload };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    // Add more cases as needed
    default:
      return state;
  }
}

function CardProvider({ children }) {
  const [state, dispatch] = useReducer(cardReducer, initialState);
  
  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
}

export { CardContext, CardProvider };


// 4. Categories structure noted. You can implement this in the state as shown above.
// 5. Progress Tracking:
// Create a function to update progress after each activity:

function updateProgress(activityResult) {
  dispatch({ type: 'UPDATE_PROGRESS', payload: activityResult });
  // After updating state, save to SQLite database
  saveToDB(activityResult);
}


// 6. Mode selection:
// Implement a toggle or selection screen for users to choose between Study and Quiz modes.
// 7. Competitive elements suggestions:

//     -- Leaderboards
//     -- Timed quizzes
//     -- Multiplayer real-time quiz battles
//     -- Achievements/badges system
//     -- Daily challenges


// 8. Recommended animations API:
// React Native Reanimated works well with Expo and offers excellent performance.
// 9. Context API usage noted and implemented in point 3.
// 10. SQLite database:
// Use expo-sqlite package. Here's a basic setup:

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('flipcards.db');

function setupDatabase() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, category TEXT)'
    );
    // Add more table creations as needed
  });
}

function saveToDB(data) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO cards (question, answer, category) VALUES (?, ?, ?)', [data.question, data.answer, data.category]);
  });
}

// 11. Expo libraries to consider:

// expo-sqlite for database
// expo-av for audio (if you want to add sound effects)
// expo-haptics for tactile feedback
// expo-sharing for sharing progress or cards

// To get started, you can create a new Expo project and start implementing these features step by step. Would you like me to provide more details on any specific part of the implementation?

  
// I'd like you to write the application structure or logic, and the implementation as well.

1. Project Setup
npx expo init FlipCardApp
cd FlipCardApp

2. Install necessary dependencies:

expo install react-native-reanimated expo-sqlite @react-navigation/native @react-navigation/stack react-native-gesture-handler

3. Application Structure

FlipCardApp/
├── src/
│   ├── components/
│   │   ├── FlipCard.js
│   │   ├── CategorySelector.js
│   │   └── ProgressBar.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── StudyModeScreen.js
│   │   ├── QuizModeScreen.js
│   │   └── StatsScreen.js
│   ├── context/
│   │   └── CardContext.js
│   ├── database/
│   │   └── database.js
│   └── utils/
│       └── helpers.js
├── App.js
└── app.json

4. Implementation

// a. App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardProvider } from './src/context/CardContext';
import HomeScreen from './src/screens/HomeScreen';
import StudyModeScreen from './src/screens/StudyModeScreen';
import QuizModeScreen from './src/screens/QuizModeScreen';
import StatsScreen from './src/screens/StatsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CardProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StudyMode" component={StudyModeScreen} />
          <Stack.Screen name="QuizMode" component={QuizModeScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CardProvider>
  );
}


// b. src/context/CardContext.js
import React, { createContext, useReducer, useContext } from 'react';

const CardContext = createContext();

const initialState = {
  cards: [],
  categories: {
    department: [],
    class: [],
    subject: [],
    strand: [],
    subStrand: []
  },
  currentMode: 'study',
  progress: {}
};

function cardReducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'SET_MODE':
      return { ...state, currentMode: action.payload };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    case 'SET_CATEGORIES':
      return { ...state, categories: { ...state.categories, ...action.payload } };
    default:
      return state;
  }
}

export function CardProvider({ children }) {
  const [state, dispatch] = useReducer(cardReducer, initialState);
  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCardContext() {
  return useContext(CardContext);
}

// c. src/components/FlipCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

export default function FlipCard({ frontContent, backContent }) {
  const rotation = useSharedValue(0);
  
  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
    };
  });
  
  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value + 180}deg` }],
    };
  });

  const flipCard = () => {
    rotation.value = withSpring(rotation.value + 180);
  };

  return (
    <TouchableOpacity onPress={flipCard} style={styles.container}>
      <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
        <Text>{frontContent}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
        <Text>{backContent}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
  },
  frontCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  backCard: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

// d. src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCardContext } from '../context/CardContext';

export default function HomeScreen({ navigation }) {
  const { dispatch } = useCardContext();

  const setMode = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
    navigation.navigate(mode === 'study' ? 'StudyMode' : 'QuizMode');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlipCard App</Text>
      <TouchableOpacity style={styles.button} onPress={() => setMode('study')}>
        <Text style={styles.buttonText}>Study Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setMode('quiz')}>
        <Text style={styles.buttonText}>Quiz Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Stats')}>
        <Text style={styles.buttonText}>View Stats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});


// For the database integration, create a file src/database/database.js:
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('flipcards.db');

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, category TEXT)'
    );
  });
};

export const addCard = (question, answer, category) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO cards (question, answer, category) VALUES (?, ?, ?)',
        [question, answer, category],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getCards = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cards',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

// To use this database in your app, you'll need to call initDB() when your app starts (e.g., in App.js), and use addCard and getCards in your components as needed.
// This structure provides a solid foundation for your FlipCard app. You'll need to expand on this by implementing the remaining screens, adding more complex logic for quiz and study modes, and integrating the progress tracking system.


// Please provide code for the remaining components.

// Certainly. I'll provide the code for the remaining components, including the StudyModeScreen, QuizModeScreen, StatsScreen, CategorySelector, and ProgressBar.

// 1. src/screens/StudyModeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlipCard from '../components/FlipCard';
import CategorySelector from '../components/CategorySelector';
import { useCardContext } from '../context/CardContext';
import { getCards } from '../database/database';

export default function StudyModeScreen() {
  const { state, dispatch } = useCardContext();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const loadedCards = await getCards();
    setCards(loadedCards);
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <CategorySelector />
      {cards.length > 0 ? (
        <FlipCard 
          frontContent={cards[currentCardIndex].question}
          backContent={cards[currentCardIndex].answer}
        />
      ) : (
        <Text>No cards available</Text>
      )}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.button} onPress={prevCard}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextCard}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});


// src/screens/QuizModeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlipCard from '../components/FlipCard';
import ProgressBar from '../components/ProgressBar';
import { useCardContext } from '../context/CardContext';
import { getCards } from '../database/database';

export default function QuizModeScreen() {
  const { state, dispatch } = useCardContext();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const loadedCards = await getCards();
    setCards(loadedCards);
  };

  const handleAnswer = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Quiz finished
      dispatch({ type: 'UPDATE_PROGRESS', payload: { quizScore: score, totalCards: cards.length } });
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar current={currentCardIndex + 1} total={cards.length} />
      {cards.length > 0 && currentCardIndex < cards.length ? (
        <>
          <FlipCard 
            frontContent={cards[currentCardIndex].question}
            backContent={cards[currentCardIndex].answer}
          />
          <View style={styles.answerButtons}>
            <TouchableOpacity style={[styles.button, styles.incorrectButton]} onPress={() => handleAnswer(false)}>
              <Text style={styles.buttonText}>Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.correctButton]} onPress={() => handleAnswer(true)}>
              <Text style={styles.buttonText}>Correct</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Quiz Finished! Your score: {score}/{cards.length}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  incorrectButton: {
    backgroundColor: '#FF3B30',
  },
  correctButton: {
    backgroundColor: '#4CD964',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

// src/screens/StatsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCardContext } from '../context/CardContext';

export default function StatsScreen() {
  const { state } = useCardContext();

  const calculateOverallScore = () => {
    if (!state.progress.quizScore || !state.progress.totalCards) return 0;
    return (state.progress.quizScore / state.progress.totalCards * 100).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Statistics</Text>
      <Text style={styles.stat}>Total Cards: {state.cards.length}</Text>
      <Text style={styles.stat}>Quiz Score: {state.progress.quizScore || 0}/{state.progress.totalCards || 0}</Text>
      <Text style={styles.stat}>Overall Score: {calculateOverallScore()}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    marginVertical: 10,
  },
});


// src/components/CategorySelector.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCardContext } from '../context/CardContext';

export default function CategorySelector() {
  const { state, dispatch } = useCardContext();

  const categories = ['department', 'class', 'subject', 'strand', 'subStrand'];

  const selectCategory = (category) => {
    // This is a simple implementation. You might want to add more complex logic
    // to handle subcategories based on the selected parent category.
    dispatch({ type: 'SET_CATEGORIES', payload: { [category]: [category] } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category:</Text>
      {categories.map((category) => (
        <TouchableOpacity 
          key={category} 
          style={styles.categoryButton}
          onPress={() => selectCategory(category)}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  categoryText: {
    fontSize: 16,
  },
});

// 5. src/components/ProgressBar.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.text}>{current} / {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  barContainer: {
    width: '80%',
    height: 10,
    backgroundColor: '#E5E5EA',
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  text: {
    marginTop: 5,
    fontSize: 16,
  },
});


// These components complete the basic structure of your FlipCard app. Here's a summary of what each new component does:

// StudyModeScreen: Allows users to flip through cards for studying.
// QuizModeScreen: Implements a quiz system where users can test their knowledge.
// StatsScreen: Displays user statistics and progress.
// CategorySelector: Allows users to select categories for their cards.
// ProgressBar: Shows progress in quiz mode.

// To fully implement the app, you'll need to:

// Integrate these components with your navigation system in App.js.
// Implement proper error handling and loading states.
// Add more complex logic for category selection and filtering cards based on categories.
// Implement a system to add new cards to the database.
// Enhance the UI/UX with better styling and possibly animations.
// Implement more advanced features like spaced repetition for study mode.

// =========================================================================


// Can you create a dummyData.js and fetch data from it for the app?

// Certainly! I'll create a dummyData.js file with some sample data for your FlipCard app. Then, I'll show you how to modify the existing components to use this dummy data instead of the database.
// First, let's create the dummyData.js file:
  
// src/data/dummyData.js
export const dummyCards = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    category: {
      department: "Geography",
      class: "World Capitals",
      subject: "European Countries",
      strand: "Capital Cities",
      subStrand: "Western Europe"
    }
  },
  {
    id: 2,
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    category: {
      department: "Literature",
      class: "Classic Literature",
      subject: "English Literature",
      strand: "Plays",
      subStrand: "Tragedies"
    }
  },
  {
    id: 3,
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    category: {
      department: "Science",
      class: "Chemistry",
      subject: "Elements",
      strand: "Metals",
      subStrand: "Precious Metals"
    }
  },
  {
    id: 4,
    question: "What year did World War II end?",
    answer: "1945",
    category: {
      department: "History",
      class: "World History",
      subject: "20th Century",
      strand: "Wars",
      subStrand: "World War II"
    }
  },
  {
    id: 5,
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    category: {
      department: "Science",
      class: "Astronomy",
      subject: "Solar System",
      strand: "Planets",
      subStrand: "Gas Giants"
    }
  }
];

export const dummyCategories = {
  department: ["Geography", "Literature", "Science", "History"],
  class: ["World Capitals", "Classic Literature", "Chemistry", "World History", "Astronomy"],
  subject: ["European Countries", "English Literature", "Elements", "20th Century", "Solar System"],
  strand: ["Capital Cities", "Plays", "Metals", "Wars", "Planets"],
  subStrand: ["Western Europe", "Tragedies", "Precious Metals", "World War II", "Gas Giants"]
};

// Now, let's modify the existing components to use this dummy data:

// Modify src/context/CardContext.js:

import React, { createContext, useReducer, useContext } from 'react';
import { dummyCards, dummyCategories } from '../data/dummyData';

const CardContext = createContext();

const initialState = {
  cards: dummyCards,
  categories: dummyCategories,
  currentMode: 'study',
  progress: {}
};

// ... rest of the file remains the same



// Modify src/screens/StudyModeScreen.js:
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlipCard from '../components/FlipCard';
import CategorySelector from '../components/CategorySelector';
import { useCardContext } from '../context/CardContext';

export default function StudyModeScreen() {
  const { state } = useCardContext();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const nextCard = () => {
    if (currentCardIndex < state.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <CategorySelector />
      {state.cards.length > 0 ? (
        <FlipCard 
          frontContent={state.cards[currentCardIndex].question}
          backContent={state.cards[currentCardIndex].answer}
        />
      ) : (
        <Text>No cards available</Text>
      )}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.button} onPress={prevCard}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextCard}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles remain the same


// Modify src/screens/QuizModeScreen.js:

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlipCard from '../components/FlipCard';
import ProgressBar from '../components/ProgressBar';
import { useCardContext } from '../context/CardContext';

export default function QuizModeScreen() {
  const { state, dispatch } = useCardContext();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < state.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Quiz finished
      dispatch({ type: 'UPDATE_PROGRESS', payload: { quizScore: score, totalCards: state.cards.length } });
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar current={currentCardIndex + 1} total={state.cards.length} />
      {state.cards.length > 0 && currentCardIndex < state.cards.length ? (
        <>
          <FlipCard 
            frontContent={state.cards[currentCardIndex].question}
            backContent={state.cards[currentCardIndex].answer}
          />
          <View style={styles.answerButtons}>
            <TouchableOpacity style={[styles.button, styles.incorrectButton]} onPress={() => handleAnswer(false)}>
              <Text style={styles.buttonText}>Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.correctButton]} onPress={() => handleAnswer(true)}>
              <Text style={styles.buttonText}>Correct</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Quiz Finished! Your score: {score}/{state.cards.length}</Text>
      )}
    </View>
  );
}

// ... styles remain the same


// Modify src/components/CategorySelector.js:

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCardContext } from '../context/CardContext';

export default function CategorySelector() {
  const { state, dispatch } = useCardContext();

  const categories = Object.keys(state.categories);

  const selectCategory = (category) => {
    // This is a simple implementation. You might want to add more complex logic
    // to handle subcategories based on the selected parent category.
    dispatch({ type: 'SET_CATEGORIES', payload: { [category]: state.categories[category] } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category:</Text>
      {categories.map((category) => (
        <TouchableOpacity 
          key={category} 
          style={styles.categoryButton}
          onPress={() => selectCategory(category)}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ... styles remain the same


// These modifications will allow your app to use the dummy data instead of fetching from a database. The app structure remains the same, but now it's populated with sample data.
// To use this in your app:

// Create the src/data/dummyData.js file with the provided content.
// Update the other files as shown above.
// Remove or comment out any database-related imports or functions that are no longer needed (like getCards from the database file).

// This approach allows you to develop and test your app's functionality without setting up a database. Once you're ready to implement real data storage, you can replace the dummy data with actual database calls.


<TouchableOpacity className='flex flex-row items-center justify-center p-2 mt-5 bg-slate-900 rounded-md shadow-lg shadow-black'>
 <Text className='text-white text-center text-base font-nunito-semibiold'>
{selectedClass ? "Update Class" : "Add Class"}
</Text>
</TouchableOpacity>

// Give this button a linear gradient using expo-linear-gradient.
// Use these colors:
// '#020617', '#1a202c', '#2d3748'

npx expo install expo-linear-gradient

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientButton = ({ selectedClass }) => (
  <TouchableOpacity>
    <LinearGradient
      colors={['#020617', '#1a202c', '#2d3748']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className='flex flex-row items-center justify-center p-2 mt-5 rounded-md shadow-lg shadow-black'
    >
      <Text className='text-white text-center text-base font-nunito-semibiold'>
        {selectedClass ? "Update Class" : "Add Class"}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default GradientButton;





import GradientButton from './path/to/GradientButton';

<GradientButton selectedClass={selectedClass} />



  






  












  
