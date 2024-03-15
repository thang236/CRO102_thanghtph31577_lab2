import React, { useEffect, useState, useContext, createContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AuthContext from './AuthContext';


const LoginScreen = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);


    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [accounts, setAccounts] = useState([]);
    const MyContext = createContext({});



    useEffect(() => {
        getAccount();
    }, [])

    const getAccount = () => {
        fetch('http://localhost:3000/account')
            .then(res => res.json())
            .then(data => setAccounts(data))
    }

    const handleLogin = () => {
        console.log('Đăng nhập với:', { username, password });
        const user = accounts.find(account => account.user == username && account.password == password);
        if (user) {
            alert('Login thành công')
            setIsLoggedIn(true);
            navigation.navigate('home')


        } else {
            alert('Login thất bại')

        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
