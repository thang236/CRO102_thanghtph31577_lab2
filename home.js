import React, { useEffect, useMemo, useState, useCallback, useContext } from 'react';

import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AuthContext from './AuthContext';




export default function Home({ navigation }) {
    const { isLoggedIn } = useContext(AuthContext);
    const [todoItems, setTodoItems] = useState([]);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [trangThai, setTrangThai] = useState('');
    const [id, setId] = useState(-1);

    const completeTask = useMemo(() => {
        return todoItems.filter(item => item.status === 1).length;
    }, [todoItems]);

    const notCompleteTask = useMemo(() => {
        return todoItems.filter(item => item.status === 0).length;
    }, [todoItems]);

    useEffect(() => {
        getData();
    }, [])

    const getData = useCallback(() => {
        fetch('http://localhost:3000/task')
            .then(res => res.json())
            .then(data => {
                setTodoItems(data);
            });
    }, []);

    const addTodo = useCallback(() => {
        const newTask = {
            "content": content,
            "titile": title,
            "status": Number(trangThai)
        }
        fetch('http://localhost:3000/task', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask)
        }).then(res => {
            if (res.status == 201) {
                alert('Thêm thành công');
                getData();
            }
        })
    }, [content, title, trangThai, getData]);

    const clearTodos = useCallback(() => {
        setContent('');
        setTitle('');
        setTrangThai('');
        setId(-1);
    }, []);

    const deleteTask = useCallback((taskId) => {
        fetch('http://localhost:3000/task/' + taskId, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status == 200) {
                alert('xóa thành công');
                getData();
            }
        })
    }, [getData]);

    const handleEdit = useCallback((task) => {
        setContent(task.content);
        setTitle(task.titile);
        setTrangThai('' + task.status);
        setId(task.id);
    }, []);

    const updateTask = useCallback(() => {
        if (id == -1) {
            alert('Vui lòng chọn task cần sửa')
        } else {
            const newTask = {
                "content": content,
                "titile": title,
                "status": Number(trangThai)
            }
            fetch('http://localhost:3000/task/' + id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask)
            }).then(res => {
                if (res.status == 200) {
                    alert('sửa thành công');
                    getData();
                }
            })
        }
    }, [content, title, trangThai, id, getData]);

    const updateStatus = useCallback((item) => {
        const newStatus = item.status === 0 ? 1 : 0;
        fetch('http://localhost:3000/task/' + item.id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...item, status: newStatus })
        }).then(res => {
            if (res.status == 200) {
                alert('sửa thành công');
                getData();
            }
        })
    }, [getData]);

    const renderItem = useCallback(({ item }) => {
        let temp;
        let statusColor;
        if (item.status == 0) {
            temp = 'Chưa hoàn thành'
            statusColor = 'red';
        } else {
            temp = 'Hoàn thành';
            statusColor = 'green'
        }
        return (<View style={styles.todoItem}>
            <View>
                <Text style={{ fontWeight: 'bold' }}>title: {item.titile}</Text>
                <Text style={{ fontWeight: 'bold' }}>Content: {item.content}</Text>
                <Text style={{ fontWeight: 'bold', color: statusColor }}>status: {temp}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { updateStatus(item) }} >
                    <Feather name="check" size={25} color="#FFDC0D" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { handleEdit(item) }} >
                    <Feather name="edit" size={25} color="black" />
                </TouchableOpacity >
                <TouchableOpacity onPress={() => { deleteTask(item.id) }} >
                    <Feather name="trash" size={25} color="red" />
                </TouchableOpacity>
            </View>
        </View>)
    }, [deleteTask, handleEdit, updateStatus]);

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>Todo App</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{isLoggedIn ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</Text>
                <Button
                    title={isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}
                    onPress={() => navigation.navigate(isLoggedIn ? 'login' : 'home')}
                />
            </View>

            <Text style={{ fontSize: 17, marginBottom: 20 }}>Task hoàn thành {completeTask}, task chưa hoàn thành {notCompleteTask}</Text>
            <FlatList
                data={todoItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter title"
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter content"
                    value={content}
                    onChangeText={text => setContent(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter status"
                    value={trangThai}
                    onChangeText={text => setTrangThai(text)}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Button title="Add" onPress={addTodo} />
                    <Button title="Clear All" onPress={clearTodos} />
                    <Button title="Edit" onPress={updateTask} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        marginTop: 60,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        width: 350,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    todoItem: {
        backgroundColor: '#FB9C9C',
        marginBottom: 20,
        width: 350,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 20,
    },
});
