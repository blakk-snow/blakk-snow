This is working code:

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { openDatabaseAsync, setupDatabase, createTodo, getTodos, updateTodo, deleteTodo } from '../services/database';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';


export default function TodoScreen({navigation}) {
    const [db, setDb] = useState(null);
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user, logout } = useAuth();

    useFocusEffect(
        React.useCallback(() => {
          if (!user) {
            navigation.replace('Login');
          }
        }, [user, navigation])
      );
    
      useEffect(() => {
        const initDb = async () => {
          if (user) {
            try {
              const database = await openDatabaseAsync();
              setDb(database);
              await setupDatabase(database);
              await loadTodos(database);
            } catch (error) {
              console.error('Failed to initialize database:', error);
              Alert.alert('Error', 'Failed to initialize database');
            }
          }
        };
    
        initDb();
      }, [user]);



    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };



  const loadTodos = async (database) => {
    try {
      const todoData = await getTodos(database);
      setTodos(todoData);
    } catch (error) {
      console.error('Failed to load Todo data:', error);
      Alert.alert('Error', 'Failed to load Todo data');
    }
  };



  const handleAddOrUpdateTodo = async () => {
    try {
      const todoData = { title, description, dueDate, priority };
      if (selectedTodo) {
        await updateTodo(db, selectedTodo.id, todoData);

        setSelectedTodo(null);
      } else {
        await createTodo(db, todoData);
      }
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Low');
      await loadTodos(db);
    } catch (error) {
      console.error('Failed to add/update Todo:', error);
      Alert.alert('Error', 'Failed to add/update Todo: ' + error.message);
    }
  };



  const handleUpdateTodo = (item) => {
    setSelectedTodo({
      id: item.id,
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      priority: item.priority
    });
    setTitle(item.title);
    setDescription(item.description);
    setDueDate(item.dueDate);
    setPriority(item.priority);
  };

  const handleDeleteTodo = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "YES, DELETE IT!",
          onPress: async () => {
            try {
              await deleteTodo(db, id);
              await loadTodos(db); // Reload the data after deleting class info
            } catch (error) {
              console.error("Failed to delete class data:", error);
            }
          }
        }
      ]
    );
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Due: {item.due_date}</Text>
      <Text>Priority: {item.priority}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUpdateTodo(item.id, item.status === 'Pending' ? 'Completed' : 'Pending')}
      >
        <Text style={styles.buttonText}>Toggle Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={() => handleDeleteTodo(item.id)}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );



  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTodos(db);
    } catch (error) {
      console.error('Failed to refresh Todo data:', error);
      Alert.alert('Error', 'Failed to refresh Todo data');
    } finally {
      setRefreshing(false);
    }
  }, [db]);



  if (!db) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


  if (!user) {
    return null; // or a loading indicator
}


  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Priority (Low/Medium/High)"
          value={priority}
          onChangeText={setPriority}
        />
        <Button 
          onPress={handleAddOrUpdateTodo}
          title={selectedTodo ? "Update Todo" : "Add Todo"} />
      </View>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#9c27b0"]} // You can customize the color
              tintColor="#9c27b0" // For iOS
            />
          }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  todoItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});



// But I don't really like the Look And Feel of it. I think you can do a better UI, with a checkbox used for toggling status

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { openDatabaseAsync, setupDatabase, createTodo, getTodos, updateTodo, deleteTodo } from '../services/database';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function TodoScreen({navigation}) {
    const [db, setDb] = useState(null);
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user, logout } = useAuth();

    // ... (keep the existing useFocusEffect and useEffect hooks)

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    // ... (keep the existing loadTodos, handleAddOrUpdateTodo, handleUpdateTodo, and handleDeleteTodo functions)

    const toggleTodoStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
            await updateTodo(db, id, { status: newStatus });
            await loadTodos(db);
        } catch (error) {
            console.error('Failed to toggle Todo status:', error);
            Alert.alert('Error', 'Failed to update Todo status');
        }
    };

    const renderTodoItem = ({ item }) => (
        <View style={styles.todoItem}>
            <TouchableOpacity 
                style={styles.checkbox} 
                onPress={() => toggleTodoStatus(item.id, item.status)}
            >
                {item.status === 'Completed' && <Ionicons name="checkmark" size={24} color="#4CAF50" />}
            </TouchableOpacity>
            <View style={styles.todoContent}>
                <Text style={[
                    styles.todoTitle, 
                    item.status === 'Completed' && styles.completedTodoTitle
                ]}>
                    {item.title}
                </Text>
                <Text style={styles.todoDescription}>{item.description}</Text>
                <View style={styles.todoDetails}>
                    <Text style={styles.todoDueDate}>Due: {item.due_date}</Text>
                    <View style={[styles.priorityBadge, styles[`priority${item.priority}`]]}>
                        <Text style={styles.priorityText}>{item.priority}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(item.id)}
            >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    // ... (keep the existing onRefresh function and conditional renders)

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Due Date (YYYY-MM-DD)"
                    value={dueDate}
                    onChangeText={setDueDate}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Priority (Low/Medium/High)"
                    value={priority}
                    onChangeText={setPriority}
                />
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddOrUpdateTodo}
                >
                    <Text style={styles.addButtonText}>
                        {selectedTodo ? "Update Todo" : "Add Todo"}
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={todos}
                renderItem={renderTodoItem}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#4CAF50"]}
                        tintColor="#4CAF50"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
    form: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todoContent: {
        flex: 1,
    },
    todoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    completedTodoTitle: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    todoDescription: {
        marginBottom: 5,
        color: '#555',
    },
    todoDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    todoDueDate: {
        fontSize: 12,
        color: '#888',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityLow: {
        backgroundColor: '#8BC34A',
    },
    priorityMedium: {
        backgroundColor: '#FFC107',
    },
    priorityHigh: {
        backgroundColor: '#FF5722',
    },
    priorityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 5,
    },
});


// Here are the key changes and improvements:

// Replaced the "Toggle Status" button with a checkbox.
// Used Ionicons for the checkbox and delete button.
// Improved the layout of todo items, including a more visually appealing arrangement of title, description, due date, and priority.
// Added color-coded priority badges.
// Implemented a strike-through effect for completed todos.
// Enhanced the overall styling, including better color choices and spacing.
// Improved the "Add Todo" button style.

// To use this updated code, you'll need to ensure you have the @expo/vector-icons package installed. If you don't have it, you can install it with:

npm install @expo/vector-icons



