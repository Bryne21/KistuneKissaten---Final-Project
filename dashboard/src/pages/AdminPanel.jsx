import { useState, useEffect } from 'react';
import { 
    TextField, Button, Table, TableBody, TableRow, TableCell, 
    TableHead, TableContainer, Avatar
} from "@mui/material";
import './AdminPanel.css';
import axios from "axios";
import { Link } from 'react-router-dom';

function AdminPanel() {
    // Menu States
    const [menuId, setMenuId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [menuList, setMenuList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    // User States
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    function fetchMenu() {
        axios.get("http://localhost:1337/menu")
            .then((response) => setMenuList(response.data))
            .catch((error) => console.error("Error fetching menu:", error));
    }

    function fetchUsers() {
        axios.get("http://localhost:1337/users-db")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error fetching users:", err));
    }

    useEffect(() => {
        fetchMenu();
        fetchUsers();
    }, []);

    const clearForm = () => {
        setMenuId('');
        setName('');
        setDescription('');
        setPrice('');
        setSelectedFile(null);
        setImagePreview(null);
        setEditIndex(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (!menuId || !name || !description || !price) {
            alert("Error: Please fill in all required fields.");
            return false;
        }
        return true;
    };

    const handleEdit = (menu) => {
        setMenuId(menu.id);
        setName(menu.name);
        setDescription(menu.description);
        setPrice(menu.price);
        setImagePreview(menu.photo);
        setEditIndex(menu.id); // store the ID instead of array index
    };

    async function handleAddMenu() {
        if (!validateForm()) return;

        const idExists = menuList.some(item => item.id === menuId);
        if (idExists) {
            alert("Error: Menu ID must be unique!");
            return;
        }

        const formData = new FormData();
        const menuData = {
            id: menuId,
            name: name,
            description: description,
            price: price
        };

        formData.append("menuData", JSON.stringify(menuData));
        if (selectedFile) {
            formData.append("photo", selectedFile);
        }

        try {
            await axios.post("http://localhost:1337/add-menu", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            alert("Menu Added Successfully");
            clearForm();
            fetchMenu();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleUpdateMenu() {
        if (!validateForm()) return;

        const formData = new FormData();
        const menuData = {
            id: menuId,
            name: name,
            description: description,
            price: price
        };

        formData.append("menuData", JSON.stringify(menuData));
        if (selectedFile) {
            formData.append("photo", selectedFile);
        }

        try {
            await axios.put(`http://localhost:1337/edit-menu/${editIndex}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            alert("Menu Updated Successfully");
            clearForm();
            fetchMenu();
        } catch (error) {
            console.error("Error updating menu:", error);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            await axios.delete(`http://localhost:1337/delete-menu/${id}`);
            alert("Menu Deleted Successfully");
            fetchMenu();
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    }

    async function handleAddUser() {
        if (!userName || !userEmail || !userPassword) {
            alert("Please fill all user fields.");
            return;
        }
        try {
            await axios.post("http://localhost:1337/add-user-db", {
                name: userName,
                email: userEmail,
                password: userPassword
            });
            alert("User added successfully!");
            setUserName('');
            setUserEmail('');
            setUserPassword('');
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="main-container admin-theme">
            <header className="admin-header">
                <h2>Admin Dashboard</h2>
                <Link to="/" className="home-link">Back to Website</Link>
            </header>
            <div className="main">
                {/* MENU MANAGEMENT SECTION */}
                <div className="AddMenuForm">
                    <h1>{editIndex !== null ? "Edit Menu Item" : "Add Menu Item"}</h1>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                        <Avatar src={imagePreview} sx={{ width: 80, height: 80, mb: 1 }} variant="rounded" />
                        <Button variant="outlined" component="label" size="small" sx={{ color: 'var(--burnt-orange)', borderColor: 'var(--burnt-orange)' }}>
                            Upload Photo
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </div>

                    <TextField 
                        label="Item ID" fullWidth margin="normal" required
                        value={menuId} type="text" disabled={editIndex !== null}
                        onChange={(e) => setMenuId(e.target.value)}
                    />
                    
                    <TextField label="Name" fullWidth margin="normal" required value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Description" fullWidth margin="normal" multiline rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TextField label="Price" fullWidth margin="normal" required value={price} type="number" onChange={(e) => setPrice(e.target.value)} />
                    
                    <div style={{ marginTop: '20px' }}>
                        {editIndex === null ? (
                            <Button variant="contained" sx={{ bgcolor: 'var(--burnt-orange)' }} onClick={handleAddMenu}>Add Menu</Button>
                        ) : (
                            <Button variant="contained" sx={{ bgcolor: 'var(--dark-wood)' }} onClick={handleUpdateMenu}>Update Menu</Button>
                        )}
                        {editIndex !== null && <Button variant="text" onClick={clearForm} style={{ marginLeft: '10px' }}>Cancel</Button>}
                    </div>
                </div>

                <div className="Preview">
                    <h1>Menu List</h1>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Photo</strong></TableCell>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                    <TableCell><strong>Edit</strong></TableCell>
                                    <TableCell><strong>Delete</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menuList.map((m, index) => (
                                    <TableRow key={m.id || index}>
                                        <TableCell><Avatar src={m.photo} variant="rounded" /></TableCell>
                                        <TableCell>{m.id}</TableCell>
                                        <TableCell>{m.name}</TableCell>
                                        <TableCell>{m.description}</TableCell>
                                        <TableCell>₱{m.price}</TableCell>
                                        <TableCell><Button variant="outlined" onClick={() => handleEdit(m)}>Edit</Button></TableCell>
                                        <TableCell><Button variant="outlined" color="error" onClick={() => handleDelete(m.id)}>Delete</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* USER MANAGEMENT SECTION */}
                <div className="AddMenuForm" style={{ marginTop: '2rem' }}>
                    <h1>Add User</h1>
                    <TextField label="Name" fullWidth margin="normal" required value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <TextField label="Email" fullWidth margin="normal" required value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth margin="normal" required value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                    <Button variant="contained" sx={{ bgcolor: 'var(--burnt-orange)', mt: 2 }} onClick={handleAddUser}>Add User</Button>
                </div>
                
                <div className="Preview" style={{ marginTop: '2rem' }}>
                    <h1>User List</h1>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>
    );
}

export default AdminPanel;
